package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.CandidatoPlantao;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.PlantaoEspecialidade;
import br.com.plantaomais.entitybean.PlantaoSetor;
import br.com.plantaomais.entitybean.Setor;
import br.com.plantaomais.filtro.FiltroGestaoEscala;
import br.com.plantaomais.mapper.CandidatoPlantaoMapper;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.mapper.UsuarioMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.DateUtils;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.util.ReportUtils;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.util.email.EmailSendGrid;
import br.com.plantaomais.util.email.SendGridUtil;
import br.com.plantaomais.vo.ArquivoVo;
import br.com.plantaomais.vo.CandidatoPlantaoVo;
import br.com.plantaomais.vo.EscalaReportVo;
import br.com.plantaomais.vo.EscalaVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.UsuarioVo;
import br.com.plantaomais.vo.layoutEscala.DiasVo;
import br.com.plantaomais.vo.layoutEscala.LayoutEscalaVo;
import br.com.plantaomais.vo.layoutEscala.PlantoesVo;
import br.com.plantaomais.vo.layoutEscala.SetoresVo;
import br.com.plantaomais.vo.layoutEscala.TurnosVo;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.HibernateException;
import org.joda.time.DateTime;
import org.joda.time.DateTimeConstants;
import org.joda.time.Weeks;

import javax.validation.constraints.NotNull;
import java.io.ByteArrayOutputStream;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;
import static java.util.stream.Collectors.toList;

/**
 * Created by nextage on 22/05/2019.
 */
public class GestaoEscalaController extends Controller {

    private static final Logger logger = Logger.getLogger(EscalaController.class.getName());


    public <T extends Principal> GestaoEscalaController(T vo) throws AuthenticationException {
        super(vo);
    }

    public Info listaLayoutEscala(@NotNull FiltroGestaoEscala filtroGestaoEscala) {
        if (filtroGestaoEscala != null) {
            if (filtroGestaoEscala.getTipo() != null) {
                if (filtroGestaoEscala.getTipo().equals("MES")) {
                    return listaLayoutEscalaMes(filtroGestaoEscala.getEscalaVo());
                } else {
                    return listaLayoutEscalaDia(filtroGestaoEscala.getEscalaVo(), filtroGestaoEscala.getData());
                }
            }
        }
        return Info.GetError("Ocorreu um erro");
    }

    public Info listaLayoutEscalaByWorkplaceId(@NotNull Integer workplaceId) {
        var basicEscalaQuery = "select e from Escala e " +
                "left join e.workplace w " +
                "where w.id = :id " +
                "and (e.excluido = false or e.excluido is null)" +
                "and (e.isDraft = false) " +
                "and (e.ativo = true)";
        var escalas = (List<Escala>) getSession()
                .createQuery(basicEscalaQuery).setInteger("id", workplaceId).list();
        List<List<LayoutEscalaVo>> response = new ArrayList<>();
        for (Escala escala : escalas) {
            var escalaVo = new EscalaVo();
            escalaVo.setId(escala.getId());
            var info = listaLayoutEscalaMes(escalaVo);
            if (info.getErro()) {
                return Info.GetError("Ocorreu um erro");
            }
            response.add((List<LayoutEscalaVo>) info.getObjeto());
        }
        return Info.GetSuccess(response);
    }

    private Info listaLayoutEscalaDia(@NotNull final EscalaVo escalaVo, final Date dia) {
        LayoutEscalaVo layoutEscalaVo = new LayoutEscalaVo();
        try {
            if (escalaVo == null || escalaVo.getId() == null) {
                return Info.GetError("Não foi possível localizar a escala");
            }

            final Escala escala = obterEscalaPorId(escalaVo.getId());
            List<PlantaoSetor> listaPlantaoSetor = listarPlantaoSetorPorEscala(escala);
            /**
             * ATENÇÃO: NÃO MODIFICAR A CONVERSÃO DA DATA. PRECISA DO TIMEZONE PARA FUNCIONAR NO GCLOUD.
             */
            DateTime inicioPeriodo = new DateTime(Util.converterDataTimeZone(dia))
                    .withHourOfDay(0)
                    .withMinuteOfHour(0)
                    .withSecondOfMinute(0)
                    .withMillisOfSecond(0);
            DateTime fimPeriodo = inicioPeriodo
                    .withHourOfDay(23)
                    .withMinuteOfHour(59)
                    .withSecondOfMinute(59)
                    .withMillisOfSecond(0);


            List<TurnosVo> TURNOS = obterPlantoesComSetoresEturnos(listaPlantaoSetor, inicioPeriodo.toDate(), fimPeriodo.toDate());

            layoutEscalaVo.setTURNOS(TURNOS);


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("Erro ao gerar escala");
        }
        return Info.GetSuccess(layoutEscalaVo);
    }

    private Info listaLayoutEscalaMes(@NotNull final EscalaVo escalaVo) {
        List<LayoutEscalaVo> SEMANAS = new ArrayList<>();
        try {
            if (escalaVo == null || escalaVo.getId() == null) {
                return Info.GetError("Não foi possível localizar a escala");
            }
            SimpleDateFormat sdf = new SimpleDateFormat("MM/YYYY", new Locale("pt", "BR"));
            final Escala escala = obterEscalaPorId(escalaVo.getId());
            List<PlantaoSetor> listaPlantaoSetor = listarPlantaoSetorPorEscala(escala);
            DateTime inicioPeriodo = new DateTime(Util.converterDataTimeZone(escala.getPeriodoInicio()));
            DateTime fimPeriodo = new DateTime(Util.converterDataTimeZone(escala.getPeriodoFim()));

            String MesAno = Util.dateToString(inicioPeriodo.toDate(), sdf, this.timeZone);

            DateTime inicioMes = inicioPeriodo.withDayOfWeek(DateTimeConstants.MONDAY)
                    .withHourOfDay(0)
                    .withMinuteOfHour(0)
                    .withSecondOfMinute(0)
                    .withMillisOfSecond(0);
            //System.out.println("PERÍODO: " + Util.dateToString(inicioPeriodo.toDate(), this.timeZone) + " - " + Util.dateToString(fimPeriodo.toDate(), this.timeZone));
            // System.out.println("PERÍODO CHEIO: " + Util.dateToString(inicioMes.toDate(), this.timeZone) + " - " + Util.dateToString(fimPeriodo.toDate(), this.timeZone));

            int semanas = Weeks.weeksBetween(inicioMes, fimPeriodo).getWeeks();

            DateTime inicio = inicioMes;
            DateTime inicioSemana = inicio;
            DateTime fimSemana = irParaFinalDaSemnana(inicioSemana);

            //System.out.println("SEMANAS:");

            for (int i = 0; i < semanas; i++) {
                LayoutEscalaVo semana = new LayoutEscalaVo();
                //System.out.println("INICIO: " + Util.dateToString(inicioSemana.toDate(), this.timeZone) + " FIM: " + Util.dateToString(fimSemana.toDate(), this.timeZone));

                List<TurnosVo> TURNOS = obterPlantoesComSetoresEturnos(listaPlantaoSetor, inicioSemana.toDate(), fimSemana.toDate());
                List<DiasVo> DIAS = new ArrayList<>();

                DiasVo diasVoMesAno = new DiasVo();
                diasVoMesAno.setStr(MesAno);
                DIAS.add(diasVoMesAno);

                DateTime diaDaSemana = inicioSemana;

                for (int chaveDia = 0; chaveDia < 7; chaveDia++) {

                    DiasVo diasVo = setDiaSemana(diaDaSemana);
                    DIAS.add(diasVo);
                    diaDaSemana = diaDaSemana.plusDays(1);
                }
                semana.setNumSemana(i + 1);
                semana.setDIAS(DIAS);
                semana.setTURNOS(TURNOS);
                SEMANAS.add(semana);

                inicio = fimSemana.plusSeconds(1);
                inicioSemana = inicio;
                fimSemana = irParaFinalDaSemnana(inicioSemana);
            }
            if (fimSemana != fimPeriodo) {
                //System.out.println("INICIO: " + Util.dateToString(inicioSemana.toDate(), this.timeZone) + " FIM: " + Util.dateToString(fimSemana.toDate(), this.timeZone));

                LayoutEscalaVo semana = new LayoutEscalaVo();
                DateTime diaDaSemana = inicioSemana;
                List<TurnosVo> TURNOS = obterPlantoesComSetoresEturnos(listaPlantaoSetor, inicioSemana.toDate(), fimSemana.toDate());
                List<DiasVo> DIAS = new ArrayList<>();
                DiasVo diasVoMesAno = new DiasVo();
                diasVoMesAno.setStr(MesAno);
                DIAS.add(diasVoMesAno);
                for (int chaveDia = 0; chaveDia < 7; chaveDia++) {
                    DiasVo diasVo = setDiaSemana(diaDaSemana);
                    DIAS.add(diasVo);
                    diaDaSemana = diaDaSemana.plusDays(1);
                }
                semana.setNumSemana(SEMANAS.size() + 1);
                semana.setDIAS(DIAS);
                semana.setTURNOS(TURNOS);
                SEMANAS.add(semana);
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("Erro ao gerar escala");
        }
        return Info.GetSuccess(SEMANAS);
    }

    private DiasVo setDiaSemana(@NotNull final DateTime data) {
        DiasVo diasVo = new DiasVo();
        diasVo.setData(data.toDate());

        switch (data.dayOfWeek().get()) {
            case 1:
                diasVo.setStr(Constants.SEGUNDA);
                break;
            case 2:
                diasVo.setStr(Constants.TERCA);
                break;
            case 3:
                diasVo.setStr(Constants.QUARTA);
                break;
            case 4:
                diasVo.setStr(Constants.QUINTA);
                break;
            case 5:
                diasVo.setStr(Constants.SEXTA);
                break;
            case 6:
                diasVo.setStr(Constants.SABADO);
                break;
            case 7:
                diasVo.setStr(Constants.DOMINGO);
                break;
        }
        return diasVo;
    }

    private static DateTime irParaFinalDaSemnana(final DateTime from) {
        return from.plusDays(6)
                .withHourOfDay(23)
                .withMinuteOfHour(59)
                .withSecondOfMinute(59)
                .withMillisOfSecond(0);
    }


    private Escala obterEscalaPorId(int id) throws Exception {
        GenericDao<Escala> genericDao = new GenericDao<>();

        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(Escala.ID));
        propriedades.add(new Propriedade(Escala.NOME_ESCALA));
        propriedades.add(new Propriedade(Escala.PERIODO_INICIO));
        propriedades.add(new Propriedade(Escala.PERIODO_FIM));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Escala.ID, id, Filtro.EQUAL));

        return genericDao.selectUnique(propriedades, Escala.class, nxCriterion);
    }

    private List<PlantaoSetor> listarPlantaoSetorPorEscala(Escala escala) throws Exception {
        GenericDao<PlantaoSetor> dao = new GenericDao();
        List<Propriedade> propriedades = new ArrayList<>();

        propriedades.add(new Propriedade(PlantaoSetor.ID));

        String aliasSetor = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.SETOR);
        propriedades.add(new Propriedade(Setor.ID, Setor.class, aliasSetor));
        propriedades.add(new Propriedade(Setor.DESCRICAO, Setor.class, aliasSetor));

        String aliasPlantao = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO);
        propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));
        propriedades.add(new Propriedade(Plantao.DIA, Plantao.class, aliasPlantao));
        propriedades.add(new Propriedade(Plantao.TURNO, Plantao.class, aliasPlantao));
        propriedades.add(new Propriedade(Plantao.HORA_INICIO, Plantao.class, aliasPlantao));
        propriedades.add(new Propriedade(Plantao.HORA_FIM, Plantao.class, aliasPlantao));
        propriedades.add(new Propriedade(Plantao.BLOQUEADO, Plantao.class, aliasPlantao));
        propriedades.add(new Propriedade(Plantao.STATUS, Plantao.class, aliasPlantao));
        propriedades.add(new Propriedade(Plantao.DATA, Plantao.class, aliasPlantao));
        propriedades.add(new Propriedade(Plantao.EM_TROCA, Plantao.class, aliasPlantao));
        propriedades.add(new Propriedade(Plantao.VALOR, Plantao.class, aliasPlantao));

        String aliasMedico = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO, Plantao.MEDICO);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
        propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));
        propriedades.add(new Propriedade(Medico.NUMERO_CRM, Medico.class, aliasMedico));
        propriedades.add(new Propriedade(Medico.TOKEN_PUSH_NOTIFICATION, Medico.class, aliasMedico));


        String aliasEscala = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO, Plantao.ESCALA);
        propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Escala.ID, escala.getId(), Filtro.EQUAL, aliasEscala));
        nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL, aliasPlantao)));

        List<PlantaoSetor> lista = dao.listarByFilter(propriedades, null, PlantaoSetor.class, Constants.NO_LIMIT, nxCriterion);
        return lista;
    }

    /**
     * @param idPlantao
     * @return
     * @throws Exception
     */
    private boolean verificaTemCandidatoPlantao(int idPlantao) throws Exception {

        var lista = (List<CandidatoPlantao>) getSession()
                .createQuery("select cp from CandidatoPlantao cp " +
                        "left join cp.plantao p " +
                        "left join cp.medico m " +
                        "where p.id = :plantaoId and (cp.aceito is null or cp.aceito = :cpAceito) " +
                        "and (cp.excluido = :cpExcluido or cp.excluido is null) " +
                        "and (m.excluido = :mExcluido or m.excluido is null) " +
                        "and (cp.cancelado is null or cp.cancelado = :cpCancelado)")
                .setInteger("plantaoId", idPlantao)
                .setBoolean("cpAceito", false)
                .setBoolean("cpExcluido", false)
                .setBoolean("mExcluido", false)
                .setBoolean("cpCancelado", false)
                .list();

        return lista != null && lista.size() > 0;
    }


    private List<TurnosVo> obterPlantoesComSetoresEturnos(List<PlantaoSetor> lista, Date inicioSemana, Date fimSemana) throws Exception {
        List<TurnosVo> TURNOS = new ArrayList<>();

        List<Setor> setores = new ArrayList<>();
        for (PlantaoSetor plantaoSetor : lista) {
            if (!setores.contains(plantaoSetor.getSetor())) {
                setores.add(plantaoSetor.getSetor());
            }
        }

        List<PlantaoSetor> listaPlantaoSetorPeriodo = lista.stream()
                .filter(plantaoSetor ->
                        plantaoSetor.getPlantao().getData().getTime() >= inicioSemana.getTime() &&
                                plantaoSetor.getPlantao().getData().getTime() <= fimSemana.getTime())
                .collect(toList());

        ArrayList<SetoresVo> SETORES = new ArrayList<>();
        for (Setor setor : setores) {
            SETORES.add(new SetoresVo(setor.getDescricao()));
        }
        TURNOS.add(new TurnosVo(Constants.TURNO_MANHA, populaSetores(setores)));
        TURNOS.add(new TurnosVo(Constants.TURNO_TARDE, populaSetores(setores)));
        TURNOS.add(new TurnosVo(Constants.TURNO_NOITE, populaSetores(setores)));
        TURNOS.add(new TurnosVo(Constants.TURNO_CINDERELA, populaSetores(setores)));

        for (PlantaoSetor plantaoSetor : listaPlantaoSetorPeriodo) {
            if (plantaoSetor.getPlantao() != null && plantaoSetor.getPlantao().getTurno() != null) {
                TurnosVo turnosVo = null;
                for (TurnosVo turno : TURNOS) {
                    if (!turno.getDesc().equals(plantaoSetor.getPlantao().getTurno())) {
                        continue;
                    }
                    turnosVo = turno;
                }

                if (turnosVo != null) {

                    for (SetoresVo setoresVo : turnosVo.getSETORES()) {
                        if (!setoresVo.getDesc().equals(plantaoSetor.getSetor().getDescricao())) {
                            continue;
                        }

                        if (setoresVo.getPLANTOES() == null) {
                            setoresVo.setPLANTOES(new PlantoesVo());
                        }
                        final PlantaoVo plantaoVo = PlantaoMapper.convertToVo(plantaoSetor.getPlantao());
                        plantaoVo.setTemCandidatos(verificaTemCandidatoPlantao(plantaoVo.getId()));
                        final String especialidadesPlantao = obterEspecialidadesPlantao(plantaoSetor.getPlantao());
                        plantaoVo.setEspecialidades(especialidadesPlantao);
                        switch (plantaoSetor.getPlantao().getDia()) {
                            case Constants.SEGUNDA:
                                if (setoresVo.getPLANTOES().getSegunda() == null) {
                                    setoresVo.getPLANTOES().setSegunda(new ArrayList<>());
                                }
                                setoresVo.getPLANTOES().getSegunda().add(plantaoVo);
                                break;
                            case Constants.TERCA:
                                if (setoresVo.getPLANTOES().getTerca() == null) {
                                    setoresVo.getPLANTOES().setTerca(new ArrayList<>());
                                }
                                setoresVo.getPLANTOES().getTerca().add(plantaoVo);
                                break;
                            case Constants.QUARTA:
                                if (setoresVo.getPLANTOES().getQuarta() == null) {
                                    setoresVo.getPLANTOES().setQuarta(new ArrayList<>());
                                }
                                setoresVo.getPLANTOES().getQuarta().add(plantaoVo);
                                break;
                            case Constants.QUINTA:
                                if (setoresVo.getPLANTOES().getQuinta() == null) {
                                    setoresVo.getPLANTOES().setQuinta(new ArrayList<>());
                                }
                                setoresVo.getPLANTOES().getQuinta().add(plantaoVo);
                                break;
                            case Constants.SEXTA:
                                if (setoresVo.getPLANTOES().getSexta() == null) {
                                    setoresVo.getPLANTOES().setSexta(new ArrayList<>());
                                }
                                setoresVo.getPLANTOES().getSexta().add(plantaoVo);
                                break;
                            case Constants.SABADO:
                                if (setoresVo.getPLANTOES().getSabado() == null) {
                                    setoresVo.getPLANTOES().setSabado(new ArrayList<>());
                                }
                                setoresVo.getPLANTOES().getSabado().add(plantaoVo);
                                break;
                            case Constants.DOMINGO:
                                if (setoresVo.getPLANTOES().getDomingo() == null) {
                                    setoresVo.getPLANTOES().setDomingo(new ArrayList<>());
                                }
                                setoresVo.getPLANTOES().getDomingo().add(plantaoVo);
                                break;
                        }
                    }
                }
            }
        }

        return TURNOS;
    }


    private List<SetoresVo> populaSetores(List<Setor> setores) throws Exception {
        List<SetoresVo> SETORES = new ArrayList<>();
        for (Setor setor : setores) {
            SETORES.add(new SetoresVo(setor.getDescricao()));
        }
        return SETORES;
    }

    private String obterEspecialidadesPlantao(@NotNull final Plantao plantao) {
        StringBuilder stringBuilder = new StringBuilder();
        try {
            GenericDao<PlantaoEspecialidade> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(PlantaoEspecialidade.ID));

            String aliasPlantao = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            String aliasEspecialidade = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.ESPECIALIDADE);
            propriedades.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
            propriedades.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantao.getId(), Filtro.EQUAL, aliasPlantao));

            List<PlantaoEspecialidade> lista = dao.listarByFilter(propriedades, null, PlantaoEspecialidade.class, Constants.NO_LIMIT, nxCriterion);

            for (PlantaoEspecialidade plantaoEspecialidade : lista) {
                stringBuilder.append(plantaoEspecialidade.getEspecialidade().getDescricao());
                stringBuilder.append("; ");
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return stringBuilder.toString();
    }

    public Info gerarExcel(@NotNull final FiltroGestaoEscala filtroGestaoEscala) {
        if (filtroGestaoEscala != null) {
            if (filtroGestaoEscala.getTipo() != null) {
                if (filtroGestaoEscala.getTipo().equals("MES")) {
                    return this.generateReportMonth(filtroGestaoEscala);
                } else {
                    return gerarExcelDia(filtroGestaoEscala.getEscalaVo(), filtroGestaoEscala.getData(), filtroGestaoEscala.getPdf());
                }
            }
        }
        return Info.GetError("Ocorreu um erro");
    }

    private Info gerarExcelDia(@NotNull final EscalaVo escalaVo, @NotNull final Date data, @NotNull final Boolean pdf) {
        Info info;
        try {
            LayoutEscalaVo turnos = (LayoutEscalaVo) listaLayoutEscalaDia(escalaVo, data).getObjeto();
            SimpleDateFormat sdf = new SimpleDateFormat("EEEE", new Locale("pt", "BR"));
            String diaSemanaEscala = Util.dateToString(data, sdf, this.timeZone);
            sdf = new SimpleDateFormat("dd/MM");
            String diaMesEscala = Util.dateToString(data, sdf, this.timeZone);
            String diaEscala = diaSemanaEscala.concat(" - ").concat(diaMesEscala);


            sdf = new SimpleDateFormat("HH:mm");
            // Create a Workbook
            XSSFWorkbook workbook = new XSSFWorkbook(); // new HSSFWorkbook() for generating `.xls` file

            /* CreationHelper helps us create instances of various things like DataFormat,
            Hyperlink, RichTextString etc, in a format (HSSF, XSSF) independent way */
            CreationHelper createHelper = workbook.getCreationHelper();


            SimpleDateFormat formatterDiaMes = new SimpleDateFormat("dd/MM");
            // Create a Sheet
            Sheet sheet = workbook.createSheet(diaMesEscala.replace("/", "_"));

            // estilos das fontes
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 14);
            headerFont.setColor(IndexedColors.GREEN.getIndex());

            Font turnoFont = workbook.createFont();
            turnoFont.setBold(true);
            turnoFont.setFontHeightInPoints((short) 12);
            turnoFont.setColor(IndexedColors.GREEN.getIndex());

            // estilos das celulas
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);

            CellStyle dateCellStyle = workbook.createCellStyle();
            dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd-MM-yyyy"));

            CellStyle setorPlantaoStyle = workbook.createCellStyle();
            setorPlantaoStyle.setAlignment(HorizontalAlignment.CENTER);
            setorPlantaoStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle cs = workbook.createCellStyle();
            cs.setWrapText(true);
            cs.setAlignment(HorizontalAlignment.CENTER);
            cs.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle styleRowData = workbook.createCellStyle();
            styleRowData.setAlignment(HorizontalAlignment.CENTER);
            styleRowData.setVerticalAlignment(VerticalAlignment.CENTER);
            styleRowData.setWrapText(true);
            styleRowData.setFont(headerFont);

            CellStyle styleRowTurno = workbook.createCellStyle();
            styleRowTurno.setAlignment(HorizontalAlignment.CENTER);
            styleRowTurno.setVerticalAlignment(VerticalAlignment.CENTER);
            styleRowTurno.setWrapText(true);
            styleRowTurno.setFont(turnoFont);

            int numLinha = 0;

            Row rowData = sheet.createRow(numLinha);
            Cell cellSemana = rowData.createCell(0);
            cellSemana.setCellStyle(styleRowData);
            cellSemana.setCellValue(diaEscala);

            CellRangeAddress cellRangeAddress = new CellRangeAddress(numLinha, numLinha, 0, 1);
            //Mesclando as células
            sheet.addMergedRegion(cellRangeAddress);

            int numLinhaTurno = numLinha + 1;
            for (TurnosVo turno : turnos.getTURNOS()) {

                List<PlantaoVo> listaPlantao = new ArrayList<>();
                Row rowTurno = sheet.createRow(numLinhaTurno);
                Cell cellTurno = rowTurno.createCell(0);
                cellTurno.setCellStyle(styleRowTurno);
                cellTurno.setCellValue(turno.getDesc());
                CellRangeAddress cellRangeTurno = new CellRangeAddress(numLinhaTurno, numLinhaTurno, 0, 1);
                //Mesclando as células
                sheet.addMergedRegion(cellRangeTurno);

                for (SetoresVo setor : turno.getSETORES()) {
                    if (setor.getPLANTOES() != null) {
                        switch (diaSemanaEscala) {
                            case ("Segunda-feira"):
                                if (setor.getPLANTOES().getSegunda() != null) {
                                    listaPlantao = setor.getPLANTOES().getSegunda();
                                } else {
                                    listaPlantao = null;
                                }
                                break;
                            case ("Terça-feira"):
                                if (setor.getPLANTOES().getTerca() != null) {
                                    listaPlantao = setor.getPLANTOES().getTerca();
                                } else {
                                    listaPlantao = null;
                                }
                                break;
                            case ("Quarta-feira"):
                                if (setor.getPLANTOES().getQuarta() != null) {
                                    listaPlantao = setor.getPLANTOES().getQuarta();
                                } else {
                                    listaPlantao = null;
                                }
                                break;
                            case ("Quinta-feira"):
                                if (setor.getPLANTOES().getQuinta() != null) {
                                    listaPlantao = setor.getPLANTOES().getQuinta();
                                } else {
                                    listaPlantao = null;
                                }
                                break;
                            case ("Sexta-feira"):
                                if (setor.getPLANTOES().getSexta() != null) {
                                    listaPlantao = setor.getPLANTOES().getSexta();
                                } else {
                                    listaPlantao = null;
                                }
                                break;
                            case ("Sábado"):
                                if (setor.getPLANTOES().getSabado() != null) {
                                    listaPlantao = setor.getPLANTOES().getSabado();
                                } else {
                                    listaPlantao = null;
                                }
                                break;
                            case ("Domingo"):
                                if (setor.getPLANTOES().getDomingo() != null) {
                                    listaPlantao = setor.getPLANTOES().getDomingo();
                                } else {
                                    listaPlantao = null;
                                }
                                break;
                            default:
                                break;
                        }
                    } else {
                        listaPlantao = null;
                    }

                    if (listaPlantao != null) {
                        int numLinhaSetor = numLinhaTurno + 1;
                        Row rowSetor = sheet.createRow(numLinhaSetor);
                        Cell cellSetor = rowSetor.createCell(0);
                        cellSetor.setCellValue(setor.getDesc());

                        Cell cellDiaPlantao;
                        StringBuilder stringCelulaPlantao;

                        stringCelulaPlantao = new StringBuilder();
                        int contador = 0;
                        for (PlantaoVo plantaoVo : listaPlantao) {
                            if (contador > 0) {
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                            }
                            if (plantaoVo.getMedico() != null) {
                                stringCelulaPlantao.append(plantaoVo.getMedico().getNome());
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                                stringCelulaPlantao.append("CRM: " + plantaoVo.getMedico().getNumeroCrm());
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                            }
                            stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraInicio()));
                            stringCelulaPlantao.append("/");
                            stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraFim()));
                            stringCelulaPlantao.append(System.getProperty("line.separator"));
                            stringCelulaPlantao.append(plantaoVo.getEspecialidades());
                            contador++;
                        }
                        cellDiaPlantao = rowSetor.createCell(1);
                        cellDiaPlantao.setCellStyle(cs);
                        cellDiaPlantao.setCellValue(stringCelulaPlantao.toString());

                        numLinhaTurno = numLinhaSetor;
                    }

                }

                numLinhaTurno++;

            }


            Integer linhaFinal = numLinhaTurno - 1;
            cellRangeAddress = new CellRangeAddress(0, linhaFinal, 0, 1);
            RegionUtil.setBorderBottom(BorderStyle.MEDIUM, cellRangeAddress, sheet);
            RegionUtil.setBorderTop(BorderStyle.MEDIUM, cellRangeAddress, sheet);
            RegionUtil.setBorderLeft(BorderStyle.MEDIUM, cellRangeAddress, sheet);
            RegionUtil.setBorderRight(BorderStyle.MEDIUM, cellRangeAddress, sheet);


            for (int i = 0; i < 2; i++) {
                sheet.autoSizeColumn(i);
            }

            // Write the output to a file
//            FileOutputStream fileOut = new FileOutputStream("E:\\teste-escala.xlsx");
//            fileOut.close();
            /*ByteArrayOutputStream bos = new ByteArrayOutputStream();
            workbook.write(bos);
            byte[] bytes = bos.toByteArray();
            bos.close();*/
            ArquivoVo arquivoVo = new ArquivoVo();
            byte[] bytes;
            if (pdf) {
                byte[] bytesPdf = Util.converterXLSparaPDFDia(workbook);
                bytes = bytesPdf;
                arquivoVo.setPdf(true);
            } else {
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                workbook.write(bos);
                byte[] bytesXls = bos.toByteArray();
                bytes = bytesXls;
                bos.close();
                arquivoVo.setPdf(false);
            }

            // Closing the workbook
            workbook.close();
            arquivoVo.setArquivo(bytes);
            arquivoVo.setNmAnexo("Plantao_Mais_Escala_" + diaEscala);
            info = Info.GetSuccess(arquivoVo);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("Erro ao gerar excel, tente novamente.");
        }
        return info;
    }

    public Info generateReportMonth(FiltroGestaoEscala filtro) {
        Info info;
        boolean isOldPdf = filtro.getPdf() != null && filtro.getPdf();
        boolean isNewPdf = filtro.getNewPdf() != null && filtro.getNewPdf();
        try {

            List<String> header = EscalaReportVo.getHeaders();

            var query = "from PlantaoSetor ps " +
                    "where " +
                    "ps.plantao.escala.id = :escalaId and " +
                    "ps.plantao.excluido is false and " +
                    "month(ps.plantao.data) = :month and " +
                    "year(ps.plantao.data) = :year " +
                    "order by " +
                    "ps.plantao.data ";

            var date = new DateTime(filtro.getData());

            var result = (List<EscalaReportVo>) getSession()
                    .createQuery(query)
                    .setLong("escalaId", filtro.getEscalaVo().getId())
                    .setInteger("month", date.getMonthOfYear())
                    .setInteger("year", date.getYear())
                    .list()
                    .stream()
                    .map(it -> new EscalaReportVo((PlantaoSetor) it))
                    .collect(toList());

            Collections.sort(result, Comparator.comparing(EscalaReportVo::getDia)
                    .thenComparing(EscalaReportVo::getSemana)
                    .thenComparing(EscalaReportVo::getDiaSemanaValor)
                    .thenComparing(EscalaReportVo::getTurnoValor));

            var strMonthYear = DateUtils.formatByPattern(filtro.getData().toInstant(), "MM_YYYY");

            XSSFWorkbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet(strMonthYear);
            sheet.createFreezePane(100, 1);
            var rowNumber = 0;

            Row row = sheet.createRow(rowNumber++);
            for (int i = 0; i < header.size(); i++) {
                var cell = row.createCell(i);
                cell.setCellValue(header.get(i));
                sheet.autoSizeColumn(i);
                System.out.println(header.get(i));
            }
            for (int i = 0; i < result.size(); i++) {
                row = sheet.createRow(rowNumber++);
                var cellValues = result.get(i).toWorkbookSheetRow();
                for (int j = 0; j < cellValues.size(); j++) {
                    var cell = row.createCell(j);
                    cell.setCellValue(cellValues.get(j));
                    sheet.autoSizeColumn(i);
                }
            }

            List<LayoutEscalaVo> layoutEscala = new ArrayList<>();
            var reportName = "PlantaoMais Escala "+ filtro.getEscalaVo().getNomeEscala() + " " + strMonthYear;
            if (isNewPdf) {
                layoutEscala = (List<LayoutEscalaVo>) listaLayoutEscalaMes(filtro.getEscalaVo()).getObjeto();
            }
            ArquivoVo arquivoVo = ReportUtils.createFromWorkbook(workbook, reportName, isNewPdf, isOldPdf, header.size(), layoutEscala, date, filtro.getEscalaVo().getNomeEscala());


            workbook.close();

            info = Info.GetSuccess(arquivoVo);
        } catch (Exception e) {
            e.printStackTrace();
            return Info.GetError("Erro ao gerar excel, tente novamente.");
        }
        return info;
    }

    private Info gerarExcelMes(@NotNull final EscalaVo escalaVo, @NotNull final Boolean pdf) {
        Info info;
        try {

            final Escala escala = obterEscalaPorId(escalaVo.getId());

            DateTime inicioPeriodo = new DateTime(Util.converterDataTimeZone(escala.getPeriodoInicio()));
            SimpleDateFormat sdf = new SimpleDateFormat("MM/YYYY");

            String MesAno = Util.dateToString(inicioPeriodo.toDate(), sdf, this.timeZone);

            List<LayoutEscalaVo> SEMANAS = (List<LayoutEscalaVo>) listaLayoutEscalaMes(escalaVo).getObjeto();

            sdf = new SimpleDateFormat("HH:mm");
            // Create a Workbook
            XSSFWorkbook workbook = new XSSFWorkbook(); // new HSSFWorkbook() for generating `.xls` file

            /* CreationHelper helps us create instances of various things like DataFormat,
            Hyperlink, RichTextString etc, in a format (HSSF, XSSF) independent way */
            CreationHelper createHelper = workbook.getCreationHelper();


            SimpleDateFormat formatterDiaMes = new SimpleDateFormat("dd/MM");
            // Create a Sheet
            Sheet sheet = workbook.createSheet(MesAno.replace("/", "_"));

            // estilos das fontes
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 14);
            headerFont.setColor(IndexedColors.GREEN.getIndex());

            Font turnoFont = workbook.createFont();
            turnoFont.setBold(true);
            turnoFont.setFontHeightInPoints((short) 12);
            turnoFont.setColor(IndexedColors.GREEN.getIndex());

            // estilos das celulas
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);

            CellStyle dateCellStyle = workbook.createCellStyle();
            dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd-MM-yyyy"));

            CellStyle setorPlantaoStyle = workbook.createCellStyle();
            setorPlantaoStyle.setAlignment(HorizontalAlignment.CENTER);
            setorPlantaoStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle cs = workbook.createCellStyle();
            cs.setWrapText(true);
            cs.setAlignment(HorizontalAlignment.CENTER);
            cs.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle styleRowSemana = workbook.createCellStyle();
            styleRowSemana.setAlignment(HorizontalAlignment.CENTER);
            styleRowSemana.setVerticalAlignment(VerticalAlignment.CENTER);
            styleRowSemana.setWrapText(true);
            styleRowSemana.setFont(headerFont);

            CellStyle styleRowTurno = workbook.createCellStyle();
            styleRowTurno.setAlignment(HorizontalAlignment.CENTER);
            styleRowTurno.setVerticalAlignment(VerticalAlignment.CENTER);
            styleRowTurno.setWrapText(true);
            styleRowTurno.setFont(turnoFont);


            int numLinhaSemana = 0;
            for (LayoutEscalaVo semana : SEMANAS) {
                int numLinhaDia = numLinhaSemana + 1;

                Row rowSemana = sheet.createRow(numLinhaSemana);
                Cell cellSemana = rowSemana.createCell(0);
                cellSemana.setCellStyle(styleRowSemana);
                cellSemana.setCellValue("SEMANA " + semana.getNumSemana());

                CellRangeAddress cellRangeAddress = new CellRangeAddress(numLinhaSemana, numLinhaSemana, 0, 7);
                //Mesclando as células
                sheet.addMergedRegion(cellRangeAddress);

                int numCelulaDia = 0;
                Row rowDia = sheet.createRow(numLinhaDia);
                for (DiasVo dia : semana.getDIAS()) {

                    StringBuilder stringDia = new StringBuilder();
                    stringDia.append(dia.getStr().toUpperCase());
                    stringDia.append(System.getProperty("line.separator"));
                    if (dia.getData() != null) {
                        /**
                         * ATENÇÃO: NÃO PASSAR O TIMEZONE NO dateToString(). JÁ ESTÁ CONVERTIDA COM O TIMEZONE CORRETO
                         */
                        stringDia.append(Util.dateToString(dia.getData(), formatterDiaMes, null));
                    }

                    Cell cellDia = rowDia.createCell(numCelulaDia);
                    cellDia.setCellStyle(cs);
                    cellDia.setCellValue(stringDia.toString());
                    numCelulaDia += 1;
                }

                int numLinhaTurno = numLinhaDia + 1;

                int numLinhaSetor = numLinhaTurno + 1;
                for (TurnosVo turno : semana.getTURNOS()) {

                    Row rowTurno = sheet.createRow(numLinhaTurno);
                    Cell cellTurno = rowTurno.createCell(0);
                    cellTurno.setCellStyle(styleRowTurno);
                    cellTurno.setCellValue(turno.getDesc());
                    CellRangeAddress cellRangeTurno = new CellRangeAddress(numLinhaTurno, numLinhaTurno, 0, 7);
                    //Mesclando as células
                    sheet.addMergedRegion(cellRangeTurno);

                    for (SetoresVo setor : turno.getSETORES()) {
                        Row rowSetor = sheet.createRow(numLinhaSetor);
                        Cell cellSetor = rowSetor.createCell(0);
                        cellSetor.setCellValue(setor.getDesc());

                        if (setor.getPLANTOES() == null) {
                            numLinhaSetor++;
                            continue;
                        }

                        Cell cellDiaPlantao;
                        StringBuilder stringCelulaPlantao;

                        // SEGUNDA
                        if (setor.getPLANTOES().getSegunda() != null) {
                            stringCelulaPlantao = new StringBuilder();
                            int contador = 0;
                            for (PlantaoVo plantaoVo : setor.getPLANTOES().getSegunda()) {
                                if (contador > 0) {
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                if (plantaoVo.getMedico() != null) {
                                    stringCelulaPlantao.append(plantaoVo.getMedico().getNome());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append("CRM: " + plantaoVo.getMedico().getNumeroCrm());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraInicio()));
                                stringCelulaPlantao.append("/");
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraFim()));
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                                stringCelulaPlantao.append(plantaoVo.getEspecialidades());
                                contador++;
                            }
                            cellDiaPlantao = rowSetor.createCell(1);
                            cellDiaPlantao.setCellStyle(cs);
                            cellDiaPlantao.setCellValue(stringCelulaPlantao.toString());
                        }
                        // TERÇA
                        if (setor.getPLANTOES().getTerca() != null) {
                            stringCelulaPlantao = new StringBuilder();
                            int contador = 0;
                            for (PlantaoVo plantaoVo : setor.getPLANTOES().getTerca()) {
                                if (contador > 0) {
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                if (plantaoVo.getMedico() != null) {
                                    stringCelulaPlantao.append(plantaoVo.getMedico().getNome());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append("CRM: " + plantaoVo.getMedico().getNumeroCrm());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraInicio()));
                                stringCelulaPlantao.append("/");
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraFim()));
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                                stringCelulaPlantao.append(plantaoVo.getEspecialidades());
                                contador++;
                            }
                            cellDiaPlantao = rowSetor.createCell(2);
                            cellDiaPlantao.setCellStyle(cs);
                            cellDiaPlantao.setCellValue(stringCelulaPlantao.toString());
                        }
                        // QUARTA
                        if (setor.getPLANTOES().getQuarta() != null) {
                            stringCelulaPlantao = new StringBuilder();
                            int contador = 0;
                            for (PlantaoVo plantaoVo : setor.getPLANTOES().getQuarta()) {
                                if (contador > 0) {
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                if (plantaoVo.getMedico() != null) {
                                    stringCelulaPlantao.append(plantaoVo.getMedico().getNome());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append("CRM: " + plantaoVo.getMedico().getNumeroCrm());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraInicio()));
                                stringCelulaPlantao.append("/");
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraFim()));
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                                stringCelulaPlantao.append(plantaoVo.getEspecialidades());
                                contador++;
                            }
                            cellDiaPlantao = rowSetor.createCell(3);
                            cellDiaPlantao.setCellStyle(cs);
                            cellDiaPlantao.setCellValue(stringCelulaPlantao.toString());
                        }
                        // QUINTA
                        if (setor.getPLANTOES().getQuinta() != null) {
                            stringCelulaPlantao = new StringBuilder();
                            int contador = 0;
                            for (PlantaoVo plantaoVo : setor.getPLANTOES().getQuinta()) {
                                if (contador > 0) {
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                if (plantaoVo.getMedico() != null) {
                                    stringCelulaPlantao.append(plantaoVo.getMedico().getNome());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append("CRM: " + plantaoVo.getMedico().getNumeroCrm());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraInicio()));
                                stringCelulaPlantao.append("/");
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraFim()));
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                                stringCelulaPlantao.append(plantaoVo.getEspecialidades());
                                contador++;
                            }
                            cellDiaPlantao = rowSetor.createCell(4);
                            cellDiaPlantao.setCellStyle(cs);
                            cellDiaPlantao.setCellValue(stringCelulaPlantao.toString());
                        }
                        // SEXTA
                        if (setor.getPLANTOES().getSexta() != null) {
                            stringCelulaPlantao = new StringBuilder();
                            int contador = 0;
                            for (PlantaoVo plantaoVo : setor.getPLANTOES().getSexta()) {
                                if (contador > 0) {
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                if (plantaoVo.getMedico() != null) {
                                    stringCelulaPlantao.append(plantaoVo.getMedico().getNome());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append("CRM: " + plantaoVo.getMedico().getNumeroCrm());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraInicio()));
                                stringCelulaPlantao.append("/");
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraFim()));
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                                stringCelulaPlantao.append(plantaoVo.getEspecialidades());
                                contador++;
                            }
                            cellDiaPlantao = rowSetor.createCell(5);
                            cellDiaPlantao.setCellStyle(cs);
                            cellDiaPlantao.setCellValue(stringCelulaPlantao.toString());
                        }
                        // SÁBADO
                        if (setor.getPLANTOES().getSabado() != null) {
                            stringCelulaPlantao = new StringBuilder();
                            int contador = 0;
                            for (PlantaoVo plantaoVo : setor.getPLANTOES().getSabado()) {
                                if (contador > 0) {
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                if (plantaoVo.getMedico() != null) {
                                    stringCelulaPlantao.append(plantaoVo.getMedico().getNome());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append("CRM: " + plantaoVo.getMedico().getNumeroCrm());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraInicio()));
                                stringCelulaPlantao.append("/");
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraFim()));
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                                stringCelulaPlantao.append(plantaoVo.getEspecialidades());
                                contador++;
                            }
                            cellDiaPlantao = rowSetor.createCell(6);
                            cellDiaPlantao.setCellStyle(cs);
                            cellDiaPlantao.setCellValue(stringCelulaPlantao.toString());
                        }
                        // DOMINGO
                        if (setor.getPLANTOES().getDomingo() != null) {
                            stringCelulaPlantao = new StringBuilder();
                            int contador = 0;
                            for (PlantaoVo plantaoVo : setor.getPLANTOES().getDomingo()) {
                                if (contador > 0) {
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                if (plantaoVo.getMedico() != null) {
                                    stringCelulaPlantao.append(plantaoVo.getMedico().getNome());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                    stringCelulaPlantao.append("CRM: " + plantaoVo.getMedico().getNumeroCrm());
                                    stringCelulaPlantao.append(System.getProperty("line.separator"));
                                }
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraInicio()));
                                stringCelulaPlantao.append("/");
                                stringCelulaPlantao.append(sdf.format(plantaoVo.getHoraFim()));
                                stringCelulaPlantao.append(System.getProperty("line.separator"));
                                stringCelulaPlantao.append(plantaoVo.getEspecialidades());
                                contador++;
                            }
                            cellDiaPlantao = rowSetor.createCell(7);
                            cellDiaPlantao.setCellStyle(cs);
                            cellDiaPlantao.setCellValue(stringCelulaPlantao.toString());
                        }
                        numLinhaSetor++;
                    }
                    numLinhaTurno = numLinhaSetor;
                    numLinhaSetor++;
                }
                numLinhaSemana = numLinhaSetor - 1;
            }

            for (int i = 0; i < 8; i++) {
                sheet.autoSizeColumn(i);
            }

            Integer linhaFinal = numLinhaSemana - 1;
            CellRangeAddress cellRangeAddress = new CellRangeAddress(0, linhaFinal, 0, 7);
            RegionUtil.setBorderBottom(BorderStyle.MEDIUM, cellRangeAddress, sheet);
            RegionUtil.setBorderTop(BorderStyle.MEDIUM, cellRangeAddress, sheet);
            RegionUtil.setBorderLeft(BorderStyle.MEDIUM, cellRangeAddress, sheet);
            RegionUtil.setBorderRight(BorderStyle.MEDIUM, cellRangeAddress, sheet);

            ArquivoVo arquivoVo = new ArquivoVo();
            byte[] bytes;
            if (pdf) {
                byte[] bytesPdf = Util.converterXLSparaPDF(workbook);
                bytes = bytesPdf;
                arquivoVo.setPdf(true);
            } else {
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                workbook.write(bos);
                byte[] bytesXls = bos.toByteArray();
                bytes = bytesXls;
                bos.close();
                arquivoVo.setPdf(false);
            }

            // Closing the workbook
            workbook.close();

            arquivoVo.setArquivo(bytes);
            arquivoVo.setNmAnexo("Plantao_Mais_Escala_" + MesAno);
            info = Info.GetSuccess(arquivoVo);
        } catch (Exception e) {
            e.printStackTrace();
            return Info.GetError("Erro ao gerar excel, tente novamente.");
        }
        return info;
    }

    public List<CandidatoPlantaoVo> listaCanditadosPlantao(PlantaoVo plantao) {
        List<CandidatoPlantaoVo> listaVo = null;
        try {
            GenericDao<CandidatoPlantao> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(CandidatoPlantao.ID));
            propriedades.add(new Propriedade(CandidatoPlantao.ACEITO));
            propriedades.add(new Propriedade(CandidatoPlantao.DATA_CANDIDATURA));
            propriedades.add(new Propriedade(CandidatoPlantao.CANCELADO));

            String aliasMedico = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NUMERO_CRM, Medico.class, aliasMedico));

            String aliasPlantao = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.STATUS, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.VALOR, Plantao.class, aliasPlantao));

            String aliasPlantaoMedico = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasPlantaoMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasPlantaoMedico));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.EXCLUIDO, true, Filtro.NOT_EQUAL));
            NxCriterion nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantao.getId(), Filtro.EQUAL, aliasPlantao));
            nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);

//            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.ID, null, Filtro.IS_NULL, aliasPlantaoMedico)));

            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(
                            NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.CANCELADO, false, Filtro.EQUAL)),
                            NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.CANCELADO, null, Filtro.IS_NULL)))
            );

            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, null, Filtro.IS_NULL, aliasMedico)),
                            NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL, aliasMedico))));

            nxCriterion = NxCriterion.and(nxCriterion,
                NxCriterion.or(
                    NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.ACEITO, true, Filtro.EQUAL)),
                    NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.ACEITO, null, Filtro.IS_NULL)))
            );

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(CandidatoPlantao.DATA_CANDIDATURA, NxOrder.NX_ORDER.ASC));

            List<CandidatoPlantao> lista = dao.listarByFilter(propriedades, nxOrders, CandidatoPlantao.class, Constants.NO_LIMIT, nxCriterion);
            listaVo = CandidatoPlantaoMapper.convertToListVo(lista);


        } catch (Exception e) {
            e.printStackTrace();
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listaVo;
    }

    public Info aceitaMedico(PlantaoVo plantaoVo) {
        Info info;
        GenericDao dao = new GenericDao();
        PlantaoVo plantaoToPush = new PlantaoVo();
        var candidatoPlantaoPushVo = new CandidatoPlantaoVo();
        var accepted = false;
        try {
            dao.beginTransaction();

            Medico medicoAceito = null;

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.MEDICO));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.DISPONIVEL));

            List<Propriedade> propriedadesCandidatoPlantao = new ArrayList<>();
            propriedadesCandidatoPlantao.add(new Propriedade(CandidatoPlantao.ID));
            propriedadesCandidatoPlantao.add(new Propriedade(CandidatoPlantao.ACEITO));

            List<Propriedade> propriedadesPlantao = new ArrayList<>();
            propriedadesPlantao.add(new Propriedade(Plantao.ID));
            propriedadesPlantao.add(new Propriedade(Plantao.DATA));
            propriedadesPlantao.add(new Propriedade(Plantao.DIA));
            propriedadesPlantao.add(new Propriedade(Plantao.HORA_INICIO));
            propriedadesPlantao.add(new Propriedade(Plantao.HORA_FIM));
            propriedadesPlantao.add(new Propriedade(Plantao.ESCALA));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantaoVo.getId(), Filtro.EQUAL));

            Plantao plantaoDb = (Plantao) dao.selectUnique(propriedadesPlantao, Plantao.class, nxCriterion);
            CandidatoPlantao candidatoPlantaoEntity = new CandidatoPlantao();
            if (plantaoVo.getListaCandidatosPlantao() != null && plantaoVo.getListaCandidatosPlantao().size() > 0 && plantaoVo.getId() != null && plantaoVo.getId() > 0) {
                for (CandidatoPlantaoVo candidatoPlantao : plantaoVo.getListaCandidatosPlantao()) {
                    candidatoPlantaoEntity = CandidatoPlantaoMapper.convertToEntity(candidatoPlantao);
                    if (candidatoPlantao.getAceito() != null && candidatoPlantao.getAceito()) {

                        Plantao plantao = PlantaoMapper.convertToEntity(plantaoVo);
                        plantao.setId(plantaoVo.getId());
                        plantao.setMedico(candidatoPlantaoEntity.getMedico());
                        plantao.setStatus(plantaoVo.getStatus());
                        plantao.setDisponivel(false);

                        AuditoriaUtil.alteracao(plantao, usuario);
                        dao.updateWithCurrentTransaction(plantao, propriedades);
                        medicoAceito = plantao.getMedico();

                        dao.updateWithCurrentTransaction(candidatoPlantaoEntity, propriedadesCandidatoPlantao);

                    } else {

                        if (candidatoPlantaoEntity.getAceito() != null && candidatoPlantaoEntity.getAceito().equals(false)) {
                            continue;
                        }
                        candidatoPlantaoEntity.setAceito(false);
                        dao.updateWithCurrentTransaction(candidatoPlantaoEntity, propriedadesCandidatoPlantao);

                        accepted = false;
                        candidatoPlantaoPushVo = candidatoPlantao;


                        // Envia um e-mail para o médico informando o aceite
                        EmailSendGrid email = new EmailSendGrid(obterEmailMedico(candidatoPlantao.getMedico().getId()), "Plantão Não Aceito", getPlantaoNaoAceitoHtml(plantaoDb, MedicoMapper.convertToEntity(candidatoPlantao.getMedico())), true);
                        SendGridUtil.enviar(email);

                        try {
                            CandidatoPlantao candidatoPlantaoPush = (CandidatoPlantao) getSession()
                                    .createQuery("from CandadatoPlantao where id = :id")
                                    .setInteger("id", candidatoPlantaoPushVo.getId())
                                    .uniqueResult();

                            new PushNotificationController(UsuarioMapper.convertToVo(this.usuario))
                                    .sendPushApplicantDeclined(candidatoPlantaoPush);
                        } catch (HibernateException e) {
                            logger.log(Level.SEVERE, e.getMessage(), e);
                        }

                    }

                }


            }

            if (medicoAceito != null) {
                plantaoToPush = PlantaoMapper.convertToVo(plantaoDb);

                accepted = true;
                // Envia um e-mail para o médico informando o aceite
                EmailSendGrid email = new EmailSendGrid(obterEmailMedico(medicoAceito.getId()), "Plantão Aceito", getPlantaoAceitoHtml(plantaoDb, medicoAceito), true);
                SendGridUtil.enviar(email);

                EscalaController escalaController = new EscalaController();
                EscalaVo escala = escalaController.getEscalaById(plantaoDb.getEscala().getId());
                Util.enviaEmailGestaoEscala(getPlantaoAceitoHygeaHtml(plantaoDb, medicoAceito), escala.getCoordenador().getId());

                // Remove as candidaturas para o mesmo dia e horário

                propriedades.clear();
                propriedades.add(new Propriedade(CandidatoPlantao.ID));

                String aliasPlantao = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO);
                propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.DATA, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.HORA_INICIO, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.HORA_FIM, Plantao.class, aliasPlantao));

                String aliasMedico = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.MEDICO);
                propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

                nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medicoAceito.getId(), Filtro.EQUAL, aliasMedico));
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.ID, candidatoPlantaoEntity.getId(), Filtro.NOT_EQUAL)));

                List<CandidatoPlantao> candidaturas = (List<CandidatoPlantao>) dao.listarByFilter(propriedades, null, CandidatoPlantao.class, -1, nxCriterion);

                if (!Util.isNullOrEmpty(candidaturas)) {
                    SimpleDateFormat sdfData = new SimpleDateFormat("yyyy-MM-dd");
                    SimpleDateFormat sdfHora = new SimpleDateFormat("HH:mm");

                    propriedades.clear();
                    propriedades.add(new Propriedade(CandidatoPlantao.ID));
                    propriedades.add(new Propriedade(CandidatoPlantao.CANCELADO));

                    for (CandidatoPlantao candidatura : candidaturas) {
                        if (candidatura.getPlantao() != null && candidatura.getPlantao().getData() != null) {
                            if (sdfData.format(candidatura.getPlantao().getData()).equals(sdfData.format(plantaoDb.getData()))) {
                                if (sdfHora.format(candidatura.getPlantao().getHoraInicio()).equals(sdfHora.format(plantaoDb.getHoraInicio())) &&
                                        sdfHora.format(candidatura.getPlantao().getHoraFim()).equals(sdfHora.format(plantaoDb.getHoraFim()))) {

                                    candidatura.setCancelado(true);
                                    dao.updateWithCurrentTransaction(candidatura, propriedades);
                                }
                            }
                        }
                    }
                }

            }

            dao.commitCurrentTransaction();

            if (accepted) {
                try {
                    Plantao plantaoPush = (Plantao) getSession()
                            .createQuery("from Plantao where id = :id")
                            .setInteger("id", plantaoToPush.getId())
                            .uniqueResult();

                    // change status of notification to others medics with same PlantaoId
                    new NotificationController(UsuarioMapper.convertToVo(this.usuario))
                            .markAsExecutedRelateToDuty(plantaoPush);

                    new PushNotificationController(UsuarioMapper.convertToVo(this.usuario))
                            .sendPushApplicantAccepted(plantaoPush);

                } catch (HibernateException e) {
                    logger.log(Level.SEVERE, e.getMessage(), e);
                }
            }

            info = Info.GetSuccess(Constants.SUCESSO);

        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            e.printStackTrace();
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
        }
        return info;
    }

    public Info refuseCandidates(List<Integer> candidateIds) {
        GenericDao dao = new GenericDao();
        try {
            List<Propriedade> propriedadesCandidatoPlantao = new ArrayList<>();
            propriedadesCandidatoPlantao.add(new Propriedade(CandidatoPlantao.ID));
            propriedadesCandidatoPlantao.add(new Propriedade(CandidatoPlantao.ACEITO));

            dao.beginTransaction();

            for (Integer candidateId : candidateIds) {
                CandidatoPlantao entity = (CandidatoPlantao) getSession().createQuery("from CandidatoPlantao where id = :id")
                        .setInteger("id", candidateId)
                        .uniqueResult();

                if (entity.getAceito() != null) {
                    return Info.GetError("O candidato já foi aceito/recusado.");
                }

                entity.setAceito(false);
                dao.updateWithCurrentTransaction(entity, propriedadesCandidatoPlantao);

                // Envia um e-mail para o médico informando a recusa
                EmailSendGrid email = new EmailSendGrid(obterEmailMedico(entity.getMedico().getId()), "Plantão Não Aceito", getPlantaoNaoAceitoHtml(entity.getPlantao(), entity.getMedico()), true);
                SendGridUtil.enviar(email);

                new PushNotificationController(UsuarioMapper.convertToVo(this.usuario))
                        .sendPushApplicantDeclined(entity);
            }

            dao.commitCurrentTransaction();
            return Info.GetSuccess(Constants.SUCESSO);
        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            e.printStackTrace();
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
        }

    }

    /**
     * Monta o conteúdo do email em formato html do aceite de plantão para os usuários do sistema Web
     * com a configuração de notificação de gestão de escala,.
     *
     * @param plantao
     * @return retorna template html para email
     */
    private String getPlantaoAceitoHygeaHtml(Plantao plantao, Medico medico) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>A candidatura do médico " + medico.getNome() + " ao plantão do dia " + sdf.format(plantao.getData()) + " foi aceita.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

//    /**
//     * Monta o conteúdo do email em formato html do não aceite de plantão para os usuários do sistema Web
//     * com a configuração de notificação de gestão de escala,.
//     *
//     * @param plantao
//     * @return retorna template html para email
//     */
//    private String getPlantaoNaoAceitoHygeaHtml(Plantao plantao, Medico medico) {
//        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
//        String html = "";
//        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
//        html += "<p style=\"font-weight:bold;\">Olá,</p>";
//        html += "<p>A candidatura do médico " + medico.getNome() + " ao plantão do dia " + sdf.format(plantao.getData()) + " não foi aceita.</p>";
//        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
//        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
//        html += "</div>";
//        return html;
//    }

    /**
     * Monta o conteúdo do email em formato html do aceite de plantão
     *
     * @param plantao
     * @return retorna template html para email
     */
    private String getPlantaoAceitoHtml(Plantao plantao, Medico medico) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá Dr(a). " + medico.getNome() + ",</p>";
        html += "<p>Sua candidatura ao plantão do dia " + sdf.format(plantao.getData()) + " foi aceita. Acesse o aplicativo e confira em sua agenda.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }


    /**
     * Monta o conteúdo do email em formato html do não aceite de plantão
     *
     * @param plantao
     * @return retorna template html para email
     */
    private String getPlantaoNaoAceitoHtml(Plantao plantao, Medico medico) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá Dr(a). " + medico.getNome() + ",</p>";
        html += "<p>Sua candidatura ao plantão do dia " + sdf.format(plantao.getData()) + " não foi aceita.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * @param id
     * @return
     * @throws Exception
     */
    private String obterEmailMedico(int id) throws Exception {
        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(Medico.ID));
        propriedades.add(new Propriedade(Medico.EMAIL));

        GenericDao<Medico> genericDao = new GenericDao<>();

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, id, Filtro.EQUAL));

        return genericDao.selectUnique(propriedades, Medico.class, nxCriterion).getEmail();
    }
}
