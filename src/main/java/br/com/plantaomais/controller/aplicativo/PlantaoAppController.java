package br.com.plantaomais.controller.aplicativo;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.controller.BloqueioMedicoContratoController;
import br.com.plantaomais.controller.Controller;
import br.com.plantaomais.controller.EscalaController;
import br.com.plantaomais.controller.NotificationController;
import br.com.plantaomais.controller.PushNotificationController;
import br.com.plantaomais.entitybean.BloqueioMedicoContrato;
import br.com.plantaomais.entitybean.BloqueioMedicoEscala;
import br.com.plantaomais.entitybean.CandidatoPlantao;
import br.com.plantaomais.entitybean.Contract;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.PlantaoEspecialidade;
import br.com.plantaomais.entitybean.PlantaoSetor;
import br.com.plantaomais.entitybean.Setor;
import br.com.plantaomais.entitybean.Workplace;
import br.com.plantaomais.filtro.FiltroCalendario;
import br.com.plantaomais.filtro.FiltroPlantao;
import br.com.plantaomais.mapper.CandidatoPlantaoMapper;
import br.com.plantaomais.mapper.ContratoMapper;
import br.com.plantaomais.mapper.EspecialidadeMapper;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PlantaoEspecialidadeMapper;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.mapper.PlantaoSetorMapper;
import br.com.plantaomais.mapper.SetorMapper;
import br.com.plantaomais.util.*;
import br.com.plantaomais.util.email.EmailSendGrid;
import br.com.plantaomais.util.email.SendGridUtil;
import br.com.plantaomais.vo.CandidatoPlantaoVo;
import br.com.plantaomais.vo.EscalaVo;
import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.PlantaoEspecialidadeVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.aplicativo.ContratoCalendarioVo;
import br.com.plantaomais.vo.aplicativo.PlantaoCalendarioVo;
import br.com.plantaomais.vo.aplicativo.PlantaoDiaVo;
import br.com.plantaomais.vo.aplicativo.PlantaoUrlVo;
import org.joda.time.DateTime;
import org.joda.time.LocalDate;

import javax.validation.constraints.NotNull;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;

public class PlantaoAppController extends Controller {
    private static final Logger logger = Logger.getLogger(br.com.plantaomais.controller.EspecialidadeController.class.getName());

    public <T extends Principal> PlantaoAppController(T vo) throws AuthenticationException {
        super(vo);
    }
    /**
     * Retorno uma lista de contratantes
     *
     * @param filtro
     * @return
     */
    /**
     * Retorno uma lista de contratantes
     *
     * @param filtro
     * @return
     */
    public List<PlantaoVo> listar(FiltroPlantao filtro) {
        List<PlantaoVo> listaPlantaoVo = new ArrayList<>();
        try {

            GenericDao dao = new GenericDao();

            List<BloqueioMedicoEscala> listaBloqueioMedicoEscala = listarBloqueioMedicoEscalaPorMedicoId(medico.getId());
            List<Integer> listaIdBloqueioMedicoEscala = listaBloqueioMedicoEscala.stream().map(BloqueioMedicoEscala::getEscala).map(Escala::getId).collect(Collectors.toList());

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(PlantaoEspecialidade.ID));

            String aliasPlantao = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.TURNO, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.DIA, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.DATA, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.HORA_FIM, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.VALOR, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.DISPONIVEL, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.STATUS, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.BLOQUEADO, Plantao.class, aliasPlantao));

            String aliasMedico = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

            String aliasEscala = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.PERIODO_FIM, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.EXCLUIDO, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.IS_DRAFT, Escala.class, aliasEscala));

//            String aliasContrato = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO, Plantao.ESCALA, Escala.CONTRATO);
//            propriedades.add(new Propriedade(Contrato.ID, Contrato.class, aliasContrato));
//            propriedades.add(new Propriedade(Contrato.CIDADE, Contrato.class, aliasContrato));
//            propriedades.add(new Propriedade(Contrato.ESTADO, Contrato.class, aliasContrato));
//            propriedades.add(new Propriedade(Contrato.LOCAL, Contrato.class, aliasContrato));

            String aliasEspecialidade = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.ESPECIALIDADE);
            propriedades.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
            propriedades.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Plantao.BLOQUEADO, false, Filtro.EQUAL, aliasPlantao)),
                    NxCriterion.montaRestriction(new Filtro(Plantao.BLOQUEADO, null, Filtro.IS_NULL, aliasPlantao)))
                );

            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, false, Filtro.EQUAL, aliasEscala)),
                            NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, null, Filtro.IS_NULL, aliasEscala))));

            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.IS_DRAFT, false, Filtro.EQUAL, aliasEscala)));

            DateTime dt = new DateTime()
                    .withHourOfDay(0)
                    .withMinuteOfHour(0)
                    .withSecondOfMinute(0)
                    .withMillisOfSecond(0);

            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.DATA, dt.toDate(), Filtro.MAIOR_IGUAL, aliasPlantao)));

            if (!Util.isNullOrEmpty(listaIdBloqueioMedicoEscala)) {
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.ID, listaIdBloqueioMedicoEscala, Filtro.NOT_IN, aliasEscala)));
            }

            NxCriterion nxCriterionAux;

            if (filtro != null) {

                if (filtro.getMedico() != null) {
                    nxCriterionAux = NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Medico.ID, null, Filtro.IS_NULL, aliasMedico)),
                            NxCriterion.montaRestriction(new Filtro(Medico.ID, filtro.getMedico().getId(), Filtro.NOT_EQUAL, aliasMedico))
                    );
                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
                }

                if (filtro.getDisponivel() != null) {
                    if (filtro.getDisponivel()) {
                        nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Plantao.DISPONIVEL, filtro.getDisponivel(), Filtro.EQUAL, aliasPlantao));
                    } else {
                        nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Plantao.DISPONIVEL, filtro.getDisponivel(), Filtro.EQUAL, aliasPlantao));
                    }
                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
                } else {
                    nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.DISPONIVEL, true, Filtro.EQUAL, aliasPlantao)));
                }
//                if (filtro.getEspecialidade() != null && filtro.getEspecialidade().getId() != null) {
//                    nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Especialidade.ID, filtro.getEspecialidade().getId(), Filtro.EQUAL, aliasEspecialidade));
//                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
//                }

                if (filtro.getListaEspecialidades() != null && !filtro.getListaEspecialidades().isEmpty()) {
                    List<Integer> ids = new ArrayList<>();
                    filtro.getListaEspecialidades().forEach(vo -> {
                        ids.add(vo.getId());
                    });
                    nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Especialidade.ID, ids, Filtro.IN, aliasEspecialidade));
                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
                }

                if (!Util.isNullOrEmpty(filtro.getCidade())) {
//                    nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Contrato.CIDADE, filtro.getCidade(), Filtro.EQUAL, aliasContrato));
//                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
                }

                if (!Util.isNullOrEmpty(filtro.getEstado())) {
//                    nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Contrato.ESTADO, filtro.getEstado(), Filtro.EQUAL, aliasContrato));
//                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
                }

                if (!Util.isNullOrEmpty(filtro.getPeriodo())) {
                    if (filtro.getPeriodo().equals("DIURNO")) {
                        nxCriterionAux = NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Plantao.TURNO, "manhã", Filtro.EQUAL, aliasPlantao)),
                                NxCriterion.montaRestriction(new Filtro(Plantao.TURNO, "tarde", Filtro.EQUAL, aliasPlantao)));
                    } else {
                        nxCriterionAux = NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Plantao.TURNO, "noite", Filtro.EQUAL, aliasPlantao)),
                                NxCriterion.montaRestriction(new Filtro(Plantao.TURNO, "cinderela", Filtro.EQUAL, aliasPlantao)));
                    }
                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
                }

            }

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Plantao.ID, NxOrder.NX_ORDER.ASC));

            List<PlantaoEspecialidade> lista = dao.listarByFilter(propriedades, nxOrders, PlantaoEspecialidade.class, Constants.NO_LIMIT, nxCriterion);
            List<PlantaoEspecialidadeVo> listaVo = PlantaoEspecialidadeMapper.convertToListVo(lista);

            boolean temFiltro;

            if (filtro != null) {
                if (filtro.getEspecialidade() != null && filtro.getEspecialidade().getId() != null) {
                    temFiltro = true;
                } else {
                    temFiltro = false;
                }
            } else {
                temFiltro = false;
            }

            if (!Util.isNullOrEmpty(lista)) {
                List<PlantaoVo> plantoes = new ArrayList<>();
                if (temFiltro) {
                    for (PlantaoEspecialidadeVo plantaoEspecialidadeVo : listaVo) {
                        if (plantaoEspecialidadeVo.getEspecialidade().getId().equals(filtro.getEspecialidade().getId())) {
                            if (!plantoes.contains(plantaoEspecialidadeVo.getPlantao())) {
                                plantoes.add(plantaoEspecialidadeVo.getPlantao());
                            }
                        }
                    }
                    for (PlantaoVo plantao : plantoes) {
                        if (!listaPlantaoVo.contains(plantao)) {
                            PlantaoVo plantaoVo = plantao;
                            plantaoVo.setListaEspecialidades(new ArrayList<>());
                            // TODO: Refatoração do Contrato
                            plantaoVo.setLocal(plantao.getEscala().getWorkplace().getAddress().getStreet());
                            List<EspecialidadeVo> listaEspecialidadeVo = EspecialidadeMapper.convertToListVo(obterEspecialidadesPlantao(PlantaoMapper.convertToEntity(plantaoVo)));
                            plantaoVo.setListaEspecialidades(listaEspecialidadeVo);
                            listaPlantaoVo.add(plantaoVo);
                        }
                    }
                } else {
                    for (PlantaoEspecialidadeVo plantaoEspecialidadeVo : listaVo) {
                        if (!listaPlantaoVo.contains(plantaoEspecialidadeVo.getPlantao())) {
                            PlantaoVo plantaoVo = plantaoEspecialidadeVo.getPlantao();
                            plantaoVo.setListaEspecialidades(new ArrayList<>());
                            // TODO: Refatoração do Contrato
                            plantaoVo.setLocal(plantaoEspecialidadeVo.getPlantao().getEscala().getWorkplace().getAddress().getStreet());
                            for (PlantaoEspecialidadeVo plantaoEspecialidadeVo2 : listaVo) {
                                if (plantaoEspecialidadeVo2.getPlantao().equals(plantaoVo)) {
                                    plantaoVo.getListaEspecialidades().add(plantaoEspecialidadeVo2.getEspecialidade());
                                }
                            }
                            listaPlantaoVo.add(plantaoVo);
                        }
                    }
                }
            }

            /**
             * Busca a lista de setores cadastrados para cada plantão
             */
            for (PlantaoVo plantaoVo : listaPlantaoVo) {
                propriedades.clear();

                propriedades.add(new Propriedade(PlantaoSetor.ID));

                aliasPlantao = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO);
                propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

                String aliasSetor = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.SETOR);
                propriedades.add(new Propriedade(Setor.ID, Setor.class, aliasSetor));
                propriedades.add(new Propriedade(Setor.DESCRICAO, Setor.class, aliasSetor));

                nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantaoVo.getId(), Filtro.EQUAL, aliasPlantao));

                List<PlantaoSetor> listaPlantaoSetor = dao.listarByFilter(propriedades, null, PlantaoSetor.class, -1, nxCriterion);

                if (!Util.isNullOrEmpty(listaPlantaoSetor)) {
                    plantaoVo.setListaSetores(PlantaoSetorMapper.convertToListVo(listaPlantaoSetor));
                }
            }

            listaPlantaoVo.sort(Comparator.comparing(PlantaoVo::getData));

            return filterAllRelatedToCurrentMedic(listaPlantaoVo);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return new ArrayList<>();
//            info = Info.GetError("Erro ao listar Plantao");
        }
    }

    private List<PlantaoVo> filterAllRelatedToCurrentMedic(List<PlantaoVo> incomingList) throws Exception {
        List<PlantaoVo> result = new ArrayList<>();
        BloqueioMedicoContratoController bloqueioMedicoContratoController = new BloqueioMedicoContratoController();
        EscalaController escalaController = new EscalaController();

        for (PlantaoVo vo : incomingList) {
            EscalaVo withContract = escalaController.getEscalaById(vo.getEscala().getId());
            if (bloqueioMedicoContratoController.isMedicRelatedToContract(super.medicoVO.getId(), withContract.getContrato().getId().intValue())) {
                result.add(vo);
            }
        }

        return result;
    }

    /**
     * Lista a entidade BloqueioMedicoEscala de acordo com o id do medico passado por parâmetro
     *
     * @param id Id do médido
     * @return Lista da entidade BloqueioMedicoEscala
     * @throws Exception Erro de banco de dados
     */
    private List<BloqueioMedicoEscala> listarBloqueioMedicoEscalaPorMedicoId(Integer id) throws Exception {
        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(BloqueioMedicoEscala.ID));

        String aliasMedico = NxCriterion.montaAlias(BloqueioMedicoEscala.ALIAS_CLASSE, BloqueioMedicoEscala.MEDICO);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
        propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));

        String aliasEscala = NxCriterion.montaAlias(BloqueioMedicoEscala.ALIAS_CLASSE, BloqueioMedicoEscala.ESCALA);
        propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
        propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, id, Filtro.EQUAL, aliasMedico));

        GenericDao<BloqueioMedicoEscala> dao = new GenericDao<>();
        List<BloqueioMedicoEscala> lista = dao.listarByFilter(propriedades, null, BloqueioMedicoEscala.class, Constants.NO_LIMIT, nxCriterion);

        return lista;
    }


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
     * Cria um registro de CandidatoPlantao na tabela.
     * Esta tabela controla os candidatos as vagas de plantões disponíveis no aplicativo.
     *
     * @param candidatoPlantaoVo
     * @return Info info
     */
    public Info candidatarMedico(CandidatoPlantaoVo candidatoPlantaoVo) {
        Info info;
        GenericDao genericDao = new GenericDao<>();
        try {

            if (candidatoPlantaoVo == null || candidatoPlantaoVo.getMedico() == null || candidatoPlantaoVo.getPlantao() == null) {
                return Info.GetError("Erro ao realizar candidatura. Por favor, tente novamente");
            }

            if (LocalDate.fromDateFields(candidatoPlantaoVo.getPlantao().getData()).isBefore(LocalDate.fromDateFields(new Date()))) {
                return Info.GetError("Erro ao realizar candidatura. Não é possível se candidatar em plantões antigos.");
            }

            var newApplicant = false;
            var medicoPlantaoPush = new Medico();


            List<BloqueioMedicoEscala> listaBloqueioMedicoEscala = listarBloqueioMedicoEscalaPorMedicoId(medico.getId());

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(CandidatoPlantao.ID));

            String aliasPlantao = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            String aliasMedico = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.EMAIL, Medico.class, aliasMedico));

            // Traz apenas o registro em que o plantaoId e medicoId equivalem e cuja coluna aceito é null.
            // Para aceito = null significa que a candidatura ainda não foi avaliada na gestão de escala, ou seja o médico não precisa se candidatar novamente
            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, candidatoPlantaoVo.getMedico().getId(), Filtro.EQUAL, aliasMedico));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.ID, candidatoPlantaoVo.getPlantao().getId(), Filtro.EQUAL, aliasPlantao)));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.ACEITO, null, Filtro.IS_NULL)));
            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(
                            NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.CANCELADO, false, Filtro.EQUAL)),
                            NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.CANCELADO, null, Filtro.IS_NULL)))
            );
            CandidatoPlantao candidatoPlantao = (CandidatoPlantao) genericDao.selectUnique(propriedades, CandidatoPlantao.class, nxCriterion);

            if (candidatoPlantao != null) {
                return Info.GetError("Você já se candidatou a esta vaga!");
            }

            propriedades.clear();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.DISPONIVEL));
            propriedades.add(new Propriedade(Plantao.DATA));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.STATUS));

            String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));

            nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, candidatoPlantaoVo.getPlantao().getId(), Filtro.EQUAL));

            Plantao plantaoVaga = (Plantao) genericDao.selectUnique(propriedades, Plantao.class, nxCriterion);

            if (plantaoVaga.getDisponivel() != null && !plantaoVaga.getDisponivel()) {
                return Info.GetError("Desculpe, este plantão não está mais disponível.");
            }

            if (listaBloqueioMedicoEscala.stream().anyMatch(a -> a.getEscala().getId().equals(plantaoVaga.getEscala().getId()))) {
                return Info.GetError("Plantão indisponível.");
            }

            //@TODO Matheus: TESTAR ANTES DE DESCOMENTAR PARA PROD
//            List<Propriedade> propriedadesPlantao = new ArrayList<>();
//            propriedadesPlantao.add(new Propriedade(Plantao.ID));
//            propriedadesPlantao.add(new Propriedade(Plantao.EXCLUIDO));
//            propriedadesPlantao.add(new Propriedade(Plantao.DATA));
//            propriedadesPlantao.add(new Propriedade(Plantao.HORA_INICIO));
//            propriedadesPlantao.add(new Propriedade(Plantao.HORA_FIM));
//
//            String aliasMedicoPlantao = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
//            propriedadesPlantao.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
//
//            NxCriterion nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL));
//            nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Medico.ID, candidatoPlantaoVo.getMedico().getId(), Filtro.EQUAL, aliasMedico));
//
//            List<Plantao> listaPlantoesMedico = genericDao.listarByFilter(propriedadesPlantao, null, Plantao.class, -1, nxCriterionAux);

            List<Plantao> listaPlantoesMedico = getSession().createQuery(
                    "select p from Plantao p " +
                            "left join p.escala e " +
                            "left join p.medico m " +
                        "where " +
                            "(e.excluido = false or e.excluido is null) and " +
                            "(p.excluido = false or p.excluido is null) and " +
                            "(e.isDraft = false) and " +
                            "m.id = :medicoId")
                    .setInteger("medicoId", candidatoPlantaoVo.getMedico().getId())
                    .list();
            if (!Util.isNullOrEmpty(listaPlantoesMedico)) {
                if (Util.verificaHorarioConflitantePlantaoMedico(plantaoVaga, listaPlantoesMedico)) {
                    return Info.GetError("Você já possui um plantão neste período");
                }
            }

            candidatoPlantaoVo.setDataCandidatura(new Date());
            candidatoPlantaoVo.setAceito(null); // garanto que a propriedade seja nula para o persist

            candidatoPlantao = CandidatoPlantaoMapper.convertToEntity(candidatoPlantaoVo);
            if (candidatoPlantaoVo.getPlantao().getStatus() != null && candidatoPlantaoVo.getPlantao().getStatus().equals(Constants.STATUS_PLANTAO_DOACAO)) {
                candidatoPlantao.setDoacao(true);
            }
            AuditoriaUtil.inclusao(candidatoPlantao, this.usuario);
            genericDao.beginTransaction();
            genericDao.persistWithCurrentTransaction(candidatoPlantao);

            if (candidatoPlantao.getPlantao().getStatus() != null) {
                if (candidatoPlantao.getPlantao().getStatus().equals(Constants.STATUS_PLANTAO_DOACAO)) {
                    propriedades.clear();

                    propriedades.add(new Propriedade(Medico.ID));
                    propriedades.add(new Propriedade(Medico.NOME));
                    propriedades.add(new Propriedade(Medico.EMAIL));
                    propriedades.add(new Propriedade(Medico.TOKEN_PUSH_NOTIFICATION));

                    nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, candidatoPlantao.getMedico().getId(), Filtro.EQUAL));

                    Medico medico = (Medico) genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

                    nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, candidatoPlantao.getPlantao().getMedico().getId(), Filtro.EQUAL));

                    Medico medicoPlantao = (Medico) genericDao.selectUnique(propriedades, Medico.class, nxCriterion);
                    medicoPlantaoPush = medicoPlantao;

                    if (medicoPlantao != null) {
                        candidatoPlantaoVo.getMedico().setAnexoFoto(null);
                        candidatoPlantaoVo.getMedico().setToken(null);
                        candidatoPlantaoVo.setId(candidatoPlantao.getId());
                        candidatoPlantaoVo.getPlantao().setDia(plantaoVaga.getDia());
                        LocalDate date = new LocalDate(plantaoVaga.getData());
                        candidatoPlantaoVo.getPlantao().setData(date.toDate());

                        // send notification to medic owner of duty

                    }

                    if (!Util.isNullOrEmpty(medicoPlantao.getEmail())) {
                        // Envia um e-mail para o médico informando o não aceite da troca
                        EmailSendGrid email = new EmailSendGrid(medicoPlantao.getEmail(), "Candidato ao seu plantão doado",
                                getCandidatoPlantaoDoadoHtml(medicoPlantao, candidatoPlantaoVo, plantaoVaga), true);
                        SendGridUtil.enviar(email);
                    }


                    // email para os usuário do sistema web
                    EscalaController escalaController = new EscalaController();
                    EscalaVo escala = escalaController.getEscalaById(plantaoVaga.getEscala().getId());
                    Util.enviaEmailGestaoEscala(getCandidatoPlantaoDoadoHygeaHtml(medico, medicoPlantao, plantaoVaga), escala.getCoordenador().getId());
                }
            } else {
                // new applicant
                newApplicant = true;
            }
            genericDao.commitCurrentTransaction();

            if (newApplicant) {
                Plantao entity = (Plantao) getSession().createQuery("from Plantao where id = :id")
                        .setInteger("id", plantaoVaga.getId())
                        .uniqueResult();
                new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                        .sendPushApplicantReceived(medico, entity);
            } else {
                CandidatoPlantao entityUpdated = (CandidatoPlantao) getSession().createQuery("from CandidatoPlantao where id = :id")
                        .setInteger("id", candidatoPlantao.getId())
                        .uniqueResult();

                new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                        .sendPushDonationNewApplicant(medicoPlantaoPush, entityUpdated);
                // send notification to medic applicant
                new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                        .sendPushDonationApplicantReceived(medico, entityUpdated.getPlantao());
            }
            info = Info.GetSuccess(candidatoPlantaoVo);
        } catch (Exception e) {
            genericDao.rollbackCurrentTransaction();
            info = Info.GetError("Erro ao realizar candidatura. Por favor, tente novamente");
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    private String getCandidatoPlantaoDoadoHygeaHtml(Medico medicoCandidato, Medico medicoPlantao, Plantao plantaoVaga) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");
        Escala escalaPlantao = null;
        try {
            escalaPlantao = Util.obterEscalaPorPlantao(plantaoVaga.getId());

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        Date horaInicio = Util.converterDataTimeZone(plantaoVaga.getHoraInicio());
        Date horaFim = Util.converterDataTimeZone(plantaoVaga.getHoraFim());

        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>O Dr(a). " + medicoCandidato.getNome() + " se candidatou ao plantão doado de " +
                sdf.format(plantaoVaga.getData()) + " " + sdfHour.format(horaInicio) + " - " + sdfHour.format(horaFim) +
                " (" + plantaoVaga.getDia() + ")" +
//                " do local " + escalaPlantao.getContrato().getLocal() +
                " do Dr(a). " + medicoPlantao.getNome() + ".</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    // @FIXME Horário com timezone errado
    private String getCandidatoPlantaoDoadoHtml(Medico medico, CandidatoPlantaoVo candidatoPlantaoVo, Plantao plantao) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");
        Escala escala = null;
        try {
            escala = Util.obterEscalaPorPlantao(candidatoPlantaoVo.getPlantao().getId());

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        Date horaInicio = Util.converterDataTimeZone(plantao.getHoraInicio());
        Date horaFim = Util.converterDataTimeZone(plantao.getHoraFim());

        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá Dr(a). " + medico.getNome() + ",</p>";
        html += "<p>O Dr(a). " + candidatoPlantaoVo.getMedico().getNome() + " se candidatou ao seu plantão doado de " +
                sdf.format(plantao.getData()) + " " + sdfHour.format(horaInicio) + " - " + sdfHour.format(horaFim) +
                " (" + plantao.getDia() + ") ";
//                "do local " + escala.getContrato().getLocal() + ".</p>"
        html += "<p>Confira no aplicativo acessando a notificação enviada.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * @param candidatoPlantaoVo
     * @return
     */
    public Info aceitarRecusarDoacao(CandidatoPlantaoVo candidatoPlantaoVo) {
        Info info;
        GenericDao genericDao = new GenericDao();
        try {
            if (candidatoPlantaoVo == null ||
                    candidatoPlantaoVo.getMedico() == null ||
                    candidatoPlantaoVo.getPlantao() == null ||
                    candidatoPlantaoVo.getAceito() == null) {

                return Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            }

            // validate if candidatoPlantao is not aceepted or resufed before
            CandidatoPlantao entity = (CandidatoPlantao) getSession().createQuery("from CandidatoPlantao where id = :id")
                    .setInteger("id", candidatoPlantaoVo.getId()).uniqueResult();

            if (entity.getAceito() != null) {
                new NotificationController().markAsExecutedDonationDeclined(entity.getId());

                String resposta = entity.getAceito() ? "aceita" : "negada";
                return Info.GetError("Essa candidatura já foi " + resposta);
            }

            Plantao plantao = obterPlantaoPorId(candidatoPlantaoVo.getPlantao().getId());

            genericDao.beginTransaction();

            Medico medicoAtualPlantao = plantao.getMedico();
            Medico medicoCandidato = MedicoMapper.convertToEntity(candidatoPlantaoVo.getMedico());
            List<Propriedade> propriedades = new ArrayList<>();
            if (candidatoPlantaoVo.getAceito()) {

                propriedades.add(new Propriedade(Plantao.ID));
                propriedades.add(new Propriedade(Plantao.MEDICO));
                propriedades.add(new Propriedade(Plantao.STATUS));
                propriedades.add(new Propriedade(Plantao.DISPONIVEL));

                plantao.setMedico(medicoCandidato);
                plantao.setStatus("C");
                plantao.setDisponivel(false);

                genericDao.updateWithCurrentTransaction(plantao, propriedades);

                // Caso o médico canditado seja o médico atual (o que não deveria ocorrer) não envia os e-mails
                // Isso está acontecendo em prod, porém não conseguimos reproduzir
                // O fluxo está funcionando corretamente, mas alguns emails estão chegando assim:
                // "O Dr(a). MATHEUS ALLAN TOLEDO doou o plantão de ... para o Dr(a). MATHEUS ALLAN TOLEDO."
                // Por isso colocamos esta validação
                if (!medicoCandidato.getId().equals(medicoAtualPlantao.getId())) {
                    // Envia um e-mail para o médico informando o aceite da doação
                    EmailSendGrid email = new EmailSendGrid(obterEmailMedico(medicoCandidato.getId()), "Plantão aceito", getCandidatoDoacaoAceitoHtml(medicoCandidato, plantao), true);
                    SendGridUtil.enviar(email);

                    // Envia e-mail para os adms informando o aceite da doação
                    candidatoPlantaoVo.setPlantao(PlantaoMapper.convertToVo(plantao));
                    String conteudo = getCandidatoDoacaoAceitoHygeaHtml(medicoAtualPlantao, medicoCandidato, plantao);

                    EscalaController escalaController = new EscalaController();
                    EscalaVo escala = escalaController.getEscalaById(plantao.getEscala().getId());
                    Util.enviaEmailGestaoEscala(conteudo, escala.getCoordenador().getId());

                    //Envia e-mail informando os outros candidatos que não foram aceitos
                    List<CandidatoPlantao> candidatosNaoAceitos = getSession().createQuery("from CandidatoPlantao cp where cp.plantao = :plantaoId and cp.medico <> :id")
                            .setInteger("id", candidatoPlantaoVo.getMedico().getId())
                            .setInteger("plantaoId", plantao.getId()).list();

                    for (CandidatoPlantao candidatoPlantao : candidatosNaoAceitos) {
                        Medico medico = candidatoPlantao.getMedico();
                        EmailSendGrid emailPlantaoRecusado = new EmailSendGrid(obterEmailMedico(medico.getId()), "Plantão recusado", getCandidatoDoacaoNaoAceitoHtml(medico, plantao), true);
                        SendGridUtil.enviar(emailPlantaoRecusado);

                        String conteudoPlantaoRecusado = getCandidatoDoacaoNaoAceitoHygeaHtml(medicoAtualPlantao, medico, plantao);

                        Util.enviaEmailGestaoEscala(conteudoPlantaoRecusado, escala.getCoordenador().getId());

                       /* Plantao entityPlantao = (Plantao) getSession().createQuery("from Plantao where id = :id")
                                .setInteger("id", plantao.getId())
                                .uniqueResult();

                        new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                                .sendPushDonationDeclined(
                                        MedicoMapper.convertToVo(medico),
                                        entityPlantao);

                        new NotificationController().markAsExecutedDonationDeclined(candidatoPlantao.getId());*/
                    }
                }
            } else {


                // Envia um e-mail para o médico informando a solicitação de troca
                EmailSendGrid email = new EmailSendGrid(obterEmailMedico(medicoCandidato.getId()), "Plantão recusado", getCandidatoDoacaoNaoAceitoHtml(medicoCandidato, plantao), true);
                SendGridUtil.enviar(email);

                String conteudo = getCandidatoDoacaoNaoAceitoHygeaHtml(medicoAtualPlantao, medicoCandidato, plantao);

                EscalaController escalaController = new EscalaController();
                EscalaVo escala = escalaController.getEscalaById(plantao.getEscala().getId());
                Util.enviaEmailGestaoEscala(conteudo, escala.getCoordenador().getId());
                
            }

            CandidatoPlantao candidatoPlantao = CandidatoPlantaoMapper.convertToEntity(candidatoPlantaoVo);
            propriedades.clear();
            propriedades.add(new Propriedade(CandidatoPlantao.ID));
            propriedades.add(new Propriedade(CandidatoPlantao.ACEITO));
            propriedades.add(new Propriedade(CandidatoPlantao.DOACAO));

            candidatoPlantao.setDoacao(true);

            genericDao.updateWithCurrentTransaction(candidatoPlantao, propriedades);

            genericDao.commitCurrentTransaction();

            if (candidatoPlantaoVo.getAceito()) {

                Plantao entityPlantao = (Plantao) getSession().createQuery("from Plantao where id = :id")
                        .setInteger("id", plantao.getId())
                        .uniqueResult();

                new NotificationController(MedicoMapper.convertToVo(this.medico))
                        .markAsExecutedRelateToDuty(entityPlantao);

                new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                        .sendPushDonationAccepted(
                                MedicoMapper.convertToVo(medicoAtualPlantao),
                                entityPlantao);

                new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                        .sendPushDonationApplicantAccepted(
                                MedicoMapper.convertToVo(medicoCandidato),
                                MedicoMapper.convertToVo(medicoAtualPlantao),
                                plantao);

                List<CandidatoPlantao> candidatosNaoAceitos = getSession().createQuery("from CandidatoPlantao cp where cp.plantao = :plantaoId and cp.medico <> :id")
                        .setInteger("id", candidatoPlantaoVo.getMedico().getId())
                        .setInteger("plantaoId", plantao.getId()).list();

                for (CandidatoPlantao candidatoPlantaoNaoAceito : candidatosNaoAceitos) {
                    Medico medico = candidatoPlantaoNaoAceito.getMedico();
                    new PushNotificationController(MedicoMapper.convertToVo(this.medico))
                            .sendPushDonationDeclined(
                                    MedicoMapper.convertToVo(medico),
                                    plantao);

                    new NotificationController().markAsExecutedDonationDeclined(candidatoPlantaoNaoAceito.getId());
                }
            }



            info = Info.GetSuccess(Constants.SUCESSO);


        } catch (Exception e) {
            genericDao.rollbackCurrentTransaction();
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    /**
     * Retorna o HTML do email que será enviado para o candidato ao plantão doado que foi aceito.
     *
     * @param medico
     * @return
     */
    private String getCandidatoDoacaoAceitoHtml(Medico medico, Plantao plantao) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");

        Date horaInicio = Util.converterDataTimeZone(plantao.getHoraInicio());
        Date horaFim = Util.converterDataTimeZone(plantao.getHoraFim());

        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá Dr(a). " + medico.getNome() + ",</p>";
        html += "<p>Sua candidatura ao plantão doado de " +
                sdf.format(plantao.getData()) + " " + sdfHour.format(horaInicio) + " - " + sdfHour.format(horaFim) +
                " (" + plantao.getDia() + ")" +
                " foi aceita.</p>";
        html += "<p>Acesse a notificação enviada no aplicativo e confira.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * Retorna o HTML do email que será enviado para o candidato ao plantão doado que foi aceito.
     *
     * @param medico
     * @return
     */
    private String getCandidatoDoacaoNaoAceitoHtml(Medico medico, Plantao plantao) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");

        Date horaInicio = Util.converterDataTimeZone(plantao.getHoraInicio());
        Date horaFim = Util.converterDataTimeZone(plantao.getHoraFim());

        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá Dr(a). " + medico.getNome() + ",</p>";
        html += "<p>Sua candidatura ao plantão doado de " +
                sdf.format(plantao.getData()) + " " + sdfHour.format(horaInicio) + " - " + sdfHour.format(horaFim) +
                " (" + plantao.getDia() + ")" +
                " não foi aceita.</p>";
        html += "<p>Acesse a notificação enviada no aplicativo e confira.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * Retorna o HTML do email que será enviado para os usuários do grupo Hygea referente ao plantão doado que não foi aceito.
     *
     * @param medicoDoador
     * @param medicoAceite
     * @param plantao
     * @return
     */
    private String getCandidatoDoacaoNaoAceitoHygeaHtml(Medico medicoDoador, Medico medicoAceite, Plantao plantao) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");

        Date horaInicio = Util.converterDataTimeZone(plantao.getHoraInicio());
        Date horaFim = Util.converterDataTimeZone(plantao.getHoraFim());

        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>O Dr(a). " + medicoDoador.getNome() + " não aceitou a candidatura do Dr(a). " + medicoAceite.getNome() + " ao plantão doado do dia " +
                sdf.format(plantao.getData()) + " " + sdfHour.format(horaInicio) + " - " + sdfHour.format(horaFim) +
                " (" + plantao.getDia() + ").</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * Retorna o HTML do email que será enviado para os usuários do grupo Hygea referente ao plantão doado que foi aceito.
     *
     * @param medicoDoador
     * @param medicoAceite
     * @param plantao
     * @return
     */
    private String getCandidatoDoacaoAceitoHygeaHtml(Medico medicoDoador, Medico medicoAceite, Plantao plantao) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");

        Date horaInicio = Util.converterDataTimeZone(plantao.getHoraInicio());
        Date horaFim = Util.converterDataTimeZone(plantao.getHoraFim());

        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>O Dr(a). " + medicoDoador.getNome() + " doou o plantão de " +
                sdf.format(plantao.getData()) + " " + sdfHour.format(horaInicio) + " - " + sdfHour.format(horaFim) +
                " (" + plantao.getDia() + ")" +
                " para o Dr(a). " + medicoAceite.getNome() + ".</p>";
        html += "<p>Acesse a tela de gestão de escala no sistema para alterar o status do plantão.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }


    private Plantao obterPlantaoPorId(int id) throws Exception {
        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(Plantao.ID));
        propriedades.add(new Propriedade(Plantao.STATUS));
        propriedades.add(new Propriedade(Plantao.DISPONIVEL));
        propriedades.add(new Propriedade(Plantao.DATA));
        propriedades.add(new Propriedade(Plantao.DIA));
        propriedades.add(new Propriedade(Plantao.HORA_INICIO));
        propriedades.add(new Propriedade(Plantao.HORA_FIM));

        String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
        propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));
        propriedades.add(new Propriedade(Medico.TOKEN_PUSH_NOTIFICATION, Medico.class, aliasMedico));

        String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
        propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
        propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, id, Filtro.EQUAL));

        GenericDao<Plantao> genericDao = new GenericDao<>();

        return genericDao.selectUnique(propriedades, Plantao.class, nxCriterion);
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


    private List<PlantaoEspecialidade> retornarPlantoesPorEspecialidades(List<EspecialidadeVo> especialidades, Integer contratoId)
            throws Exception {
        GenericDao<PlantaoEspecialidade> genericDao = new GenericDao<>();

        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(PlantaoEspecialidade.ID));

        String aliasPlantao = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO);
        propriedades.add(new Propriedade(PlantaoEspecialidade.PLANTAO));
        propriedades.add(new Propriedade(Plantao.BLOQUEADO, Plantao.class, aliasPlantao));

        String aliasContrato = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO, Plantao.ESCALA, Escala.CONTRATO);
//        propriedades.add(new Propriedade(Contrato.ID, Contrato.class, aliasContrato));

        String aliasEscala = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO, Plantao.ESCALA);
        propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
        propriedades.add(new Propriedade(Escala.PERIODO_FIM, Escala.class, aliasEscala));
        propriedades.add(new Propriedade(Escala.EXCLUIDO, Escala.class, aliasEscala));

        String aliasEspecialidade = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.ESPECIALIDADE);
        propriedades.add(new Propriedade(PlantaoEspecialidade.ESPECIALIDADE));
        propriedades.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
        propriedades.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));

        List<String> descricoes = especialidades.stream().map(EspecialidadeVo::getDescricao).collect(Collectors.toList());

        NxCriterion nxCriterion = NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Plantao.BLOQUEADO, false, Filtro.EQUAL, aliasPlantao)),
                NxCriterion.montaRestriction(new Filtro(Plantao.BLOQUEADO, null, Filtro.IS_NULL, aliasPlantao)));


        nxCriterion = NxCriterion.and(nxCriterion,
                NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, false, Filtro.EQUAL, aliasEscala)),
                        NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, null, Filtro.IS_NULL, aliasEscala))));

        NxCriterion nxCriterionAux;
        if (contratoId != null) {
//            nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Contrato.ID, contratoId, Filtro.EQUAL, aliasContrato));
        }

        nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Especialidade.DESCRICAO, descricoes, Filtro.IN, aliasEspecialidade)));


        return genericDao
                .listarByFilter(propriedades, null, PlantaoEspecialidade.class, Constants.NO_LIMIT, nxCriterion);
    }

    /**
     * Retorno uma lista de contratos
     *
     * @param filtro
     * @return
     */
    /**
     * Retorno uma lista de contratos
     *
     * @param filtro
     * @return
     */
    public List<ContratoCalendarioVo> listarCalendario(FiltroCalendario filtro) {
        try {
            GenericDao<BloqueioMedicoContrato> dao = new GenericDao<>();
            GenericDao<Workplace> daoWorkplace = new GenericDao<>();

            Medico medico = this.medico;

            String aliasContrato = NxCriterion.montaAlias(BloqueioMedicoContrato.ALIAS_CLASSE, BloqueioMedicoContrato.CONTRATO);
            String aliasMedico = NxCriterion.montaAlias(BloqueioMedicoContrato.ALIAS_CLASSE, BloqueioMedicoContrato.MEDICO);
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(BloqueioMedicoContrato.MEDICO));
            propriedades.add(new Propriedade(BloqueioMedicoContrato.CONTRATO));
//            propriedades.add(new Propriedade(Contrato.DATA_VIGENCIA_FIM, Contrato.class, aliasContrato));
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));


            String aliasPlantao = NxCriterion.montaAlias(BloqueioMedicoContrato.ALIAS_CLASSE, BloqueioMedicoContrato.CONTRATO, Escala.CONTRATO, Plantao.ESCALA);

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medico.getId(), Filtro.EQUAL, aliasMedico));


            NxCriterion nxCriterionAux;

            if (filtro != null && !Util.isNullOrEmpty(filtro.getCidade())) {
//                nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Contrato.CIDADE, filtro.getCidade(), Filtro.EQUAL, aliasContrato));
//                nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
            }

            if (filtro != null && !Util.isNullOrEmpty(filtro.getEstado())) {
//                nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Contrato.ESTADO, filtro.getEstado(), Filtro.EQUAL, aliasContrato));
//                nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
            }

            List<BloqueioMedicoContrato> bloqueios = dao.listarByFilter(propriedades, null, BloqueioMedicoContrato.class, Constants.NO_LIMIT, nxCriterion);

            List<Contract> contratos = bloqueios.stream()
                    .map(BloqueioMedicoContrato::getContrato)
                    .collect(Collectors.toList());

//            List<Propriedade> propriedadesWorkplace = new ArrayList<>();
//            propriedadesWorkplace.add(new Propriedade(Workplace.ID));
//            propriedadesWorkplace.add(new Propriedade(Workplace.UNIT_NAME));

//            for (Contract contract: contratos) {
//                String aliasContract = NxCriterion.montaAlias(Workplace.ALIAS_CLASSE, Workplace.CONTRACT);
//                NxCriterion nxCriterionWorkplace = NxCriterion.montaRestriction(new Filtro(Contract.ID, contract.getId(), Filtro.EQUAL, aliasContract));
//
//                List<Workplace> workplaces = daoWorkplace.listarByFilter(propriedadesWorkplace, null, Workplace.class, Constants.NO_LIMIT, nxCriterionWorkplace);
//                contract.setWorkplaces(new HashSet<>(workplaces));
//            }

//
//            if (filtro != null && !bloqueios.isEmpty() && filtro.getListaEspecialidades() != null && !filtro.getListaEspecialidades().isEmpty()) {
//                for (BloqueioMedicoContrato bloqueio : bloqueios) {
//                    if (retornarPlantoesPorEspecialidades(filtro.getListaEspecialidades(), bloqueio.getContrato().getId()).isEmpty()) {
//                        contratos.remove(bloqueio.getContrato());
//                    }
//                }
//            }

            return contratos.stream()
                    .map(ContratoMapper::convertToCalendarioVo)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return new ArrayList<>();
    }

    private List<CandidatoPlantao> getCandidatoPlantaoById(Integer plantaoId) {

        var candidatos = (List<CandidatoPlantao>) getSession()
                .createQuery("select cp from CandidatoPlantao cp " +
                        "left join cp.plantao p " +
                        "left join cp.medico c " +
                        "where p.id = :plantaoId and c.id = :medicoId " +
                        "and cp.excluido = false and cp.aceito is null and " +
                        "(cp.cancelado = false or cp.cancelado is null)")
                .setInteger("plantaoId", plantaoId).setInteger("medicoId", this.medico.getId()).list();

        return candidatos;
    }

    public List<PlantaoCalendarioVo> getPlantoesWorkplace(Integer workplaceId) {
        GenericDao<Plantao> genericDao = new GenericDao<>();
        try {

            var basicPlantaoQuery = "select p from Plantao p " +
                    "left join p.escala e " +
                    "left join p.workplaceItem wi " +
                    "left join wi.workplace w " +
                    "left join p.medico m " +
                    "where w.id = :id " +
                    "and p.disponivel is not null " +
                    "and (p.excluido = false or p.excluido is null)" +
                    "and (e.excluido = false or e.excluido is null)" +
                    "and (e.isDraft = false) " +
                    "and (e.ativo = true)" +
                    "and (p.bloqueado = false or p.bloqueado is null)";

            var basicCandidatoQuery = "select cp from CandidatoPlantao cp " +
                    "left join cp.plantao p " +
                    "left join p.escala e " +
                    "left join cp.medico m " +
                    "left join p.workplaceItem wi " +
                    "left join wi.workplace w " +
                    "where w.id = :id and cp.excluido = false and cp.aceito is null " +
                    "and p.disponivel is not null " +
                    "and (e.excluido = false or e.excluido is null)" +
                    "and (p.excluido = false or p.excluido is null)" +
                    "and (e.isDraft = false) " +
                    "and (e.ativo = true)" +
                    "and (p.bloqueado = false or p.bloqueado is null) " +
                    "and m.id = :medicoId";

            var plantoes = (List<Plantao>) getSession()
                    .createQuery(basicPlantaoQuery).setInteger("id", workplaceId).list();

            Set<LocalDate> dates = plantoes.stream().map(it -> LocalDate.fromDateFields(it.getData())).collect(Collectors.toSet());
            List<PlantaoCalendarioVo> plantoesDate = dates.stream().map(it -> {
                PlantaoCalendarioVo plantaoCalendarioVo = new PlantaoCalendarioVo();
                plantaoCalendarioVo.setData(it);
                return plantaoCalendarioVo;
            }).collect(Collectors.toList());

            var dateQuery = " and p.data = :data";
            var disponivelQuery = " and p.disponivel = true";
            var medicoQuery = " and m.id = :medicoId";
            var confirmadoQuery = " and p.status = 'C' and (p.emTroca is null or p.emTroca = false)";
            var aConfirmarQuery = " and p.status = 'AC'";
            var fixoQuery = " and p.status = 'F'";
            var doacaoQuery = " and p.status = 'D'";
            var recusadoQuery = " and p.status = 'R'";
            var trocaQuery = " and p.emTroca = true";
            plantoesDate.forEach(it -> {
                var date = it.getData().toDate();
                var disponiveis = (List<Plantao>) getSession()
                        .createQuery(basicPlantaoQuery + disponivelQuery + dateQuery).setInteger("id", workplaceId)
                        .setDate("data", date).list();

                var confirmados = (List<Plantao>) getSession()
                        .createQuery(basicPlantaoQuery + medicoQuery + confirmadoQuery + dateQuery).setInteger("id", workplaceId)
                        .setDate("data", date)
                        .setInteger("medicoId", this.medico.getId()).list();

                var aConfirmar = (List<Plantao>) getSession()
                        .createQuery(basicPlantaoQuery + medicoQuery + aConfirmarQuery + dateQuery).setInteger("id", workplaceId)
                        .setDate("data", date)
                        .setInteger("medicoId", this.medico.getId()).list();

                var fixos = (List<Plantao>) getSession()
                        .createQuery(basicPlantaoQuery + medicoQuery + fixoQuery + dateQuery).setInteger("id", workplaceId)
                        .setDate("data", date)
                        .setInteger("medicoId", this.medico.getId()).list();

                var recusados = (List<Plantao>) getSession()
                        .createQuery(basicPlantaoQuery + medicoQuery + recusadoQuery + dateQuery).setInteger("id", workplaceId)
                        .setDate("data", date)
                        .setInteger("medicoId", this.medico.getId()).list();

                var doacoes = (List<Plantao>) getSession()
                        .createQuery(basicPlantaoQuery + medicoQuery + doacaoQuery + dateQuery).setInteger("id", workplaceId)
                        .setDate("data", date)
                        .setInteger("medicoId", this.medico.getId()).list();

                var trocas = (List<Plantao>) getSession()
                        .createQuery(basicPlantaoQuery + medicoQuery + trocaQuery + dateQuery).setInteger("id", workplaceId)
                        .setDate("data", date)
                        .setInteger("medicoId", this.medico.getId()).list();

                var candidato = (List<CandidatoPlantao>) getSession()
                        .createQuery(basicCandidatoQuery + dateQuery).setInteger("id", workplaceId)
                        .setDate("data", date)
                        .setInteger("medicoId", this.medico.getId()).list();

                it.setDisponivel(!Util.isNullOrEmpty(disponiveis));
                it.setCandidato(!Util.isNullOrEmpty(candidato));
                it.setEmTroca(!Util.isNullOrEmpty(trocas));
                it.setDoacao(!Util.isNullOrEmpty(doacoes));
                it.setFixo(!Util.isNullOrEmpty(fixos));
                it.setaConfirmar(!Util.isNullOrEmpty(aConfirmar));
                it.setConfirmado(!Util.isNullOrEmpty(confirmados));
                it.setRecusado(!Util.isNullOrEmpty(recusados));
            });

            return new ArrayList<>(plantoesDate);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return new ArrayList<>();
    }

    public PlantaoUrlVo getUrlPlantao(Integer plantaoId, Boolean escalista) throws BusinessException {
        var plantaoEspecialidade = (PlantaoEspecialidade) getSession()
                .createQuery("select pe from PlantaoEspecialidade pe " +
                        "left join pe.plantao p " +
                        "left join p.escala e " +
                        "left join p.medico m" +
                        "left join p.workplaceItem wi " +
                        "left join wi.workplace w " +
                        "where p.id = :id " +
                        "and (p.emTroca = true or p.status = 'D' or p.disponivel = true) ")
                .setInteger("id", plantaoId).uniqueResult();

        if (plantaoEspecialidade == null) {
            throw new BusinessException("Plantão inválido para gerar url");
        }

        if (!escalista) {
            if (plantaoEspecialidade.getPlantao().getMedico() == null || !Objects.equals(this.medico.getId(), plantaoEspecialidade.getPlantao().getMedico().getId())) {
                throw new BusinessException("Você só pode gerar url para os seus plantões");
            }
        }
        return PlantaoUrlVo.builder()
                .id(plantaoEspecialidade.getPlantao().getId())
                .plantaoInfo(PlantaoUtils.generateInfoForPlantao(plantaoEspecialidade,
                        plantaoEspecialidade.getPlantao().getEscala(), plantaoEspecialidade.getPlantao().getEscala().getWorkplace()))
                .build();
    }

    public PlantaoUrlVo getUrlPlantaoEscala(Integer escalaId) throws BusinessException {
        var plantoesEspecialidades = (List<PlantaoEspecialidade>) getSession()
                .createQuery("select pe from PlantaoEspecialidade pe " +
                        "left join pe.plantao p " +
                        "left join p.escala e " +
                        "left join p.workplaceItem wi " +
                        "left join wi.workplace w " +
                        "where e.id = :id " +
                        "and (p.emTroca = true or p.status = 'D' or p.disponivel = true) ")
                .setInteger("id", escalaId).list();

        if (plantoesEspecialidades == null || plantoesEspecialidades.isEmpty()) {
            throw new BusinessException("Não é possível gerar o link para nenhum plantão nessa escala");
        }

        return PlantaoUrlVo.builder()
                .id(escalaId)
                .plantaoInfo(PlantaoUtils.generateInfoForEscala(plantoesEspecialidades, plantoesEspecialidades.get(0).getPlantao().getEscala(),
                        plantoesEspecialidades.get(0).getPlantao().getEscala().getWorkplace()))
                .build();
    }

    public List<PlantaoDiaVo> getPlantoesDia(Integer workplaceId, String dia) {
        try {
            Date diaDate = new SimpleDateFormat("yyyy-MM-dd").parse(dia);

            var plantoes = (List<Plantao>) getSession()
                    .createQuery("select p from Plantao p " +
                            "left join p.escala e " +
                            "left join p.workplaceItem wi " +
                            "left join wi.workplace w " +
                            "left join w.contract c " +
                            "left join c.contractingParty cp " +
                            "where w.id = :id and p.data = :data " +
                            "and (e.excluido = :excluido or e.excluido is null)" +
                            "and (e.isDraft = false) " +
                            "and (e.ativo = :ativo)" +
                            "and (p.bloqueado = :bloqueado or p.bloqueado is null)" +
                            "and p.disponivel is not null")
                    .setInteger("id", workplaceId)
                    .setBoolean("excluido", false)
                    .setBoolean("ativo", true)
                    .setBoolean("bloqueado", false)
                    .setDate("data", diaDate).list();


            return plantoes.stream().map(it -> {
                var plantaoDiaVo = PlantaoMapper.convertToDiaVo(it);
                plantaoDiaVo.setDisponivel(it.getDisponivel());

                var plantaoSetores = (List<PlantaoSetor>) getSession()
                        .createQuery("select ps from PlantaoSetor ps " +
                                "join ps.plantao p " +
                                "join ps.setor s " +
                                "where p.id = :id").setInteger("id", it.getId()).list();

                var plantaoEspecialidades = (List<PlantaoEspecialidade>) getSession()
                        .createQuery("select pe from PlantaoEspecialidade pe " +
                                "join pe.plantao p " +
                                "join pe.especialidade e " +
                                "where p.id = :id").setInteger("id", it.getId()).list();

                if (!Util.isNullOrEmpty(plantaoSetores)) {
                    plantaoDiaVo.setSetores(
                            plantaoSetores.stream().map(plantaoSetor -> {
                                return SetorMapper
                                        .convertToVo(plantaoSetor.getSetor());
                            }).collect(Collectors.toList())
                    );
                }

                if (!Util.isNullOrEmpty(plantaoEspecialidades)) {
                    plantaoDiaVo.setListaEspecialidades(
                            plantaoEspecialidades.stream().map(plantaoEspecialidade -> {
                                return EspecialidadeMapper
                                        .convertToVo(plantaoEspecialidade.getEspecialidade());
                            }).collect(Collectors.toList())
                    );
                }

                var candidato = getCandidatoPlantaoById(it.getId());
                plantaoDiaVo.setData(it.getData());
                plantaoDiaVo.setLocal(it.getWorkplaceItem() != null ? it.getWorkplaceItem().getWorkplace().getAddress().getLocale() : "");
                if (it.getWorkplaceItem().getWorkplace().getContract().getContractingParty().getAddress().getCity() != null) {
                    plantaoDiaVo.setCidade(it.getWorkplaceItem() != null ? it.getWorkplaceItem().getWorkplace().getContract().getContractingParty().getAddress().getCity().getName() : "");
                    plantaoDiaVo.setEstado(it.getWorkplaceItem() != null ? it.getWorkplaceItem().getWorkplace().getContract().getContractingParty().getAddress().getCity().getState() != null ? it.getWorkplaceItem().getWorkplace().getContract().getContractingParty().getAddress().getCity().getState().getName() : "" : "");
                }
                plantaoDiaVo.setValor(it.getValor());
                plantaoDiaVo.setStatus(it.getStatus());
                plantaoDiaVo.setEmTroca(it.getEmTroca());
                plantaoDiaVo.setCandidato(candidato.size() > 0);
                return plantaoDiaVo;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return new ArrayList<>();
    }

}
