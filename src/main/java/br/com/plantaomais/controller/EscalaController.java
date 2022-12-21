package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.nextage.persistence_2.util.Paginacao;
import br.com.nextage.persistence_2.vo.PaginacaoVo;
import br.com.plantaomais.entitybean.Address;
import br.com.plantaomais.entitybean.CandidatoPlantao;
import br.com.plantaomais.entitybean.Contract;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.PlantaoEspecialidade;
import br.com.plantaomais.entitybean.PlantaoSetor;
import br.com.plantaomais.entitybean.Setor;
import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.entitybean.WorkplaceItem;
import br.com.plantaomais.entitybean.enums.NotificationStatus;
import br.com.plantaomais.entitybean.Workplace;
import br.com.plantaomais.filtro.FiltroEscala;
import br.com.plantaomais.mapper.EscalaMapper;
import br.com.plantaomais.mapper.EspecialidadeMapper;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.mapper.SetorMapper;
import br.com.plantaomais.mapper.UsuarioMapper;
import br.com.plantaomais.mapper.WorkplaceItemMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.EscalaVo;
import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.NotificationVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.SetorVo;
import br.com.plantaomais.vo.UsuarioVo;
import br.com.plantaomais.vo.aplicativo.PushNotificationVo;
import org.hibernate.Session;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.LocalDate;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;
import static br.com.plantaomais.util.Util.enviarPushNotification;
import static br.com.plantaomais.util.Util.isNullOrEmpty;
import static java.util.stream.Collectors.toList;

/**
 * Created by nextage on 14/05/2019.
 */
public class EscalaController extends Controller {

    private static final Logger logger = Logger.getLogger(EscalaController.class.getName());

    public EscalaController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }

    public EscalaController() {
    }

    /**
     * Retorno uma lista de contratantes
     *
     * @param ativo
     * @return
     */
    public List<EscalaVo> listar(String ativo, String dataInicio, String dataFim, Long contractId) {
        List<EscalaVo> listaVo = null;
        try {
            GenericDao<Escala> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Escala.ID));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA));
            propriedades.add(new Propriedade(Escala.PERIODO_FIM));
            propriedades.add(new Propriedade(Escala.PERIODO_INICIO));
            propriedades.add(new Propriedade(Escala.PREVISAO_PAGAMENTO));
            propriedades.add(new Propriedade(Escala.CONTRATO));

            String aliasUsuario = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.COORDENADOR);
            propriedades.add(new Propriedade(Usuario.ID, Usuario.class, aliasUsuario));
            propriedades.add(new Propriedade(Usuario.NOME, Usuario.class, aliasUsuario));

            String aliasContrato = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.CONTRATO);
            propriedades.add(new Propriedade("id", Contract.class, aliasContrato));
            propriedades.add(new Propriedade("notes", Contract.class, aliasContrato));
            propriedades.add(new Propriedade("sankhyaCode", Contract.class, aliasContrato));
            propriedades.add(new Propriedade("resultsCenter", Contract.class, aliasContrato));

            String aliasWorkplace = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.WORK_PLACE);
            propriedades.add(new Propriedade("id", Workplace.class, aliasWorkplace));
            propriedades.add(new Propriedade("unitName", Workplace.class, aliasWorkplace));

            String aliasAddress = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.WORK_PLACE, Workplace.ADDRESS);
            propriedades.add(new Propriedade("id", Address.class, aliasAddress));
            propriedades.add(new Propriedade("street", Address.class, aliasAddress));

//            Date date = new Date();
            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, false, Filtro.EQUAL));
//            NxCriterion nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Escala.PERIODO_FIM, date, Filtro.MAIOR));
//            nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
            if (ativo != null) {
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.ATIVO, ativo.equals("ATIVOS"), Filtro.EQUAL)));
            }
            if (dataInicio != null) {
                Date periodoInicio = new SimpleDateFormat("dd/MM/yyyy").parse(dataInicio);
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.PERIODO_INICIO, periodoInicio, Filtro.MAIOR_IGUAL)));
            }
            if (dataFim != null) {
                Date periodoFim = new SimpleDateFormat("dd/MM/yyyy").parse(dataFim);
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.PERIODO_FIM, periodoFim, Filtro.MENOR_IGUAL)));
            }

            if (contractId != null) {
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Contract.ID, contractId, Filtro.EQUAL, aliasContrato)));
            }

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Escala.PERIODO_FIM, NxOrder.NX_ORDER.ASC));

            List<Escala> lista = dao.listarByFilter(propriedades, nxOrders, Escala.class, Constants.NO_LIMIT, nxCriterion);

            List<Propriedade> propriedadesPlantoes = new ArrayList<>();
            propriedadesPlantoes.add(new Propriedade(Plantao.ID));
            propriedadesPlantoes.add(new Propriedade(Plantao.STATUS));

            GenericDao<Plantao> daoPlantao = new GenericDao();
            NxCriterion nxCriterionPlantao = NxCriterion.montaRestriction(new Filtro(Plantao.STATUS, "AC", Filtro.EQUAL));
            List<Plantao> listaPlantoes = daoPlantao.listarByFilter(propriedadesPlantoes, null, Plantao.class, Constants.NO_LIMIT, nxCriterionPlantao);


//            GenericDao<Plantao> daoPlantao = new GenericDao();

            listaVo = EscalaMapper.convertToListVo(lista);

            listaVo.forEach(it -> {
                var candidatos = (List<CandidatoPlantao>) getSession()
                        .createQuery("select cp from CandidatoPlantao cp " +
                                "left join cp.plantao p " +
                                "left join cp.medico m " +
                                "left join p.escala e " +
                                "where e.id = :escalaId and cp.aceito IS NULL " +
                                "and (cp.excluido = false or cp.excluido is null) " +
                                "and (m.excluido = false or m.excluido is null) " +
                                "and (cp.cancelado is null or cp.cancelado = false)")
                        .setInteger("escalaId", it.getId()).list();

                var aConfirmar = (List<Plantao>) getSession()
                        .createQuery("select p from Plantao p " +
                                "left join p.escala e " +
                                "left join p.medico m " +
                                "where e.id = :escalaId and p.status = :status " +
                                "and (m.excluido = false or m.excluido is null) "
                        )
                        .setString("status", "AC").setInteger("escalaId", it.getId()).list();

                it.setNumeroCandidatos(candidatos.size() + aConfirmar.size());
            });

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            //info = Info.GetError("Erro ao listar Escala");
        }

        return listaVo;
    }

    /**
     * Retorno uma lista de Escalas paginado
     *
     * @param paginacaoVo
     * @return
     */
    public Info listarPaginado(PaginacaoVo paginacaoVo) {
        Info info = null;

        try {
            GenericDao<Escala> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Escala.ID));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA));
            propriedades.add(new Propriedade(Escala.PERIODO_FIM));
            propriedades.add(new Propriedade(Escala.PERIODO_INICIO));
            propriedades.add(new Propriedade(Escala.PREVISAO_PAGAMENTO));

            String aliasUsuario = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.COORDENADOR);
            propriedades.add(new Propriedade(Usuario.ID, Usuario.class, aliasUsuario));
            propriedades.add(new Propriedade(Usuario.NOME, Usuario.class, aliasUsuario));

            String aliasContrato = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.CONTRATO);
            propriedades.add(new Propriedade("id", Contract.class, aliasContrato));
            propriedades.add(new Propriedade("notes", Contract.class, aliasContrato));
            propriedades.add(new Propriedade("sankhyaCode", Contract.class, aliasContrato));
            propriedades.add(new Propriedade("resultsCenter", Contract.class, aliasContrato));

            String aliasWorkplace = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.WORK_PLACE);
            propriedades.add(new Propriedade("id", Workplace.class, aliasWorkplace));
            propriedades.add(new Propriedade("unitName", Workplace.class, aliasWorkplace));

            NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, false, Filtro.EQUAL));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Escala.NOME_ESCALA, NxOrder.NX_ORDER.ASC));

            Paginacao.build(propriedades, nxOrders, Escala.class, criterion, paginacaoVo);

            info = Info.GetSuccess(paginacaoVo);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao listar Escalas");
        }

        return info;
    }

    /**
     * Retorno de Escalas com todas as propriendades carregadas
     *
     * @param vo EscalaVo
     * @return
     */

    public Info getEscalaById(EscalaVo vo) {
        try {
            return Info.GetSuccess(getEscalaById(vo.getId()));
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("Erro ao buscar Escala.");
        }
    }

    public EscalaVo getEscalaById(Integer id) throws Exception {
        if (id != null) {
            GenericDao<Escala> dao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Escala.ID));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA));
            propriedades.add(new Propriedade(Escala.PERIODO_FIM));
            propriedades.add(new Propriedade(Escala.PERIODO_INICIO));
            propriedades.add(new Propriedade(Escala.PREVISAO_PAGAMENTO));
            propriedades.add(new Propriedade(Escala.IS_DRAFT));

            String aliasUsuario = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.COORDENADOR);
            propriedades.add(new Propriedade(Usuario.ID, Usuario.class, aliasUsuario));
            propriedades.add(new Propriedade(Usuario.NOME, Usuario.class, aliasUsuario));

            String aliasContrato = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.CONTRATO);
            propriedades.add(new Propriedade("id", Contract.class, aliasContrato));
            propriedades.add(new Propriedade("notes", Contract.class, aliasContrato));
            propriedades.add(new Propriedade("sankhyaCode", Contract.class, aliasContrato));
            propriedades.add(new Propriedade("resultsCenter", Contract.class, aliasContrato));

            String aliasWorkplace = NxCriterion.montaAlias(Escala.ALIAS_CLASSE, Escala.WORK_PLACE);
            propriedades.add(new Propriedade("id", Workplace.class, aliasWorkplace));
            propriedades.add(new Propriedade("unitName", Workplace.class, aliasWorkplace));

            NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, true, Filtro.NOT_EQUAL));
            NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Escala.ID, id, Filtro.EQUAL));
            criterion = NxCriterion.and(criterion, criterionAux);

            Escala escala = dao.selectUnique(propriedades, Escala.class, criterion);

            return EscalaMapper.convertToVo(escala);
        } else {
            throw new IllegalArgumentException("id cannot be null");
        }
    }

    /**
     * Avoiding a mess changing this "salvar escala"
     *
     * @param vo
     * @return
     */
    public Info salvar(EscalaVo vo) {
        Info info;
        GenericDao dao = new GenericDao();
        List<Plantao> onCalls = new ArrayList<>();
        PlantaoController plantaoController = new PlantaoController();

        try {
            dao.beginTransaction();

            if (vo.getId() == null) {
                vo.setIsDraft(true);
            }

            EscalaVo result = null;

            if (!isNullOrEmpty(vo.getListaPlantao())) {
                ArrayList<PlantaoVo> plantaoCopy = new ArrayList<>(vo.getListaPlantao());

                for (PlantaoVo p : plantaoCopy) {
                    List<PlantaoVo> singlePlantao = Collections.singletonList(p);
                    vo.setListaPlantao(singlePlantao);
                    result = doSave(dao, vo);
                    onCalls.addAll(PlantaoMapper.convertToListEntity(result.getListaPlantao()));
                }

                if (result == null) {
                    throw new IllegalStateException("EscalaVO cannot be null");
                }

            } else {
                result = doSave(dao, vo);
            }

            dao.commitCurrentTransaction();
            plantaoController.createAccessControlsByOnCalls(onCalls);
            info = Info.GetSuccess("Escala salva com sucesso.", result);
        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao salvar a escala.", vo);
        }
        return info;
    }

    private EscalaVo doSave(GenericDao dao, EscalaVo vo) throws Exception {
        List<Propriedade> propriedades;
        List<Plantao> onCalls = new ArrayList<>();
        Escala escala = EscalaMapper.convertToEntity(vo);

        //salvar escala
        if (escala.getId() != null && escala.getId() > 0) {
            propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Escala.ID));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA));
            propriedades.add(new Propriedade(Escala.PERIODO_FIM));
            propriedades.add(new Propriedade(Escala.PERIODO_INICIO));
            propriedades.add(new Propriedade(Escala.PREVISAO_PAGAMENTO));
            propriedades.add(new Propriedade(Escala.CONTRATO));
            propriedades.add(new Propriedade(Escala.WORK_PLACE));
            propriedades.add(new Propriedade(Escala.COORDENADOR));
            if (vo.getIsDraft() != null) {
                propriedades.add(new Propriedade(Escala.IS_DRAFT));
            }

            propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

            AuditoriaUtil.alteracao(escala);
            dao.updateWithCurrentTransaction(escala, propriedades);
        } else {
            escala.setAtivo(true);
            AuditoriaUtil.inclusao(escala, null);
            dao.persistWithCurrentTransaction(escala);
        }

        if (!isNullOrEmpty(vo.getListaPlantao())) {
            // Recupero a data inicial e a data final da escala
            /**
             * ATENÇÃO: NÃO ALTERAR A MANEIRA COM QUE É PEGA AS DATAS. PODE DAR ERRO COM O TIMEZONE QUANDO SUBIR VERSÃO PARA O CLOUD
             */
            Date dataInicioContador = Util.convertDateHrInicial(Util.converterDataTimeZone(escala.getPeriodoInicio()), null);
            Date dataFimContador = Util.convertDateHrInicial(Util.converterDataTimeZone(escala.getPeriodoFim()), null);
            logger.log(Level.INFO, escala.getId() + " - INICIO ESCALA: " + dataInicioContador);

            // Recupero o dia da semana (segunda, terça, etc.) da data inicial
            Format formatter = new SimpleDateFormat("EEEE", new Locale("pt", "BR"));
            String diaInicio = formatter.format(dataInicioContador); // ex: diaInicio === "terça-feira"

            // Enquanto a data inicial do contador for menor ou igual que a data final do contador
            while (dataInicioContador.compareTo(dataFimContador) <= 0) {
                for (PlantaoVo plantaoVo :
                        vo.getListaPlantao()) {
                    // Recupero os indices dos dias inicio e fim referente a semana, ex: terça-feira === 1
                    Integer indexSemanaInicio = defineIndexDia(diaInicio);
                    Integer indexSemanaPlantao = defineIndexDia(plantaoVo.getDia());

                    // Se o dia da semana do plantão é o mesmo que o dia da semana do contador
                    if (indexSemanaPlantao.equals(indexSemanaInicio)) {
                        // Salvo o plantão, os setores e as especialidades
                        Plantao plantao = PlantaoMapper.convertToEntity(plantaoVo);
                        plantao.setData(dataInicioContador);
                        plantao.setEscala(escala);
                        AuditoriaUtil.inclusao(plantao, this.usuario);
                        logger.log(Level.INFO, "DATA PLANTAO: " + dataInicioContador);
                        plantao.setEscala(escala);
                        AuditoriaUtil.inclusao(plantao, this.usuario);
                        dao.persistWithCurrentTransaction(plantao);
                        onCalls.add(plantao);
                        // salvar PlantaoSetor
                        if (plantaoVo.getListaSetorSelecionado() != null && !plantaoVo.getListaSetorSelecionado().isEmpty()) {
                            for (SetorVo setorVo : plantaoVo.getListaSetorSelecionado()) {
                                PlantaoSetor plantaoSetor = new PlantaoSetor();
                                plantaoSetor.setPlantao(plantao);
                                plantaoSetor.setSetor(SetorMapper.convertToEntity(setorVo));
                                dao.persistWithCurrentTransaction(plantaoSetor);
                            }
                        }
                        //salvar PlantaoEspecialidade
                        if (plantaoVo.getListaEspecialidadeSelecionado() != null && !plantaoVo.getListaEspecialidadeSelecionado().isEmpty()) {
                            for (EspecialidadeVo especialidadeVo : plantaoVo.getListaEspecialidadeSelecionado()) {
                                PlantaoEspecialidade plantaoEspecialidade = new PlantaoEspecialidade();
                                plantaoEspecialidade.setPlantao(plantao);
                                plantaoEspecialidade.setEspecialidade(EspecialidadeMapper.convertToEntity(especialidadeVo));
                                dao.persistWithCurrentTransaction(plantaoEspecialidade);
                            }
                        }
                    } else {
                        // Caso o dia da semana do primeiro plantão for diferente que mesmo
                        // que o dia da semana do contador, os outros tbm serão diferentes
                        break;
                    }
                }
                // Adiciono uma dia a data do contador
                dataInicioContador = Util.addDia(dataInicioContador, 1);
                // Formato a data do contador para semana, ex: terça-feira
                diaInicio = formatter.format(dataInicioContador);
            }
        }

        vo.setId(escala.getId());
        vo.setListaPlantao(PlantaoMapper.convertToListVoOnlyId(onCalls));

        return vo;
    }


    /**
     * Faz a exclusão logica de escala
     *
     * @param vo
     * @return
     **/
    public Info excluir(EscalaVo vo) {
        Info info = null;
        try {
            GenericDao<Escala> dao = new GenericDao<>();
            Escala contratante = EscalaMapper.convertToEntity(vo);
            if (contratante.getId() > 0) {
                AuditoriaUtil.exclusao(contratante, null);
                dao.update(contratante, AuditoriaUtil.getCamposExclusao());
                info = Info.GetSuccess("Escala excluído com sucesso.", EscalaMapper.convertToVo(contratante));
            } else {
                info = Info.GetError("Não foi possivel excluir o Escala.");
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao excluir Escala.");
        }
        return info;
    }

    public List<PlantaoVo> listarEscalaPlantao(FiltroEscala filtro) {
        List<PlantaoVo> listaVo = new ArrayList<>();
        List<EspecialidadeVo> listaEspecialidade;
        List<SetorVo> listaSetor;
        GenericDao dao = new GenericDao();
        try {

//            dao.beginTransaction();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.TURNO));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.VALOR));
            propriedades.add(new Propriedade(Plantao.NUMERO_VAGA));
            propriedades.add(new Propriedade(Plantao.DATA));

            String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Escala.ID, filtro.getId(), Filtro.EQUAL, aliasEscala));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL)));

            List<Plantao> lista = dao.listarByFilter(propriedades, null, Plantao.class, Constants.NO_LIMIT, nxCriterion);
            listaVo = PlantaoMapper.convertToListVo(lista);
            for (PlantaoVo plantao : listaVo) {
                List<Propriedade> propriedadesPlantaoEspecialidade = new ArrayList<>();
                propriedadesPlantaoEspecialidade.add(new Propriedade(PlantaoEspecialidade.ID));

                String aliasPlantao = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO);
                propriedadesPlantaoEspecialidade.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

                String aliasEspecialidade = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.ESPECIALIDADE);
                propriedadesPlantaoEspecialidade.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
                propriedadesPlantaoEspecialidade.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));


                NxCriterion nxCriterionEspecialidade = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantao.getId(), Filtro.EQUAL, aliasPlantao));

                listaEspecialidade = dao.listarByFilter(propriedadesPlantaoEspecialidade, null, PlantaoEspecialidade.class, Constants.NO_LIMIT, nxCriterionEspecialidade);
                plantao.setListaEspecialidadeSelecionado(listaEspecialidade);

                List<Propriedade> propriedadesPlantaoSetor = new ArrayList<>();
                propriedadesPlantaoSetor.add(new Propriedade(PlantaoSetor.ID));

                String aliasSetor = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.SETOR);
                propriedadesPlantaoSetor.add(new Propriedade(Setor.ID, Setor.class, aliasSetor));
                propriedadesPlantaoSetor.add(new Propriedade(Setor.DESCRICAO, Setor.class, aliasSetor));

                String aliasPlantao1 = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO);
                propriedadesPlantaoSetor.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao1));


                NxCriterion nxCriterionSetor = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantao.getId(), Filtro.EQUAL, aliasPlantao1));

//                listaSetor = dao.listarByFilter(propriedadesPlantaoSetor, null, PlantaoSetor.class, Constants.NO_LIMIT, nxCriterionSetor);
                listaSetor = new PlantaoSetorController().getSetoresDoPlantao(plantao.getId());
                plantao.setListaSetorSelecionado(listaSetor);

            }
//            dao.commitCurrentTransaction();

            List<String> definedOrder =
                    Arrays.asList("segunda", "terça", "quarta", "quinta", "sexta", "sabado", "domingo");

            List<String> turnoOrder =
                    Arrays.asList("manhã", "tarde", "noite");

            Comparator<PlantaoVo> plantaoVoComparator = Comparator.comparing(
                    p -> definedOrder.indexOf(p.getDia()));

            listaVo.sort(plantaoVoComparator.thenComparing(PlantaoVo::getData)
                    .thenComparing(p -> turnoOrder.indexOf(p.getTurno())).thenComparing(PlantaoVo::getHoraInicio));
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
//            dao.rollbackCurrentTransaction();
            //info = Info.GetError("Erro ao listar Escala");
        }

        return listaVo;
    }

    public List<EscalaVo> listarComboEscala() {
        List<EscalaVo> listVo = new ArrayList<>();
        try {
            GenericDao<Escala> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Escala.ID));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA));
            propriedades.add(new Propriedade(Escala.EXCLUIDO));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, true, Filtro.NOT_EQUAL));
            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Escala.NOME_ESCALA, NxOrder.NX_ORDER.ASC));

            List<Escala> lista = dao.listarByFilter(propriedades, nxOrders, Escala.class, -1, nxCriterion);

            listVo = EscalaMapper.convertToListVo(lista);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listVo;
    }

    /*
    public Info replicarEscala(EscalaVo vo) {
        Info info = null;
        GenericDao dao = new GenericDao();
        List<PlantaoEspecialidade> listaEspecialidade = new ArrayList<>();
        List<PlantaoSetor> listaSetor = new ArrayList<>();
        try {
            dao.beginTransaction();

            GenericDao<Escala> daoEscala = new GenericDao();

            List<Propriedade> propriedadesEscala = new ArrayList<>();
            propriedadesEscala.add(new Propriedade(Escala.ID));
            propriedadesEscala.add(new Propriedade(Escala.PERIODO_INICIO));
            propriedadesEscala.add(new Propriedade(Escala.PERIODO_FIM));

            NxCriterion nxCriterionEscala = NxCriterion.montaRestriction(new Filtro(Escala.ID, vo.getId(), Filtro.EQUAL));

            Escala escalaAnterior = daoEscala.selectUnique(propriedadesEscala, Escala.class, nxCriterionEscala);

            long dias = (vo.getPeriodoInicio().getTime() - escalaAnterior.getPeriodoInicio().getTime());
            long diferencaDeDias = (dias / (1000 * 60 * 60 * 24));

            Format formatter = new SimpleDateFormat("EEEE", new Locale("pt", "BR"));
            String diaInicio = formatter.format(escalaAnterior.getPeriodoInicio());
            String diaFim = formatter.format(escalaAnterior.getPeriodoFim());

            Integer chaveInicio = defineIndexDia(diaInicio);
            Integer chaveFim = defineIndexDia(diaFim);

            long diffDays = diferencaDeDias + chaveInicio;
            long semanas = diffDays / 7;
            Integer entreSemanas = (int) semanas;


            Escala escala = EscalaMapper.convertToEntity(vo);
            AuditoriaUtil.inclusao(escala, null);
            dao.persistWithCurrentTransaction(escala);


            //listar os plantao da escala id do combo
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.TURNO));
            propriedades.add(new Propriedade(Plantao.VALOR));
            propriedades.add(new Propriedade(Plantao.NUMERO_VAGA));
            propriedades.add(new Propriedade(Plantao.BLOQUEADO));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.DATA));

            String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

            String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Escala.ID, vo.getId(), Filtro.EQUAL, aliasEscala));

            List<Plantao> lista = dao.listarByFilter(propriedades, null, Plantao.class, Constants.NO_LIMIT, nxCriterion);

            for (Plantao plantao : lista) {
                Integer chaveDataPlantao = defineIndexDia(plantao.getDia());
                Integer idPlantaoAnterior = plantao.getId();


                Integer adicao = (chaveDataPlantao + (entreSemanas * 7));
                Calendar c = Calendar.getInstance();
                c.setTime(plantao.getData());
                c.add(Calendar.DATE, adicao);
                Date currentDatePlusOne = c.getTime();

                if (plantao.getStatus() != null && plantao.getStatus().equals(Constants.STATUS_PLANTAO_FIXO) && vo.getReplicaFixo()) {
                    plantao.setEscala(escala);
                    plantao.setData(currentDatePlusOne);
                    AuditoriaUtil.inclusao(plantao, usuario);
                    dao.persistWithCurrentTransaction(plantao);
                } else {
                    plantao.setStatus(null);
                    plantao.setMedico(null);
                    plantao.setEscala(escala);
                    plantao.setData(currentDatePlusOne);
                    AuditoriaUtil.inclusao(plantao, usuario);
                    dao.persistWithCurrentTransaction(plantao);
                }
                //listar os plantaoEspecialidade dos plantoes id
                List<Propriedade> propriedadesPlantaoEspecialidade = new ArrayList<>();
                propriedadesPlantaoEspecialidade.add(new Propriedade(PlantaoEspecialidade.ID));

                String aliasPlantao = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO);
                propriedadesPlantaoEspecialidade.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

                String aliasEspecialidade = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.ESPECIALIDADE);
                propriedadesPlantaoEspecialidade.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
                propriedadesPlantaoEspecialidade.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));


                NxCriterion nxCriterionEspecialidade = NxCriterion.montaRestriction(new Filtro(Plantao.ID, idPlantaoAnterior, Filtro.EQUAL, aliasPlantao));

                listaEspecialidade = dao.listarByFilter(propriedadesPlantaoEspecialidade, null, PlantaoEspecialidade.class, Constants.NO_LIMIT, nxCriterionEspecialidade);
                //percorrer a lista de plantaoEspecialidade com plantaoID da escala antiga
                for (PlantaoEspecialidade plantaoEspecialidade : listaEspecialidade) {
                    plantaoEspecialidade.setPlantao(plantao);
                    dao.persistWithCurrentTransaction(plantaoEspecialidade);
                }

                //listar os plantaoSetor dos plantoes id
                List<Propriedade> propriedadesPlantaoSetor = new ArrayList<>();
                propriedadesPlantaoSetor.add(new Propriedade(PlantaoSetor.ID));

                String aliasSetor = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.SETOR);
                propriedadesPlantaoSetor.add(new Propriedade(Setor.ID, Setor.class, aliasSetor));
                propriedadesPlantaoSetor.add(new Propriedade(Setor.DESCRICAO, Setor.class, aliasSetor));

                String aliasPlantao1 = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO);
                propriedadesPlantaoSetor.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao1));


                NxCriterion nxCriterionSetor = NxCriterion.montaRestriction(new Filtro(Plantao.ID, idPlantaoAnterior, Filtro.EQUAL, aliasPlantao1));

                listaSetor = dao.listarByFilter(propriedadesPlantaoSetor, null, PlantaoSetor.class, Constants.NO_LIMIT, nxCriterionSetor);
                //percorrer a lista de plantaoSetor com plantaoID da escala antiga
                for (PlantaoSetor plantaoSetor : listaSetor) {
                    plantaoSetor.setPlantao(plantao);
                    dao.persistWithCurrentTransaction(plantaoSetor);
                }
            }

            dao.commitCurrentTransaction();
            info = Info.GetSuccess("Escala replicada com sucesso");
        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return info;
    }
*/

    public Info replicarEscala(EscalaVo vo) {
        Info info = null;
        GenericDao dao = new GenericDao();
        List<Plantao> onCalls = new ArrayList<>();
        List<PlantaoSetor> listaSetor = new ArrayList<>();
        PlantaoController plantaoController = new PlantaoController();

        try {
            GregorianCalendar gc = new GregorianCalendar();
            GregorianCalendar gc2 = new GregorianCalendar();

            //CARREGA O PRIMEIRO PLANTÃO DA ESCALA
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.TURNO));
            propriedades.add(new Propriedade(Plantao.VALOR));
            propriedades.add(new Propriedade(Plantao.NUMERO_VAGA));
            propriedades.add(new Propriedade(Plantao.BLOQUEADO));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.DATA));
            String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));

            String aliasWorkplace = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.WOKRPLACE_ITEM);
            propriedades.add(new Propriedade("id", WorkplaceItem.class, aliasWorkplace));
            propriedades.add(new Propriedade("item", WorkplaceItem.class, aliasWorkplace));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Escala.ID, vo.getId(), Filtro.EQUAL, aliasEscala));
            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Plantao.DATA, NxOrder.NX_ORDER.ASC));
            //Seleciona só o primeiro, após replica e só muda a data
            List<Plantao> listaPlantaoAnterior = dao.listarByFilter(propriedades, nxOrders, Plantao.class, Constants.NO_LIMIT, nxCriterion);
            //Clona lista
            List<Plantao> listaPlantaoAux = PlantaoMapper.convertToListEntity(PlantaoMapper.convertToListVo(listaPlantaoAnterior));

            //Agrupa plantões

            Escala escalaAntiga = EscalaMapper.convertToEntity(getEscalaById(vo.getId()));

            dao.beginTransaction();
            Escala escala = EscalaMapper.convertToEntity(vo);
            escala.setId(null);
            AuditoriaUtil.inclusao(escala, this.usuario);
            escala.setAtivo(true);
            escala.setIsDraft(true);
            escala.setWorkplace(escalaAntiga.getWorkplace());
            dao.persistWithCurrentTransaction(escala);

            // Date dataBase = Util.convertDateHrInicial(escala.getPeriodoInicio(), null);
            // Date dataFim = Util.convertDateHrFinal(escala.getPeriodoFim(), null);

            Date dataBase = new DateTime(escala.getPeriodoInicio()).withZoneRetainFields(DateTimeZone.UTC).withTimeAtStartOfDay().toDate();
            Date dataFim = new DateTime(escala.getPeriodoFim()).withZoneRetainFields(DateTimeZone.UTC).withTime(23, 59, 59, 0).toDate();

            //Passa por todos os dias até a data fim
            while (dataBase.before(dataFim)) {
                gc.setTime(dataBase);
                int diaDaSemana = gc.get(GregorianCalendar.DAY_OF_WEEK);

                /**
                 * Como a escala que está sendo replicada, pode ter apenas platões para 3 semanas,
                 * mas o periodo atual pode ter 4 semanas ou mais, então pega os plantões em ordem para replicar,
                 *  quando replicar todos os anteriore, e ainda faltar semanas para criar plantão, cria mais sem médicos,
                 *  mesmo os anteriores sendo fixos
                 */
                Date dataOrdemSemana = null;
                boolean comMedicos = false;
                for (Plantao plantaoAux : listaPlantaoAux) {
                    gc.setTime(plantaoAux.getData());
                    int diaDaSemana2 = gc.get(GregorianCalendar.DAY_OF_WEEK);
                    //verifica se é o mesmo dia da semana
                    if (diaDaSemana == diaDaSemana2) {
                        dataOrdemSemana = plantaoAux.getData();
                        comMedicos = true;
                        break;
                    }
                }
                /*Se for diferente de null remove todos os plantões da mesma data da listaPlantaoAux
                 * faz isso para que na próxima vez que cair aqui, pegue o proxima platão depois desse que será removido
                 */
                if (dataOrdemSemana != null) {
                    gc.setTime(dataOrdemSemana);
                    for (int i = listaPlantaoAux.size() - 1; i >= 0; i--) {
                        Plantao plantaoAux = listaPlantaoAux.get(i);
                        gc2.setTime(plantaoAux.getData());
                        if (gc.get(GregorianCalendar.DAY_OF_MONTH) == gc2.get(GregorianCalendar.DAY_OF_MONTH)) {
                            listaPlantaoAux.remove(i);
                        }
                    }
                } else {
                    /*Se não achou um plantão que estava na ordem,
                     * é porque acabou, então busca o primeiro da semana mas sem medicos
                     */
                    for (Plantao plantaoAux : listaPlantaoAnterior) {
                        gc.setTime(plantaoAux.getData());
                        int diaDaSemana2 = gc.get(GregorianCalendar.DAY_OF_WEEK);
                        //verifica se é o mesmo dia da semana
                        if (diaDaSemana == diaDaSemana2) {
                            dataOrdemSemana = plantaoAux.getData();
                            comMedicos = false;
                            break;
                        }
                    }
                }


                if (dataOrdemSemana != null) {
                    List<Plantao> listaPlantao = new ArrayList<>();
                    gc.setTime(dataOrdemSemana);
                    for (Plantao plantaoAux : listaPlantaoAnterior) {
                        gc2.setTime(plantaoAux.getData());
                        if (gc.get(GregorianCalendar.DAY_OF_MONTH) == gc2.get(GregorianCalendar.DAY_OF_MONTH)) {
                            listaPlantao.add(plantaoAux);
                        }
                    }

                    for (Plantao plantaoAnterior : listaPlantao) {
                        //Clona o plantão
                        //TODO

                        Plantao plantao = PlantaoMapper.convertToEntity(PlantaoMapper.convertToVo(plantaoAnterior));
                        //Seta as datas novamente, pois o tiezone está estragando as datas
                        plantao.setHoraFim(plantaoAnterior.getHoraFim());
                        plantao.setHoraInicio(plantaoAnterior.getHoraInicio());
                        plantao.setId(null);
                        if (comMedicos && plantao.getStatus() != null && plantao.getStatus().equals(Constants.STATUS_PLANTAO_FIXO) && vo.getReplicaFixo()) {
                            plantao.setEscala(escala);
                            plantao.setData(dataBase);
                            AuditoriaUtil.inclusao(plantao, usuario);
                            dao.persistWithCurrentTransaction(plantao);
                        } else {
                            plantao.setStatus(null);
                            plantao.setMedico(null);
                            plantao.setEscala(escala);
                            plantao.setData(dataBase);
                            AuditoriaUtil.inclusao(plantao, usuario);
                            dao.persistWithCurrentTransaction(plantao);
                        }

                        //CARREGA ESPECIALIDADES DO PLANTÃO
                        List<Propriedade> propriedadesPlantaoEspecialidade = new ArrayList<>();
                        propriedadesPlantaoEspecialidade.add(new Propriedade(PlantaoEspecialidade.ID));

                        String aliasPlantao = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO);
                        propriedadesPlantaoEspecialidade.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

                        String aliasEspecialidade = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.ESPECIALIDADE);
                        propriedadesPlantaoEspecialidade.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
                        propriedadesPlantaoEspecialidade.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));


                        NxCriterion nxCriterionEspecialidade = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantaoAnterior.getId(), Filtro.EQUAL, aliasPlantao));

                        List<PlantaoEspecialidade> listaEspecialidade = dao.listarByFilter(propriedadesPlantaoEspecialidade, null, PlantaoEspecialidade.class, Constants.NO_LIMIT, nxCriterionEspecialidade);

                        //percorrer a lista de plantaoEspecialidade com plantaoID da escala antiga
                        for (PlantaoEspecialidade plantaoEspecialidade : listaEspecialidade) {
                            plantaoEspecialidade.setPlantao(plantao);
                            dao.persistWithCurrentTransaction(plantaoEspecialidade);
                        }

                        //listar os plantaoSetor dos plantoes id
                        List<Propriedade> propriedadesPlantaoSetor = new ArrayList<>();
                        propriedadesPlantaoSetor.add(new Propriedade(PlantaoSetor.ID));

                        String aliasSetor = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.SETOR);
                        propriedadesPlantaoSetor.add(new Propriedade(Setor.ID, Setor.class, aliasSetor));
                        propriedadesPlantaoSetor.add(new Propriedade(Setor.DESCRICAO, Setor.class, aliasSetor));

                        String aliasPlantao1 = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO);
                        propriedadesPlantaoSetor.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao1));


                        NxCriterion nxCriterionSetor = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantaoAnterior.getId(), Filtro.EQUAL, aliasPlantao1));

                        listaSetor = dao.listarByFilter(propriedadesPlantaoSetor, null, PlantaoSetor.class, Constants.NO_LIMIT, nxCriterionSetor);
                        //percorrer a lista de plantaoSetor com plantaoID da escala antiga
                        for (PlantaoSetor plantaoSetor : listaSetor) {
                            plantaoSetor.setPlantao(plantao);
                            dao.persistWithCurrentTransaction(plantaoSetor);
                        }

                        onCalls.add(plantao);
                    }
                }
                gc.setTime(dataBase);
                gc.add(GregorianCalendar.DAY_OF_MONTH, 1);
                dataBase = gc.getTime();
            }
            dao.commitCurrentTransaction();
            plantaoController.createAccessControlsByOnCalls(onCalls);
            info = Info.GetSuccess("Escala replicada com sucesso");
        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao replicar a escala.");
        }
        return info;
    }


    private Integer defineIndexDia(String data) {
        int chave = 0;
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

    public Info divulgarPlantoesEscala(EscalaVo escalaVo) {
        Info info;
        GenericDao<Plantao> genericDao = new GenericDao<>();
        try {

            if (escalaVo == null) {
                return Info.GetError("Escala não encontrada");
            }

            var isDraft = (Boolean) getSession()
                    .createQuery("select isDraft from Escala where id = :id")
                    .setLong("id", escalaVo.getId())
                    .uniqueResult();

            if (!isDraft) {
                return Info.GetError("Escala já foi disponibilizada.");
            }

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.DISPONIVEL));
            propriedades.add(new Propriedade(Plantao.BLOQUEADO));
            propriedades.add(new Propriedade(Plantao.MEDICO));

            String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Escala.ID, escalaVo.getId(), Filtro.EQUAL, aliasEscala));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL)));
            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.montaRestriction(new Filtro(Plantao.MEDICO, null, Filtro.IS_NULL)));
            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Plantao.BLOQUEADO, false, Filtro.EQUAL)),
                            NxCriterion.montaRestriction(new Filtro(Plantao.BLOQUEADO, null, Filtro.IS_NULL))));
            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Plantao.DISPONIVEL, false, Filtro.EQUAL)),
                            NxCriterion.montaRestriction(new Filtro(Plantao.DISPONIVEL, null, Filtro.IS_NULL))));

            List<Plantao> listaPlantoes = genericDao.listarByFilter(propriedades, null, Plantao.class, Constants.NO_LIMIT, nxCriterion);

            if (isNullOrEmpty(listaPlantoes)) {
                info = Info.GetSuccess("Não há plantões a serem divulgados");

                genericDao.beginTransaction();
                // update escala.isDraft = false
                List<Propriedade> propsUpdateDraft =
                        Arrays.asList(new Propriedade(Escala.ID), new Propriedade(Escala.IS_DRAFT));
                escalaVo.setIsDraft(false);
                Escala escala = EscalaMapper.convertToEntity(escalaVo);
                genericDao.updateWithCurrentTransaction(escala, propsUpdateDraft);
                genericDao.commitCurrentTransaction();

            } else {
                genericDao.beginTransaction();
                propriedades.clear();
                propriedades.add(new Propriedade(Plantao.DISPONIVEL));
                for (Plantao plantao : listaPlantoes) {
                    plantao.setDisponivel(true);
                    genericDao.updateWithCurrentTransaction(plantao, propriedades);
                }

                // update escala.isDraft = false
                List<Propriedade> propsUpdateDraft =
                        Arrays.asList(new Propriedade(Escala.ID), new Propriedade(Escala.IS_DRAFT));
                escalaVo.setIsDraft(false);
                Escala escala = EscalaMapper.convertToEntity(escalaVo);
                genericDao.updateWithCurrentTransaction(escala, propsUpdateDraft);

                genericDao.commitCurrentTransaction();
                info = Info.GetSuccess("Plantões divulgados com sucesso!");
            }

            this.fixDutyWithMedicAndStatusFixo(escalaVo.getId());

            Util.enviaEmail(getNovosPlantoesDisponiveisHtml(), Constants.TIPO_NOTIFICACAO_GESTAO_ESCALA);

            this.notifyMedicsToCheckAgenda(escalaVo.getId());

        } catch (Exception e) {
            genericDao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao divulgar os plantões, por favor tente novamente.");
        }
        return info;
    }

    private void notifyMedicsToCheckAgenda(Integer escalaId) {
        var name = (String) getSession()
                .createQuery("select nomeEscala from Escala where id = :escalaId")
                .setInteger("escalaId", escalaId)
                .uniqueResult();
        var medicos = (List<Medico>) getSession()
                .createQuery("select m from Plantao p " +
                        "join p.escala e " +
                        "join p.medico m " +
                        "where e.id = :escalaId and " +
                        "(m.excluido = false or m.excluido is null) ")
                .setInteger("escalaId", escalaId)
                .list();


        var notificationText = "Você foi adicionado em um plantão da Escala "+ name +", confira sua agenda.";
        this.saveNewShiftNotifications(medicos, notificationText, escalaId);

        var pushes = medicos
                .stream()
                .distinct()
                .filter(it -> !isNullOrEmpty(it.getTokenPushNotification()))
                .map(it -> {
                    var pushNotificationVo = new PushNotificationVo();
                    pushNotificationVo.setTo(it.getTokenPushNotification());
                    pushNotificationVo.setSound("default");
                    pushNotificationVo.setTitle("Nova Escala!");
                    pushNotificationVo.setBody(notificationText);
                    return pushNotificationVo;
                })
                .collect(toList());

        try {
            Util.enviarPushNotification(pushes);
        } catch (Exception e) {
            e.printStackTrace();
            logger.log(Level.WARNING, e.toString(), e);
        }
    }

    private void saveNewShiftNotifications(List<Medico> medicos, String text, Integer escalaId) {
        NotificationController notificationController;

        try {
            notificationController = new NotificationController(UsuarioMapper.convertToVo(this.usuario));
        } catch (Exception e) {
            e.printStackTrace();
            logger.log(Level.SEVERE, "Error to get NotificationController");
            return;
        }

        String type = Constants.PUSH_TYPE_NEW_SHIFT;
        EscalaVo escala = new EscalaVo();
        escala.setId(escalaId);

        medicos.stream().forEach(medic -> {
            try {
                var notification = new NotificationVo.Builder()
                    .setMedico(MedicoMapper.convertToVo(medic))
                    .setMessage(text)
                    .setType(type)
                    .setEscala(escala)
                    .create();

                notificationController.save(notification);
            } catch (Exception e) {
                e.printStackTrace();
                logger.log(Level.SEVERE, "Error to save notification");
            }
        });
    }

    private void fixDutyWithMedicAndStatusFixo(Integer escalaId) {

        List<Plantao> withMedicAndStatusFixo = getSession().createQuery("select p from Plantao p " +
                "where p.escala.id = :escalaId " +
                "and p.status = :status " +
                "and p.disponivel is null " +
                "and (p.bloqueado = :bloqueado or p.bloqueado is null) " +
                "and (p.excluido = :excluido or p.excluido is null)"
        )
                .setString("status", "F")
                .setBoolean("excluido", false)
                .setBoolean("bloqueado", false)
                .setInteger("escalaId", escalaId).list();

        if (isNullOrEmpty(withMedicAndStatusFixo)) return;

        Session session = getSession();
        var transaction = session.beginTransaction();
        transaction.begin();
        withMedicAndStatusFixo.forEach(plantao -> {
            plantao.setDisponivel(false);
            session.saveOrUpdate(plantao);
        });
        transaction.commit();
        session.flush();
    }


    public void checarEscalasExpiradas() {
        GenericDao<Escala> genericDao = new GenericDao<>();
        try {
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Escala.ID));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA));
            propriedades.add(new Propriedade(Escala.PERIODO_FIM));
            propriedades.add(new Propriedade(Escala.PERIODO_INICIO));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Escala.ATIVO, true, Filtro.EQUAL));
            List<Escala> escalas = genericDao.listarByFilter(propriedades, null, Escala.class, Constants.NO_LIMIT, nxCriterion);

            LocalDate today = new LocalDate();

            List<Propriedade> updPropriedades = new ArrayList<>();
            updPropriedades.add(new Propriedade(Escala.ATIVO));
            for (Escala escala : escalas) {
                LocalDate periodoFim = LocalDate.fromDateFields(escala.getPeriodoFim());
                if (periodoFim.isBefore(today)) {
                    escala.setAtivo(false);
                    genericDao.update(escala, updPropriedades);
                }
            }

        } catch (Exception e) {
            genericDao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
        }
    }

    public Info notificarMedicosPlantoesDisponiveis(Integer shiftId) {
        try {

            var isDraft = (Boolean) getSession()
                    .createQuery("select isDraft from Escala where id = :id")
                    .setLong("id", shiftId)
                    .uniqueResult();

            if (isDraft) {
                return Info.GetError("Escala ainda não foi disponibilizada.");
            }

            List<PushNotificationVo> listaPushNotificationVo = new ArrayList<>();

            List<Medico> medics = new BloqueioMedicoContratoController().getMedicToShift(shiftId);

            medics.stream()
                    .filter(m -> !isNullOrEmpty(m.getTokenPushNotification()))
                    .forEach(medico -> {
                        if (!isNullOrEmpty(medico.getTokenPushNotification()) && listaPushNotificationVo.stream().noneMatch(a -> a.getTo().equals(medico.getTokenPushNotification()))) {
                            PushNotificationVo pushNotificationVo = new PushNotificationVo();
                            pushNotificationVo.setTo(medico.getTokenPushNotification());
                            pushNotificationVo.setSound("default");
                            pushNotificationVo.setTitle("Novos plantões");
                            pushNotificationVo.setBody("Foram disponibilizados novos plantões, toque para conferir!");
                            listaPushNotificationVo.add(pushNotificationVo);
                        }
                    });


//            Contrato contract = (Contract) getSession().createQuery("select c from Escala e inner join e.contrato c where e.id = :id")
//                    .setInteger("id", shiftId)
//                    .uniqueResult();

            NotificationController notificationController = new NotificationController(UsuarioMapper.convertToVo(this.usuario));
//            String text = String.format("Foram disponibilizados novos plantões em %s", contract.getLocal());
            String type = Constants.PUSH_TYPE_NEW_SHIFT;
            EscalaVo escala = new EscalaVo();
            escala.setId(shiftId);

            medics.stream().forEach(medic -> {
                NotificationVo notification = new NotificationVo.Builder()
                        .setMedico(MedicoMapper.convertToVo(medic))
//                        .setMessage(text)
                        .setType(type)
                        .setEscala(escala)
                        .create();
                try {
                    notificationController.save(notification);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });

            if (!isNullOrEmpty(listaPushNotificationVo)) {
                try {
                    // Limito o envio do push por 100 registros para não ocorrer erro no expo
                    // Caso tenha mais de 100, quebramos a consulta até finalizar todos os registros
                    int qtdFim = 50;
                    List<PushNotificationVo> listPushTmp = new ArrayList<>(listaPushNotificationVo);
                    while (listPushTmp.size() != 0) {
                        int qtd = Math.min(qtdFim, listPushTmp.size());
                        List<PushNotificationVo> listaTmp = new ArrayList<>(listPushTmp).subList(0, qtd);

                        Util.enviarPushNotification(listaTmp);
                        listPushTmp = new ArrayList<>(listPushTmp).subList(qtd, listPushTmp.size());
                    }

                } catch (Exception ex) {
                    logger.log(Level.SEVERE, ex.toString(), ex);
                }
            }


            var medicsNotified = medics.stream().map(it -> {
                var medicoVo = new MedicoVo();
                medicoVo.setId(it.getId());
                medicoVo.setNome(it.getNome());
                return medicoVo;
            }).collect(toList());

            return Info.GetSuccess("Médicos notificados com sucesso", medicsNotified);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("error to notify: ", e.getMessage());
        }

    }

    /**
     * @return retorna template html para email
     */
    private String getNovosPlantoesDisponiveisHtml() {
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>Novos plantões foram disponibilizados para agendamento no aplicativo.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }


}
