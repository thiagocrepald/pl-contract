package br.com.plantaomais.controller.aplicativo;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.controller.BloqueioMedicoContratoController;
import br.com.plantaomais.controller.Controller;
import br.com.plantaomais.controller.NotificationController;
import br.com.plantaomais.controller.PushNotificationController;
import br.com.plantaomais.entitybean.Address;
import br.com.plantaomais.entitybean.CandidatoPlantao;
import br.com.plantaomais.entitybean.City;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.MedicoEspecialidade;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.PlantaoEspecialidade;
import br.com.plantaomais.entitybean.PlantaoSetor;
import br.com.plantaomais.entitybean.Setor;
import br.com.plantaomais.entitybean.State;
import br.com.plantaomais.entitybean.Workplace;
import br.com.plantaomais.entitybean.aplicativo.TrocaVaga;
import br.com.plantaomais.filtro.aplicativo.FiltroMinhaAgenda;
import br.com.plantaomais.filtro.aplicativo.FiltroTrocaVaga;
import br.com.plantaomais.mapper.EspecialidadeMapper;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.mapper.PlantaoSetorMapper;
import br.com.plantaomais.mapper.aplicativo.TrocaVagaMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.util.email.EmailSendGrid;
import br.com.plantaomais.util.email.SendGridUtil;
import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.aplicativo.DiaMinhaAgendaVo;
import br.com.plantaomais.vo.aplicativo.MinhaAgendaVo;
import br.com.plantaomais.vo.aplicativo.TrocaVagaVo;
import org.hibernate.HibernateException;
import org.joda.time.DateTime;

import javax.validation.constraints.NotNull;
import java.security.Principal;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;

/**
 * Created by nextage on 26/06/2019.
 */
public class MinhaAgendaController extends Controller {
    private static final Logger logger = Logger.getLogger(MinhaAgendaController.class.getName());

    public <T extends Principal> MinhaAgendaController(T vo) throws AuthenticationException {
        super(vo);
    }

    public List<Plantao> listarPlantoes(FiltroMinhaAgenda filtro) {
        try {
            GenericDao genericDao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.DATA));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.VALOR));
            propriedades.add(new Propriedade(Plantao.EM_TROCA));
            propriedades.add(new Propriedade(Plantao.EXCLUIDO));
            propriedades.add(new Propriedade(Plantao.EXCLUIDO));

            String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));

            String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.EXCLUIDO, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.IS_DRAFT, Escala.class, aliasEscala));

            String aliasWorkplace = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA, Escala.WORK_PLACE);
            propriedades.add(new Propriedade("id", Workplace.class, aliasWorkplace));

            String aliasAddress = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA, Escala.WORK_PLACE, Workplace.ADDRESS);
            propriedades.add(new Propriedade("id", Address.class, aliasAddress));
            propriedades.add(new Propriedade("street", Address.class, aliasAddress));
            propriedades.add(new Propriedade("number", Address.class, aliasAddress));

            String aliasCity = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA, Escala.WORK_PLACE, Workplace.ADDRESS, Address.CITY);
            propriedades.add(new Propriedade("id", City.class, aliasCity));
            propriedades.add(new Propriedade("name", City.class, aliasCity));
//
            String aliasState = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA, Escala.WORK_PLACE, Workplace.ADDRESS, Address.CITY, City.STATE);
            propriedades.add(new Propriedade("id", State.class, aliasState));
            propriedades.add(new Propriedade("name", State.class, aliasState));

            // TODO Contract Refatoração
//            String aliasContract = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA, Escala.Contract);
//            propriedades.add(new Propriedade(Contract.ID, Contract.class, aliasContract));
//            propriedades.add(new Propriedade(Contract.LOCAL, Contract.class, aliasContract));
//            propriedades.add(new Propriedade(Contract.ESTADO, Contract.class, aliasContract));
//            propriedades.add(new Propriedade(Contract.CIDADE, Contract.class, aliasContract));

            Date dataDe = filtro.getData();
            dataDe = br.com.nextage.util.Util.primeiroDiaDoMes(dataDe);
            dataDe = br.com.nextage.util.Util.convertDateHrInicial(dataDe);

            Date dataAte = filtro.getData();
            dataAte = br.com.nextage.util.Util.ultimoDiaDoMes(dataAte);
            dataAte = br.com.nextage.util.Util.convertDateHrFinal(dataAte);

            Format sdfDiaSemana = new SimpleDateFormat("EEEE", new Locale("pt", "BR"));
            int indexDataIni = defineIndexDia(sdfDiaSemana.format(dataDe));
            int indexDataFim = defineIndexDia(sdfDiaSemana.format(dataAte));

            Calendar dtIni = Calendar.getInstance();
            Calendar dtFim = Calendar.getInstance();

            dtIni.setTime(dataDe);
            dtFim.setTime(dataAte);

            dtIni.add(Calendar.DAY_OF_MONTH, (-indexDataIni));
            dtFim.add(Calendar.DAY_OF_MONTH, (6 - indexDataFim));

            dataDe = dtIni.getTime();
            dataAte = dtFim.getTime();

            NxCriterion nxCriterion = null;
            NxCriterion nxCriterionAux = null;
            List<Plantao> listaPlantao = new ArrayList<>();

            if (filtro.getMedico() != null) {
                nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, filtro.getMedico().getId(), Filtro.EQUAL, aliasMedico));
                if (filtro.getData() != null) {
                    nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Plantao.DATA, dataDe, dataAte, Boolean.TRUE, Filtro.BETWEEN, null));
                }
                nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);

                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, false, Filtro.EQUAL, aliasEscala)));
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.IS_DRAFT, false, Filtro.EQUAL, aliasEscala)));
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL)));
                listaPlantao = genericDao.listarByFilter(propriedades, null, Plantao.class, Constants.NO_LIMIT, nxCriterion);

                propriedades.clear();

                propriedades.add(new Propriedade(CandidatoPlantao.ID));
                propriedades.add(new Propriedade(CandidatoPlantao.ACEITO));
                propriedades.add(new Propriedade(CandidatoPlantao.DOACAO));
                propriedades.add(new Propriedade(CandidatoPlantao.CANCELADO));

                aliasMedico = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.MEDICO);
                propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

                String aliasPlantao = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO);
                propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.DATA, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.DIA, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.HORA_INICIO, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.HORA_FIM, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.STATUS, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.VALOR, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.EM_TROCA, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.EXCLUIDO, Plantao.class, aliasPlantao));
                propriedades.add(new Propriedade(Plantao.EXCLUIDO, Plantao.class, aliasPlantao));

                aliasEscala = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO, Plantao.ESCALA);
                propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
                propriedades.add(new Propriedade(Escala.EXCLUIDO, Escala.class, aliasEscala));

//                aliasContract = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO, Plantao.ESCALA, Escala.Contract);
//                propriedades.add(new Propriedade(Contract.ID, Contract.class, aliasContract));
//                propriedades.add(new Propriedade(Contract.LOCAL, Contract.class, aliasContract));
//                propriedades.add(new Propriedade(Contract.ESTADO, Contract.class, aliasContract));
//                propriedades.add(new Propriedade(Contract.CIDADE, Contract.class, aliasContract));

                String aliasMedicoPlantao = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO, Plantao.MEDICO);
                propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedicoPlantao));
                propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedicoPlantao));

                nxCriterion = NxCriterion.or(
                        NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.ACEITO, true, Filtro.EQUAL)),
                        NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.ACEITO, null, Filtro.IS_NULL))
                );
                nxCriterion = NxCriterion.and(nxCriterion,
                        NxCriterion.or(
                                NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.CANCELADO, false, Filtro.EQUAL)),
                                NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.CANCELADO, null, Filtro.IS_NULL))
                        )
                );

                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.ID, filtro.getMedico().getId(), Filtro.EQUAL, aliasMedico)));
                if (filtro.getData() != null) {
                    nxCriterion = NxCriterion.and(nxCriterion,
                            NxCriterion.montaRestriction(new Filtro(Plantao.DATA, dataDe, dataAte, Boolean.TRUE, Filtro.BETWEEN, aliasPlantao)));
                }
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.MEDICO, null, Filtro.IS_NULL, aliasPlantao)));

                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, false, Filtro.EQUAL, aliasEscala)));
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL, aliasPlantao)));

                List<CandidatoPlantao> listaCandidatoPlantao = genericDao.listarByFilter(propriedades, null, CandidatoPlantao.class, -1, nxCriterion);

                if (!Util.isNullOrEmpty(listaCandidatoPlantao)) {
                    for (CandidatoPlantao candidatoPlantao : listaCandidatoPlantao) {
                        if (!listaPlantao.contains(candidatoPlantao.getPlantao())) {

                            listaPlantao.add(candidatoPlantao.getPlantao());
                        }
                    }
                }
            }


            return listaPlantao;

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        return new ArrayList<>();
    }

    public Info listarPlantoesMinhaAgenda(FiltroMinhaAgenda filtro, boolean getDocuments) {
        List<Plantao> listaPlantao = listarPlantoes(filtro);

        List<MinhaAgendaVo> listaMinhaAgendaVo;
        try {
            Date dataDe = filtro.getData();
            dataDe = br.com.nextage.util.Util.primeiroDiaDoMes(dataDe);
            dataDe = br.com.nextage.util.Util.convertDateHrInicial(dataDe);

            Date dataAte = filtro.getData();
            dataAte = br.com.nextage.util.Util.ultimoDiaDoMes(dataAte);
            dataAte = br.com.nextage.util.Util.convertDateHrFinal(dataAte);

            Format sdfDiaSemana = new SimpleDateFormat("EEEE", new Locale("pt", "BR"));
            int indexDataIni = defineIndexDia(sdfDiaSemana.format(dataDe));
            int indexDataFim = defineIndexDia(sdfDiaSemana.format(dataAte));

            Calendar dtIni = Calendar.getInstance();
            Calendar dtFim = Calendar.getInstance();

            dtIni.setTime(dataDe);
            dtFim.setTime(dataAte);

            dtIni.add(Calendar.DAY_OF_MONTH, (-indexDataIni));
            dtFim.add(Calendar.DAY_OF_MONTH, (6 - indexDataFim));

            dataDe = dtIni.getTime();
            dataAte = dtFim.getTime();

            listaMinhaAgendaVo = montaCalendario(listaPlantao, dataDe, dataAte, getDocuments);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("Erro ao listar Minha Agenda!!");
        }
        return Info.GetSuccess(listaMinhaAgendaVo);
    }

    private List<MinhaAgendaVo> montaCalendario(List<Plantao> listaPlantao, Date dataInicio, Date dataFim, boolean getDocuments) throws Exception {
        List<MinhaAgendaVo> listaMinhaAgendaVo = new ArrayList<>();
        Format sdfDiaSemana = new SimpleDateFormat("EEEE", new Locale("pt", "BR"));
        Format sdfDiaMes = new SimpleDateFormat("dd/MM", new Locale("pt", "BR"));
        Format sdfDiaMesAno = new SimpleDateFormat("dd/MM/yyyy", new Locale("pt", "BR"));

        int indexDataIni = defineIndexDia(sdfDiaSemana.format(dataInicio));
        int indexDataFim = defineIndexDia(sdfDiaSemana.format(dataFim));

        long dias = (dataFim.getTime() - dataInicio.getTime());
        long diferencaDeDias = (dias / (1000 * 60 * 60 * 24));

        double diffDays = diferencaDeDias + indexDataIni + (7 - indexDataFim);
        int entreSemanas = (int) Math.ceil(diffDays / 7.0);

        for (int sem = 0; sem < entreSemanas; sem++) {
            MinhaAgendaVo minhaAgendaVo = new MinhaAgendaVo();
            for (int dia = 0; dia < 7; dia++) {

                DiaMinhaAgendaVo diaAgenda = buildScheduleDay(listaPlantao, dataInicio, dia, sem, indexDataIni, sdfDiaMes, sdfDiaMesAno, getDocuments);

                switch (dia) {
                    case (0):
                        minhaAgendaVo.setSeg(diaAgenda);
                        break;
                    case (1):
                        minhaAgendaVo.setTer(diaAgenda);
                        break;
                    case (2):
                        minhaAgendaVo.setQua(diaAgenda);
                        break;
                    case (3):
                        minhaAgendaVo.setQui(diaAgenda);
                        break;
                    case (4):
                        minhaAgendaVo.setSex(diaAgenda);
                        break;
                    case (5):
                        minhaAgendaVo.setSab(diaAgenda);
                        break;
                    case (6):
                        minhaAgendaVo.setDom(diaAgenda);
                        break;
                }

            }
            listaMinhaAgendaVo.add(minhaAgendaVo);
        }


        return listaMinhaAgendaVo;
    }

    private DiaMinhaAgendaVo buildScheduleDay(List<Plantao> listaPlantao, Date dataInicio, int dia, int sem, int indexDataIni, Format sdfDiaMes, Format sdfDiaMesAno, boolean getDocuments) throws Exception {
        Calendar dtIni = Calendar.getInstance();

        DiaMinhaAgendaVo diaAgenda = new DiaMinhaAgendaVo();
        dtIni.setTime(dataInicio);
        dtIni.add(Calendar.DAY_OF_MONTH, dia + (sem * 7) - indexDataIni);
        diaAgenda.setData(dtIni.getTime());
        diaAgenda.setDiaMes(sdfDiaMes.format(dtIni.getTime()));
        diaAgenda.setListaPlantao(new ArrayList<>());
        for (Plantao plantao : listaPlantao) {
            if (sdfDiaMesAno.format(plantao.getData()).equals(sdfDiaMesAno.format(diaAgenda.getData()))) {
                PlantaoVo plantaoVo = PlantaoMapper.convertToVo(plantao);
                List<PlantaoSetor> setoresPlantao = obterSetoresPlantao(plantao);
                List<Especialidade> especialidadesPlantao = obterEspecialidadesPlantao(plantao);
                plantaoVo.setListaSetores(PlantaoSetorMapper.convertToListVo(setoresPlantao));
                plantaoVo.setListaEspecialidades(EspecialidadeMapper.convertToListVo(especialidadesPlantao));
                diaAgenda.getListaPlantao().add(plantaoVo);

                // TODO Contract Refatoração
//                plantaoVo.getEscala().getContract().setListaContractAnexoVo(docs);
            }
        }

        return diaAgenda;
    }

    /**
     * Busca as especialidades cadastradas para o plantão
     *
     * @param plantao
     * @return
     */
    private List<Especialidade> obterEspecialidadesPlantao(@NotNull final Plantao plantao) {
        List<Especialidade> listaEspecialidades = new ArrayList<>();
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
                listaEspecialidades.add(plantaoEspecialidade.getEspecialidade());
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listaEspecialidades;
    }

    /**
     * Busca a lista de setores cadastrados para cada plantão
     *
     * @param plantao
     * @return
     */
    private List<PlantaoSetor> obterSetoresPlantao(@NotNull Plantao plantao) {
        List<PlantaoSetor> listaPlantaoSetor = new ArrayList<>();
        try {
            GenericDao<PlantaoSetor> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();

            propriedades.add(new Propriedade(PlantaoSetor.ID));

            String aliasPlantao = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            String aliasSetor = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.SETOR);
            propriedades.add(new Propriedade(Setor.ID, Setor.class, aliasSetor));
            propriedades.add(new Propriedade(Setor.DESCRICAO, Setor.class, aliasSetor));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantao.getId(), Filtro.EQUAL, aliasPlantao));

            listaPlantaoSetor = genericDao.listarByFilter(propriedades, null, PlantaoSetor.class, -1, nxCriterion);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return listaPlantaoSetor;
    }

    public Info doarVaga(PlantaoVo plantaoVo) {

        try {
            List<Propriedade> propriedades = new ArrayList<>();
            GenericDao<Plantao> dao = new GenericDao<>();
            plantaoVo.setDisponivel(true);
            plantaoVo.setStatus("D");
            Plantao plantao = PlantaoMapper.convertToEntity(plantaoVo);

            propriedades.add(new Propriedade(Plantao.DISPONIVEL));
            propriedades.add(new Propriedade(Plantao.STATUS));

            propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

            AuditoriaUtil.alteracao(plantao);
            dao.update(plantao, propriedades);

            PushNotificationController pushNotificationController = new PushNotificationController(
                    MedicoMapper.convertToVo(this.medico));

            Plantao plantaoEntity = (Plantao) getSession().createQuery("from Plantao where id = :id")
                    .setInteger("id", plantao.getId())
                    .uniqueResult();
            PlantaoVo plantaoPush = PlantaoMapper.convertToVo(plantaoEntity);
            pushNotificationController.sendPushDonationOpenMyOwn(plantaoEntity);

            List<MedicoVo> medicsVo = new BloqueioMedicoContratoController()
                    .findMedicOfContractWithSpecialty(plantaoPush)
                    .stream()
                    .filter(medic -> !medic.getId().equals(plantaoPush.getMedico().getId()))
                    .collect(Collectors.toList());

            pushNotificationController.sendPushDonationNewOpen(medicsVo, plantaoEntity);

            return Info.GetSuccess("Vaga doada com sucesso!!");
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("Erro ao doar Vaga!!");
        }

    }

    public Info listaTrocaVaga(FiltroTrocaVaga filtro) {

        try {
            List<Propriedade> propriedades = new ArrayList<>();
            GenericDao<Plantao> dao = new GenericDao<>();

            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.DATA));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.TURNO));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.VALOR));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.EM_TROCA));

            String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.TOKEN_PUSH_NOTIFICATION, Medico.class, aliasMedico));

            String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));

//            String aliasContrato = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA, Escala.CONTRATO);
//            propriedades.add(new Propriedade(Contrato.ID, Contrato.class, aliasContrato));
//            propriedades.add(new Propriedade(Contrato.LOCAL, Contrato.class, aliasContrato));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.STATUS, Constants.STATUS_PLANTAO_A_CONFIRMAR, Filtro.NOT_EQUAL));
            //somente os plantões que estão com o estado de troca
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.EM_TROCA, true, Filtro.EQUAL)));
            NxCriterion nxCriterionAux;
            List<Plantao> listaPlantao;
            List<EspecialidadeVo> especialidadesMedico = new ArrayList<>();
            List<Plantao> listaPlantaoMedico = new ArrayList<>();
            if (filtro != null) {
                if (filtro.getMedicoRequisitante() != null) {
                    nxCriterionAux = NxCriterion.and(
                            NxCriterion.montaRestriction(new Filtro(Medico.ID, filtro.getMedicoRequisitante().getId(), Filtro.NOT_EQUAL, aliasMedico)),
                            NxCriterion.montaRestriction(new Filtro(Medico.ID, null, Filtro.NOT_NULL, aliasMedico))
                    );
                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
                    especialidadesMedico = obterEspecialidadesMedico(filtro.getMedicoRequisitante());
                    listaPlantaoMedico = listarPlantoesMedico(filtro.getMedicoRequisitante());
                }
                if (filtro.getEscala() != null) {
                    nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Escala.ID, filtro.getEscala().getId(), Filtro.EQUAL, aliasEscala));
                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
                }
            }
            listaPlantao = dao.listarByFilter(propriedades, null, Plantao.class, Constants.NO_LIMIT, nxCriterion);

            List<PlantaoVo> listaPlantaoVo = PlantaoMapper.convertToListVo(listaPlantao);

            List<PlantaoVo> listaPlantaoVoAux = new ArrayList<>();

            if (especialidadesMedico.size() > 0) {
                for (PlantaoVo plantaoVo : listaPlantaoVo) {

                    List<Plantao> listaPlantaoAux = listarPlantoesMedico(plantaoVo.getMedico());

                    if (!verificaHorarioConflitante(filtro.getPlantaoRequisitante(), listaPlantaoAux)) {
                        List<EspecialidadeVo> especialidadesPlantao = obterEspecialidadesPlantao(plantaoVo);

                        if (especialidadesPlantao.size() == 1 && (especialidadesPlantao.get(0).getDescricao().equals("CLÍNICO GERAL") ||
                                especialidadesPlantao.get(0).getDescricao().equals("CLÍNICO GERAL/PEDIATRIA")) && !verificaHorarioConflitante(plantaoVo, listaPlantaoMedico)) {
                            listaPlantaoVoAux.add(plantaoVo);
                        } else if (especialidadesMedico.containsAll(especialidadesPlantao) && !verificaHorarioConflitante(plantaoVo, listaPlantaoMedico)) {
                            listaPlantaoVoAux.add(plantaoVo);
                        }
                    }


                }
            } else {
                for (PlantaoVo plantaoVo : listaPlantaoVo) {

                    List<Plantao> listaPlantaoAux = listarPlantoesMedico(plantaoVo.getMedico());

                    if (!verificaHorarioConflitante(filtro.getPlantaoRequisitante(), listaPlantaoAux)) {
                        List<EspecialidadeVo> especialidadesPlantao = obterEspecialidadesPlantao(plantaoVo);

                        if (especialidadesPlantao.size() == 1 && (especialidadesPlantao.get(0).getDescricao().equals("CLÍNICO GERAL") ||
                                especialidadesPlantao.get(0).getDescricao().equals("CLÍNICO GERAL/PEDIATRIA")) && !verificaHorarioConflitante(plantaoVo,
                                listaPlantaoMedico)) {
                            listaPlantaoVoAux.add(plantaoVo);
                        }
                    }


                }
            }

            listaPlantaoVo = listaPlantaoVoAux;

            return Info.GetSuccess(listaPlantaoVo);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("Erro ao listar Vagas!!");
        }

    }

    private List<EspecialidadeVo> obterEspecialidadesMedico(MedicoVo medico) {
        List<EspecialidadeVo> especialidades = new ArrayList<>();
        try {
            GenericDao<MedicoEspecialidade> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();

            propriedades.add(new Propriedade(MedicoEspecialidade.ID));

            String aliasMedico = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

            String aliasEspecialidade = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.ESPECIALIDADE);
            propriedades.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
            propriedades.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medico.getId(), Filtro.EQUAL, aliasMedico));

            List<MedicoEspecialidade> lista = dao.listarByFilter(propriedades, null, MedicoEspecialidade.class, Constants.NO_LIMIT, nxCriterion);

            for (MedicoEspecialidade medicoEspecialidade : lista) {
                especialidades.add(EspecialidadeMapper.convertToVo(medicoEspecialidade.getEspecialidade()));
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return especialidades;
    }

    private List<EspecialidadeVo> obterEspecialidadesPlantao(PlantaoVo plantao) {
        List<EspecialidadeVo> especialidades = new ArrayList<>();
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
                especialidades.add(EspecialidadeMapper.convertToVo(plantaoEspecialidade.getEspecialidade()));
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return especialidades;
    }

    private Boolean verificaHorarioConflitante(PlantaoVo plantaoVo, List<Plantao> listaPlantoesMedico) {

        Boolean temPlantao = false;

        SimpleDateFormat dfData = new SimpleDateFormat("dd/MM/yyyy");
        DateTime horaInicioPlantao = new DateTime(plantaoVo.getHoraInicio());
        DateTime horaFimPlantao = new DateTime(plantaoVo.getHoraFim());

        GregorianCalendar inicioPlantao = new GregorianCalendar();
        inicioPlantao.setTime(plantaoVo.getData());
        inicioPlantao.set(GregorianCalendar.HOUR_OF_DAY, horaInicioPlantao.getHourOfDay());
        inicioPlantao.set(GregorianCalendar.MINUTE, horaInicioPlantao.getMinuteOfDay());
        inicioPlantao.set(GregorianCalendar.SECOND, 0);

        GregorianCalendar fimPlantao = new GregorianCalendar();
        fimPlantao.setTime(plantaoVo.getData());
        fimPlantao.set(GregorianCalendar.HOUR_OF_DAY, horaFimPlantao.getHourOfDay());
        fimPlantao.set(GregorianCalendar.MINUTE, horaFimPlantao.getMinuteOfDay());
        fimPlantao.set(GregorianCalendar.SECOND, 0);

        for (Plantao plantao : listaPlantoesMedico) {
            DateTime horaInicioPlantaoBase = new DateTime(plantao.getHoraInicio());
            DateTime horaFimPlantaoBase = new DateTime(plantao.getHoraFim());

            GregorianCalendar inicioPlantaoBase = new GregorianCalendar();
            inicioPlantaoBase.setTime(plantao.getData());
            inicioPlantaoBase.set(GregorianCalendar.HOUR_OF_DAY, horaInicioPlantaoBase.getHourOfDay());
            inicioPlantaoBase.set(GregorianCalendar.MINUTE, horaInicioPlantaoBase.getMinuteOfDay());
            inicioPlantaoBase.set(GregorianCalendar.SECOND, 0);

            GregorianCalendar fimPlantaoBase = new GregorianCalendar();
            fimPlantaoBase.setTime(plantao.getData());
            fimPlantaoBase.set(GregorianCalendar.HOUR_OF_DAY, horaFimPlantaoBase.getHourOfDay());
            fimPlantaoBase.set(GregorianCalendar.MINUTE, horaFimPlantaoBase.getMinuteOfDay());
            fimPlantaoBase.set(GregorianCalendar.SECOND, 0);


            if (dfData.format(plantao.getData()).equals(dfData.format(plantaoVo.getData()))) {
                if (inicioPlantao.getTime().before(fimPlantaoBase.getTime()) && (inicioPlantao.getTime().after(inicioPlantaoBase.getTime()) && !inicioPlantao.getTime().equals(inicioPlantaoBase.getTime()))
                        || (fimPlantao.getTime().before(fimPlantaoBase.getTime()) && !fimPlantao.getTime().equals(fimPlantaoBase.getTime())) && fimPlantao.getTime().after(inicioPlantaoBase.getTime())) {
                    temPlantao = true;
                }
            }
        }
        return temPlantao;
    }

    private List<Plantao> listarPlantoesMedico(MedicoVo medico) {
        List<Plantao> listaPlantao = new ArrayList<>();
        try {

            listaPlantao = (List<Plantao>) getSession()
                    .createQuery("select p from Plantao p " +
                            "left join p.escala e " +
                            "left join p.medico m " +
                            "left join e.contrato c " +
                            "where m.id = :id " +
                            "and (e.excluido = :excluido or e.excluido is null)" +
                            "and (e.isDraft = false)" +
                            "and (p.bloqueado = :bloqueado or p.bloqueado is null)" +
                            "and p.status != :status")
                    .setInteger("id", medico.getId())
                    .setBoolean("excluido", false)
                    .setBoolean("bloqueado", false)
                    .setString("status", Constants.STATUS_PLANTAO_A_CONFIRMAR);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listaPlantao;
    }

    private Integer defineIndexDia(String data) {
        Integer chave = 0;
        switch (data) {
            case ("Segunda-feira"):
            case ("segunda-feira"):
            case ("segunda"):
                chave = 0;
                break;
            case ("Terça-feira"):
            case ("terça-feira"):
            case ("terça"):
                chave = 1;
                break;
            case ("Quarta-feira"):
            case ("quarta-feira"):
            case ("quarta"):
                chave = 2;
                break;
            case ("Quinta-feira"):
            case ("quinta-feira"):
            case ("quinta"):
                chave = 3;
                break;
            case ("Sexta-feira"):
            case ("sexta-feira"):
            case ("sexta"):
                chave = 4;
                break;
            case ("Sábado"):
            case ("sábado"):
            case ("sabado"):
                chave = 5;
                break;
            case ("Domingo"):
            case ("domingo"):
                chave = 6;
                break;
            default:
                break;
        }
        return chave;
    }

    /**
     * Envia um push notification para o médico solicitando uma troca de plantão
     *
     * @param trocaVagaVo
     * @return
     */
    public Info solicitarTrocaDePlantao(@NotNull TrocaVagaVo trocaVagaVo) {
        Info info;
        try {
            if (trocaVagaVo == null) {
                return Info.GetError("Erro ao gerar solicitação de troca!!");
            }

            if (trocaVagaVo.getMedicoRequisitante() != null) {
                trocaVagaVo.getMedicoRequisitante().setAnexoFoto(null);
                trocaVagaVo.getMedicoRequisitante().setSenha(null);
                trocaVagaVo.getMedicoRequisitante().setStatus(null);
                trocaVagaVo.getMedicoRequisitante().setEmail(null);
                trocaVagaVo.getMedicoRequisitante().setUfConselhoMedico(null);
                trocaVagaVo.getMedicoRequisitante().setTelefone(null);
            }
            if (trocaVagaVo.getPlantaoRequisitante() != null && trocaVagaVo.getPlantaoRequisitante().getMedico() != null) {
                trocaVagaVo.getPlantaoRequisitante().getMedico().setAnexoFoto(null);
                trocaVagaVo.getPlantaoRequisitante().getMedico().setSenha(null);
                trocaVagaVo.getPlantaoRequisitante().getMedico().setStatus(null);
                trocaVagaVo.getPlantaoRequisitante().getMedico().setEmail(null);
                trocaVagaVo.getPlantaoRequisitante().getMedico().setUfConselhoMedico(null);
                trocaVagaVo.getPlantaoRequisitante().getMedico().setTelefone(null);
            }

            // Envia um e-mail para o médico informando a solicitação de troca
            EmailSendGrid email = new EmailSendGrid(obterEmailMedico(trocaVagaVo.getMedicoVaga().getId()), "Troca de plantão solicitada", getTrocaPlantaoRequisitanteHtml(trocaVagaVo), true);
            SendGridUtil.enviar(email);

            Util.enviaEmail(getTrocaPlantaoRequisitadaHygeaHtml(trocaVagaVo), Constants.TIPO_NOTIFICACAO_GESTAO_ESCALA);

            buscaRegistroTroca(trocaVagaVo);

            savaRegistroTroca(trocaVagaVo);

            try {
                var trocaVagaPush = (TrocaVaga) getSession().createQuery("from TrocaVaga where id = :id").setInteger("id", trocaVagaVo.getId()).uniqueResult();
                new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                        .sendPushChangeDuty(trocaVagaPush);
            } catch (HibernateException e) {
                logger.log(Level.SEVERE, e.toString(), e);
            }


            info = Info.GetSuccess("Solicitação de troca enviada!", trocaVagaVo);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao gerar solicitação de troca!!");
        }
        return info;
    }

    private TrocaVagaVo buscaRegistroTroca(TrocaVagaVo vo) {
        TrocaVaga trocaVaga;
        GenericDao<TrocaVaga> dao = new GenericDao<>();
        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(TrocaVaga.ID));

        String aliasMedicoRequisitante = NxCriterion.montaAlias(TrocaVaga.ALIAS_CLASSE, TrocaVaga.MEDICO_REQUISITANTE);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedicoRequisitante));

        String aliasMedicoVaga = NxCriterion.montaAlias(TrocaVaga.ALIAS_CLASSE, TrocaVaga.MEDICO_VAGA);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedicoVaga));

        String aliasPlantaoRequisitante = NxCriterion.montaAlias(TrocaVaga.ALIAS_CLASSE, TrocaVaga.PLANTAO_REQUISITANTE);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasPlantaoRequisitante));

        String aliasPlantaoVaga = NxCriterion.montaAlias(TrocaVaga.ALIAS_CLASSE, TrocaVaga.PLANTAO_VAGA);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasPlantaoVaga));


        NxCriterion nxCriterion = NxCriterion.and(
                NxCriterion.montaRestriction(new Filtro(Medico.ID, vo.getMedicoRequisitante().getId(), Filtro.EQUAL, aliasMedicoRequisitante)),
                NxCriterion.montaRestriction(new Filtro(Medico.ID, vo.getMedicoVaga().getId(), Filtro.EQUAL, aliasMedicoVaga))
        );
        NxCriterion nxCriterionAux = NxCriterion.and(
                NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getPlantaoRequisitante().getId(), Filtro.EQUAL, aliasPlantaoRequisitante)),
                NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getPlantaoVaga().getId(), Filtro.EQUAL, aliasPlantaoVaga))
        );

        nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);


        try {
            trocaVaga = dao.selectUnique(propriedades, TrocaVaga.class, nxCriterion);
            vo.setId(trocaVaga.getId());
            return vo;
        } catch (Exception e) {
            return vo;
        }
    }

    private Info savaRegistroTroca(TrocaVagaVo vo) {
        Info info;
        try {
            TrocaVaga trocaVaga = TrocaVagaMapper.convertToEntity(vo);
            GenericDao<TrocaVaga> dao = new GenericDao<>();
            List<Propriedade> propriedades = new ArrayList<>();

            if (trocaVaga.getId() != null && trocaVaga.getId() > 0) {
                propriedades.add(new Propriedade(TrocaVaga.ID));
                propriedades.add(new Propriedade(TrocaVaga.MEDICO_REQUISITANTE));
                propriedades.add(new Propriedade(TrocaVaga.PLANTAO_REQUISITANTE));
                propriedades.add(new Propriedade(TrocaVaga.MEDICO_VAGA));
                propriedades.add(new Propriedade(TrocaVaga.PLANTAO_VAGA));
                propriedades.add(new Propriedade(TrocaVaga.TROCA_EFETUADA));
                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                AuditoriaUtil.alteracao(trocaVaga);
                dao.update(trocaVaga, propriedades);
            } else {
                AuditoriaUtil.inclusao(trocaVaga, null);
                dao.persist(trocaVaga);
            }

            vo.setId(trocaVaga.getId());

            info = Info.GetSuccess("Registro de troca salvo com sucesso!!");

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao salvar registro de troca!!");
        }

        return info;
    }

    /**
     * Recebe um par de medico e plantão e inverte o medico de cada plantão
     *
     * @param trocaVagaVo
     * @return
     */

    public Info trocaVaga(@NotNull TrocaVagaVo trocaVagaVo) {
        Info info;
        GenericDao<Plantao> dao = new GenericDao<>();

        try {

            Plantao plantaoRequisitante = PlantaoMapper.convertToEntity(trocaVagaVo.getPlantaoRequisitante());
            Plantao plantaoVaga = PlantaoMapper.convertToEntity(trocaVagaVo.getPlantaoVaga());

            Medico medicoRequisitante = MedicoMapper.convertToEntity(trocaVagaVo.getMedicoRequisitante());
            Medico medicoVaga = MedicoMapper.convertToEntity(trocaVagaVo.getMedicoVaga());

            Plantao entityPlantao = (Plantao) getSession().createQuery("from Plantao where id = :id").setInteger("id", plantaoVaga.getId()).uniqueResult();
            if (entityPlantao.getMedico().getId() != null && !entityPlantao.getMedico().getId().equals(medicoVaga.getId())) {
                return Info.GetSuccess("Troca já realizada");
            }

            if (trocaVagaVo.getTrocaEfetuada()) {

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Plantao.ID));
                propriedades.add(new Propriedade(Plantao.MEDICO));
                propriedades.add(new Propriedade(Plantao.EM_TROCA));
                propriedades.add(new Propriedade(Plantao.STATUS));

                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                plantaoRequisitante.setMedico(medicoVaga);
                plantaoRequisitante.setEmTroca(false);
                plantaoRequisitante.setStatus(Constants.STATUS_PLANTAO_CONFIRMADO);

                plantaoVaga.setMedico(medicoRequisitante);
                plantaoVaga.setEmTroca(false);
                plantaoVaga.setStatus(Constants.STATUS_PLANTAO_CONFIRMADO);


                AuditoriaUtil.alteracao(plantaoRequisitante);
                dao.update(plantaoRequisitante, propriedades);

                AuditoriaUtil.alteracao(plantaoVaga);
                dao.update(plantaoVaga, propriedades);

                String conteudoEmail = getHtmlTrocaPlantaoEfetuadaHygea(trocaVagaVo);
                Util.enviaEmail(conteudoEmail, Constants.TIPO_NOTIFICACAO_GESTAO_ESCALA);

                trocaVagaVo.setMedicoRequisitante(MedicoMapper.convertToVo(plantaoRequisitante.getMedico()));
                trocaVagaVo.setMedicoVaga(MedicoMapper.convertToVo(plantaoVaga.getMedico()));

                savaRegistroTroca(trocaVagaVo);

                try {
                    TrocaVaga entityToPush = (TrocaVaga) getSession().createQuery("from TrocaVaga where id = :id")
                            .setInteger("id", trocaVagaVo.getId())
                            .uniqueResult();

                    new NotificationController(MedicoMapper.convertToVo(this.medico))
                            .markAsExecutedChangeDuty(entityToPush);

                    new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                            .sendPushChangeDutyAccepted(entityToPush);
                } catch (HibernateException e) {
                    logger.log(Level.WARNING, e.getMessage(), e);
                }

                // Envia um e-mail para o médico informando o aceite
                EmailSendGrid email = new EmailSendGrid(obterEmailMedico(medicoRequisitante.getId()), "Troca de plantões",
                        getTrocaPlantaoEfetuadaMedicoReqHtml(trocaVagaVo), true);
                SendGridUtil.enviar(email);

                info = Info.GetSuccess("Plantões trocados com sucesso!!");


            } else {
                try {
                    TrocaVaga entity = (TrocaVaga) getSession().createQuery("from TrocaVaga where id = :id")
                            .setInteger("id", trocaVagaVo.getId())
                            .uniqueResult();
                    new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                            .sendPushChangeDutyDeclined(entity);
                } catch (HibernateException e) {
                    logger.log(Level.WARNING, e.getMessage(), e);
                }

                // Envia um e-mail para o médico informando o não aceite da troca
                EmailSendGrid email = new EmailSendGrid(obterEmailMedico(medicoRequisitante.getId()), "Troca de plantões",
                        getTrocaPlantaoNaoEfetuadaMedicoReqHtml(trocaVagaVo), true);
                SendGridUtil.enviar(email);

                Util.enviaEmail(getHtmlTrocaPlantaoNaoEfetuadaHygea(trocaVagaVo), Constants.TIPO_NOTIFICACAO_GESTAO_ESCALA);

                info = Info.GetSuccess("Troca de plantões negada!");
            }


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao trocar vagas!!");
        }

        return info;
    }

    /**
     * @param trocaVagaVo
     * @return retorna template html para email
     */
    private String getTrocaPlantaoEfetuadaMedicoReqHtml(TrocaVagaVo trocaVagaVo) {
        MedicoVo requisitante = trocaVagaVo.getMedicoRequisitante();
        MedicoVo medicoVaga = trocaVagaVo.getMedicoVaga();

        PlantaoVo plantaoRequisitante = trocaVagaVo.getPlantaoRequisitante();
        PlantaoVo plantaoVaga = trocaVagaVo.getPlantaoVaga();

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");
        String dataPlantaoRequisitante = sdf.format(plantaoRequisitante.getData());
        String dataPlantaoVaga = sdf.format(plantaoVaga.getData());

        Date horaInicioReq = plantaoRequisitante.getHoraInicio();
        Date horaFimReq = plantaoRequisitante.getHoraFim();

        Date horaInicioVaga = plantaoVaga.getHoraInicio();
        Date horaFimVaga = plantaoVaga.getHoraFim();

        StringBuilder html = new StringBuilder();

        html.append("<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">");
        html.append("<p style=\"font-weight:bold;\">Olá Dr(a). ").append(medicoVaga.getNome()).append(",</p>");
        html.append("<p>A troca do seu plantão de ")
                .append(dataPlantaoVaga).append(" ").append(sdfHour.format(horaInicioVaga)).append(" - ").append(sdfHour.format(horaFimVaga))
                .append(" (").append(plantaoVaga.getDia()).append(")").append(" com o plantão de ")
                .append(dataPlantaoRequisitante).append(" ").append(sdfHour.format(horaInicioReq)).append(" - ").append(sdfHour.format(horaFimReq))
                .append(" (").append(plantaoRequisitante.getDia()).append(")").append(" do médico ")
                .append(requisitante.getNome()).append(" foi efetuada.</p>");
        html.append("<p>Confira no aplicativo acessando sua agenda.</p>");
        html.append("<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>");
        html.append("<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>");
        html.append("</div>");

        return html.toString();
    }

    /**
     * @param trocaVagaVo
     * @return retorna template html para email
     */
    private String getTrocaPlantaoNaoEfetuadaMedicoReqHtml(TrocaVagaVo trocaVagaVo) {
        MedicoVo requisitante = trocaVagaVo.getMedicoVaga();
        MedicoVo medicoVaga = trocaVagaVo.getMedicoRequisitante();

        PlantaoVo plantaoRequisitante = trocaVagaVo.getPlantaoVaga();
        PlantaoVo plantaoVaga = trocaVagaVo.getPlantaoRequisitante();

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");
        String dataPlantaoRequisitante = sdf.format(plantaoRequisitante.getData());
        String dataPlantaoVaga = sdf.format(plantaoVaga.getData());

        Escala escalaReq = null;
        Escala escalaVaga = null;
        try {
            escalaReq = Util.obterEscalaPorPlantao(trocaVagaVo.getPlantaoRequisitante().getId());
            escalaVaga = Util.obterEscalaPorPlantao(trocaVagaVo.getPlantaoVaga().getId());
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        Date horaInicioReq = plantaoRequisitante.getHoraInicio();
        Date horaFimReq = plantaoRequisitante.getHoraFim();

        Date horaInicioVaga = plantaoVaga.getHoraInicio();
        Date horaFimVaga = plantaoVaga.getHoraFim();

        StringBuilder html = new StringBuilder();

        html.append("<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">");
        html.append("<p style=\"font-weight:bold;\">Olá Dr(a). ").append(medicoVaga.getNome()).append(",</p>");
        html.append("<p>A solicitação de troca do seu plantão de ")
                .append(dataPlantaoVaga).append(" ").append(sdfHour.format(horaInicioVaga)).append(" - ").append(sdfHour.format(horaFimVaga))
//                .append(" (").append(plantaoVaga.getDia()).append(") do local ").append(escalaVaga.getContrato()..()).append(" com o plantão de ")
                .append(dataPlantaoRequisitante).append(" ").append(sdfHour.format(horaInicioReq)).append(" - ").append(sdfHour.format(horaFimReq))
                .append(" (").append(plantaoRequisitante.getDia())
//                .append(") do local ").append(escalaReq.getContrato().getLocal()).append(" do Dr(a). ").append(requisitante.getNome())
                .append(" não foi aceita.</p>");
        html.append("<p>Você ainda pode realizar novas solicitações de troca ou desistir de trocar o seu plantão. Confiara no aplicativo acessando sua agenda.</p>");
        html.append("<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>");
        html.append("<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>");
        html.append("</div>");

        return html.toString();
    }

    /**
     * @param trocaVagaVo
     * @return retorna template html para email
     */
    private String getTrocaPlantaoRequisitanteHtml(TrocaVagaVo trocaVagaVo) {

        PlantaoVo plantaoRequisitante = trocaVagaVo.getPlantaoRequisitante();

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");

        String dataPlantaoReq = sdf.format(plantaoRequisitante.getData());

        Escala escalaReq = null;
        try {
            escalaReq = Util.obterEscalaPorPlantao(trocaVagaVo.getPlantaoRequisitante().getId());
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        Date horaInicioReq = plantaoRequisitante.getHoraInicio();
        Date horaFimReq = plantaoRequisitante.getHoraFim();

        StringBuilder html = new StringBuilder();
        html.append("<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">");
        html.append("<p style=\"font-weight:bold;\">Olá Dr(a). ").append(trocaVagaVo.getMedicoVaga().getNome()).append(",</p>");
        html.append("<p>O Dr(a). ").append(trocaVagaVo.getMedicoRequisitante().getNome()).append(" deseja trocar o plantão do dia ")
                .append(dataPlantaoReq).append(" ").append(sdfHour.format(horaInicioReq)).append(" - ").append(sdfHour.format(horaFimReq))
                .append(" (").append(trocaVagaVo.getPlantaoRequisitante().getDia()).append(") do local ");
//                .append(escalaReq.getContrato().getLocal()).append(".</p>");
        html.append("<p>Acesse a notificação enviada no aplicativo e confira.</p>");
        html.append("<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>");
        html.append("<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>");
        html.append("</div>");

        return html.toString();
    }

    /**
     * @param trocaVagaVo
     * @return retorna template html para email
     */
    private String getTrocaPlantaoRequisitadaHygeaHtml(TrocaVagaVo trocaVagaVo) {
        MedicoVo requisitante = trocaVagaVo.getMedicoRequisitante();
        MedicoVo medicoVaga = trocaVagaVo.getMedicoVaga();

        PlantaoVo plantaoRequisitante = trocaVagaVo.getPlantaoRequisitante();
        PlantaoVo plantaoVaga = trocaVagaVo.getPlantaoVaga();

        Escala escalaReq = null;
        Escala escalaVaga = null;
        try {
            escalaReq = Util.obterEscalaPorPlantao(trocaVagaVo.getPlantaoRequisitante().getId());
            escalaVaga = Util.obterEscalaPorPlantao(trocaVagaVo.getPlantaoVaga().getId());
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");
        String dataPlantaoRequisitante = sdf.format(plantaoRequisitante.getData());
        String dataPlantaoVaga = sdf.format(plantaoVaga.getData());

        Date horaInicioReq = plantaoRequisitante.getHoraInicio();
        Date horaFimReq = plantaoRequisitante.getHoraFim();

        Date horaInicioVaga = plantaoVaga.getHoraInicio();
        Date horaFimVaga = plantaoVaga.getHoraFim();

        StringBuilder html = new StringBuilder();
        html.append("<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">");
        html.append("<p style=\"font-weight:bold;\">Olá,</p>");
        html.append("<p>O Dr(a). ").append(requisitante.getNome()).append(" solicitou uma troca do plantão do dia ")
                .append(dataPlantaoRequisitante).append(" ").append(sdfHour.format(horaInicioReq)).append(" - ").append(sdfHour.format(horaFimReq))
                .append(" (").append(trocaVagaVo.getPlantaoVaga().getDia()).append(") do local ")
//                .append(escalaReq.getContrato().getLocal()).append(" com o plantão de ")
                .append(dataPlantaoVaga).append(" ").append(sdfHour.format(horaInicioVaga)).append(" - ").append(sdfHour.format(horaFimVaga))
                .append(" (").append(plantaoVaga.getDia()).append(") do local ");
//                .append(escalaVaga.getContrato().getLocal()).append(" do médico ").append(medicoVaga.getNome()).append(".</p>");
        html.append("<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>");
        html.append("<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>");
        html.append("</div>");

        return html.toString();
    }


    private String getHtmlTrocaPlantaoEfetuadaHygea(TrocaVagaVo trocaVagaVo) {
        MedicoVo requisitante = trocaVagaVo.getMedicoRequisitante();
        MedicoVo medicoVaga = trocaVagaVo.getMedicoVaga();

        PlantaoVo plantaoRequisitante = trocaVagaVo.getPlantaoRequisitante();
        PlantaoVo plantaoVaga = trocaVagaVo.getPlantaoVaga();

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");
        String dataPlantaoRequisitante = sdf.format(plantaoRequisitante.getData());
        String dataPlantaoVaga = sdf.format(plantaoVaga.getData());

        Escala escalaReq = null;
        Escala escalaVaga = null;
        try {
            escalaReq = Util.obterEscalaPorPlantao(trocaVagaVo.getPlantaoRequisitante().getId());
            escalaVaga = Util.obterEscalaPorPlantao(trocaVagaVo.getPlantaoVaga().getId());
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        Date horaInicioReq = plantaoRequisitante.getHoraInicio();
        Date horaFimReq = plantaoRequisitante.getHoraFim();

        Date horaInicioVaga = plantaoVaga.getHoraInicio();
        Date horaFimVaga = plantaoVaga.getHoraFim();

        StringBuilder html = new StringBuilder();
        html.append("<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">");
        html.append("<p style=\"font-weight:bold;\">Olá,</p>");
        html.append("<p>O Dr(a). ").append(medicoVaga.getNome()).append(" efetuou uma troca de seu plantão de ")
                .append(dataPlantaoVaga).append(" ").append(sdfHour.format(horaInicioVaga)).append(" - ").append(sdfHour.format(horaFimVaga))
                .append(" (").append(plantaoVaga.getDia()).append(") do local ")
//                .append(escalaVaga.getContrato().getLocal()).append(" com o plantão de ").append(dataPlantaoRequisitante)
                .append(" ").append(sdfHour.format(horaInicioReq)).append(" - ").append(sdfHour.format(horaFimReq))
                .append(" (").append(plantaoRequisitante.getDia())
//                .append(") do local ").append(escalaReq.getContrato().getLocal()).append(" do Dr(a). ")
                .append(requisitante.getNome()).append(".</p>");
        html.append("<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>");
        html.append("<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>");
        html.append("</div>");
        return html.toString();
    }

    private String getHtmlTrocaPlantaoNaoEfetuadaHygea(TrocaVagaVo trocaVagaVo) {
        MedicoVo requisitante = trocaVagaVo.getMedicoRequisitante();
        MedicoVo medicoVaga = trocaVagaVo.getMedicoVaga();

        PlantaoVo plantaoRequisitante = trocaVagaVo.getPlantaoRequisitante();
        PlantaoVo plantaoVaga = trocaVagaVo.getPlantaoVaga();

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");
        String dataPlantaoRequisitante = sdf.format(plantaoRequisitante.getData());
        String dataPlantaoVaga = sdf.format(plantaoVaga.getData());

        Escala escalaReq = null;
        Escala escalaVaga = null;
        try {
            escalaReq = Util.obterEscalaPorPlantao(trocaVagaVo.getPlantaoRequisitante().getId());
            escalaVaga = Util.obterEscalaPorPlantao(trocaVagaVo.getPlantaoVaga().getId());
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        Date horaInicioReq = plantaoRequisitante.getHoraInicio();
        Date horaFimReq = plantaoRequisitante.getHoraFim();

        Date horaInicioVaga = plantaoVaga.getHoraInicio();
        Date horaFimVaga = plantaoVaga.getHoraFim();

        StringBuilder html = new StringBuilder();
        html.append("<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">");
        html.append("<p style=\"font-weight:bold;\">Olá,</p>");
        html.append("<p>O Dr(a). ").append(medicoVaga.getNome()).append(" recusou a troca de seu plantão de ")
                .append(dataPlantaoVaga).append(" ").append(sdfHour.format(horaInicioVaga)).append(" - ").append(sdfHour.format(horaFimVaga))
                .append(" (").append(plantaoVaga.getDia()).append(") do local ")
//                .append(escalaVaga.getContrato().getLocal()).append(" com o plantão de ")
                .append(dataPlantaoRequisitante).append(" ").append(sdfHour.format(horaInicioReq)).append(" - ").append(sdfHour.format(horaFimReq))
                .append(" (").append(plantaoRequisitante.getDia())
//                .append(") do local ").append(escalaReq.getContrato().getLocal()).append(" do médico ")
                .append(requisitante.getNome()).append(".</p>");
        html.append("<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>");
        html.append("<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>");
        html.append("</div>");

        return html.toString();
    }

    /**
     * @param plantaoVo
     * @return
     */
    public Info colocarPlantaoEmTroca(PlantaoVo plantaoVo) {
        Info info;
        try {

            GenericDao<Plantao> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.EM_TROCA));

            Plantao plantao = PlantaoMapper.convertToEntity(plantaoVo);

            plantao.setEmTroca(true);

            genericDao.update(plantao, propriedades);

            try {
                Plantao entity = (Plantao) getSession().createQuery("from Plantao where id = :id")
                        .setInteger("id", plantao.getId())
                        .uniqueResult();
                new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                        .sendPushUpdateDutyStatus(entity, "em troca");
            } catch (Exception e) {
                logger.log(Level.WARNING, e.getMessage(), e);
            }

            info = Info.GetSuccess(Constants.SUCESSO, plantao);

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }


    /**
     * @param plantaoVo
     * @return
     */
    public Info desistirTrocaPlantao(PlantaoVo plantaoVo) {
        Info info;
        try {

            GenericDao<Plantao> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.EM_TROCA));

            Plantao plantao = PlantaoMapper.convertToEntity(plantaoVo);

            plantao.setEmTroca(false);

            genericDao.update(plantao, propriedades);

            info = Info.GetSuccess(Constants.SUCESSO, plantao);

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    /**
     * Busca na tabela CANDIDATO_PLANTAO um registro filtrando pelo ID do médico e do plantão passados
     * por parâmetro e que contenha a coluna ACEITO = null e CANCELADO = null ou false. (candidatura não aceita e nem recusada).
     * <p>
     * Método utilizado na tela de Minha Agenda no app para verificar se o plantão selecionado poderá ter
     * sua candidatura cancelada.
     *
     * @param plantaoVo
     * @return
     * @author Matheus Toledo
     */
    public Info obterCandidatoPlantao(PlantaoVo plantaoVo) {
        Info info;
        try {

            // se vier null retorna erro
            if (plantaoVo == null) {
                return Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            }

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.STATUS));

            String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.EXCLUIDO, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.IS_DRAFT, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.WORK_PLACE, Escala.class, aliasEscala));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantaoVo.getId(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, false, Filtro.EQUAL, aliasEscala)));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.IS_DRAFT, false, Filtro.EQUAL, aliasEscala)));


            GenericDao<Plantao> genericDao = new GenericDao<>();

            Plantao plantao = genericDao.selectUnique(propriedades, Plantao.class, nxCriterion);
            if (plantao.getStatus() == null || plantao.getStatus().equals(Constants.STATUS_PLANTAO_A_CONFIRMAR)) {
                plantao.getEscala().getWorkplace().setContract(null);
                info = Info.GetSuccess(plantao);
            } else {
                info = Info.GetSuccess(null);
            }

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    /**
     * Faz o set da coluna CANCELADO da tabela CANDIDATO_PLANTAO como true.
     * Esta ação é disparada no aplicativo na tela de Minha Agenda ao tocar no botão "Cancelar candidatura".
     *
     * @param plantaoVo
     * @return
     * @author Matheus Toledo
     */
    public Info cancelarCandidaturaPlantao(PlantaoVo plantaoVo) {
        Info info;
        try {

            // Se vier null retorna erro.
            if (plantaoVo == null || plantaoVo.getId() == null) {
                return Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            }

            // Converte o vo para entity e faz o ser de cancelado como true.
            Plantao plantao = PlantaoMapper.convertToEntity(plantaoVo);
            plantao.setMedico(null);
            plantao.setStatus(null);

            // Propriedades que serão atualizadas
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.MEDICO));
            propriedades.add(new Propriedade(Plantao.STATUS));

            // Faz o update
            GenericDao genericDao = new GenericDao();
            genericDao.update(plantao, propriedades);

            propriedades.clear();

            propriedades.add(new Propriedade(CandidatoPlantao.ID));
            propriedades.add(new Propriedade(CandidatoPlantao.CANCELADO));

            String aliasPlantao = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            String aliasMedico = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantao.getId(), Filtro.EQUAL, aliasPlantao));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.ID, plantaoVo.getMedico().getId(), Filtro.EQUAL, aliasMedico)));
            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.CANCELADO, null, Filtro.IS_NULL)),
                            NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.CANCELADO, false, Filtro.EQUAL)))
            );

            CandidatoPlantao candidatoPlantao = (CandidatoPlantao) genericDao.selectUnique(propriedades, CandidatoPlantao.class, nxCriterion);
            if (candidatoPlantao != null) {
                candidatoPlantao.setCancelado(true);
                propriedades.clear();
                propriedades.add(new Propriedade(CandidatoPlantao.CANCELADO));
                genericDao.update(candidatoPlantao, propriedades);
            }
            // retorna sucesso
            info = Info.GetSuccess(Constants.SUCESSO);

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
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

    public Info desistirDoacao(PlantaoVo plantaoVo) {
        Info info;
        GenericDao genericDao = new GenericDao<>();
        try {

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.DISPONIVEL));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantaoVo.getId(), Filtro.EQUAL));

            genericDao.beginTransaction();

            Plantao plantao = (Plantao) genericDao.selectUnique(propriedades, Plantao.class, nxCriterion);

            plantao.setStatus(Constants.STATUS_PLANTAO_CONFIRMADO);
            plantao.setDisponivel(false);

            genericDao.updateWithCurrentTransaction(plantao, propriedades);

            /**
             * Busca os candidatos ao plantão doado e faz a recusa
             */
            propriedades.clear();

            propriedades.add(new Propriedade(CandidatoPlantao.ID));
            propriedades.add(new Propriedade(CandidatoPlantao.ACEITO));

            String aliasPlantao = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantaoVo.getId(), Filtro.EQUAL, aliasPlantao));

            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.EXCLUIDO, false, Filtro.EQUAL)));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.ACEITO, null, Filtro.IS_NULL)));

            List<CandidatoPlantao> candidatos = (List<CandidatoPlantao>) genericDao.listarByFilter(propriedades, null, CandidatoPlantao.class, -1, nxCriterion);

            if (!Util.isNullOrEmpty(candidatos)) {
                propriedades.clear();

                propriedades.add(new Propriedade(CandidatoPlantao.ID));
                propriedades.add(new Propriedade(CandidatoPlantao.ACEITO));
                for (CandidatoPlantao candidato : candidatos) {
                    candidato.setAceito(false);
                    genericDao.updateWithCurrentTransaction(candidato, propriedades);
                }
            }

            genericDao.commitCurrentTransaction();

            info = Info.GetSuccess(Constants.SUCESSO);
        } catch (Exception e) {
            genericDao.rollbackCurrentTransaction();
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }
}
