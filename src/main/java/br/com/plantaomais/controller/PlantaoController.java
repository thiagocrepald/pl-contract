package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;
import static br.com.plantaomais.util.Util.isNullOrFalse;
import br.com.nextage.persistence_2.util.Paginacao;
import br.com.nextage.persistence_2.vo.PaginacaoVo;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.CandidatoPlantao;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.MedicoEspecialidade;
import br.com.plantaomais.entitybean.Notification;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.PlantaoEspecialidade;
import br.com.plantaomais.entitybean.PlantaoSetor;
import br.com.plantaomais.entitybean.Setor;
import br.com.plantaomais.filtro.FiltroPlantao;
import br.com.plantaomais.integration.AccessControlApiSample;
import br.com.plantaomais.integration.dto.accesscontrol.AccessControlCreateDTO;
import br.com.plantaomais.integration.dto.oncall.OnCallIdDTO;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.mapper.UsuarioMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.util.email.EmailSendGrid;
import br.com.plantaomais.util.email.SendGridUtil;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.UsuarioVo;
import org.hibernate.HibernateException;
import org.joda.time.DateTime;
import org.joda.time.Minutes;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;
import static br.com.plantaomais.util.Util.isNullOrFalse;

/**
 * Created by nextage on 14/05/2019.
 */
@Service
public class PlantaoController extends Controller {

    private static final Logger logger = Logger.getLogger(PlantaoController.class.getName());

    public PlantaoController() {
    }

    public PlantaoController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }

    /**
     * Retorno uma lista de contratantes
     *
     * @param filtro
     * @return
     */
    public List<PlantaoVo> listar(FiltroPlantao filtro) {
        List<PlantaoVo> listaVo = null;
        try {

            GenericDao<Plantao> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.TURNO));
            propriedades.add(new Propriedade(Plantao.NUMERO_VAGA));
            propriedades.add(new Propriedade(Plantao.BLOQUEADO));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL));


            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Plantao.DIA, NxOrder.NX_ORDER.ASC));

            List<Plantao> lista = dao.listarByFilter(propriedades, nxOrders, Plantao.class, Constants.NO_LIMIT, nxCriterion);
            listaVo = PlantaoMapper.convertToListVo(lista);


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            //info = Info.GetError("Erro ao listar Plantao");
        }

        return listaVo;
    }

    public List<PlantaoVo> getAllWithMedicBetweenDateTimes(DateTime begin, DateTime end) {

        try {
            if (begin.isAfter(end)) {
                throw new IllegalArgumentException("invalid startHour value");
            }

            @SuppressWarnings("unchecked")
            List<Plantao> found = getSession()
                    .createQuery("from Plantao p where p.data >= :now and p.data <= :end and p.medico != null and p.excluido = false ")
                    .setDate("now", begin.toDate())
                    .setDate("end", end.toDate())
                    .list();

            return found
                    .stream()
                    .filter(p -> {
                        /*
                         * even though "horaInicio" is DateTime, it only contains the hour/minute info (as you could imply by the name)
                         * therefore this "merge" using "data" & "horaInicio"
                         */
                        DateTime hoursMinutes = new DateTime(p.getHoraInicio());
                        DateTime dutyDateTime = new DateTime(p.getData());
                        dutyDateTime = dutyDateTime
                                .withHourOfDay(hoursMinutes.getHourOfDay())
                                .withMinuteOfHour(hoursMinutes.getMinuteOfHour());

                        boolean isInsideRange =
                                (dutyDateTime.isAfter(begin) || dutyDateTime.isEqual(begin)) &&
                                        dutyDateTime.isBefore(end);

                        return isInsideRange;
                    })
                    .map(PlantaoMapper::convertToVo)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        return new ArrayList<>();
    }

    public List<PlantaoVo> getAllWithMedicAndStartingIn(int startHour) {
        try {
            if (startHour < 0) {
                throw new IllegalArgumentException("invalid startHour value");
            }

            @SuppressWarnings("unchecked")
            List<Plantao> found = getSession()
                    .createQuery("select p from Plantao p where p.data >= :now and p.medico != null and p.excluido = false ")
                    .setDate("now", new Date())
                    .list();

            DateTime now = new DateTime();

            return found
                    .stream()
                    .filter(p -> {
                        /*
                         * even though "horaInicio" is DateTime, it only contains the hour/minute info (as you could imply by the name)
                         * therefore this "merge" using "data" & "horaInicio"
                         */
                        DateTime hoursMinutes = new DateTime(p.getHoraInicio());
                        DateTime startDateTime = new DateTime(p.getData());
                        startDateTime = startDateTime.withHourOfDay(hoursMinutes.getHourOfDay()).withMinuteOfHour(hoursMinutes.getMinuteOfHour());

                        int minutes = Minutes.minutesBetween(now, startDateTime).getMinutes();

                        return minutes <= startHour * 60;
                    })
                    .map(PlantaoMapper::convertToVo)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        return new ArrayList<>();
    }

    /**
     * Retorno uma lista de Plantaos paginado
     *
     * @param paginacaoVo
     * @return
     */
    public Info listarPaginado(PaginacaoVo paginacaoVo) {
        Info info = null;

        try {
            GenericDao<Plantao> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.TURNO));
            propriedades.add(new Propriedade(Plantao.NUMERO_VAGA));


            NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Plantao.DIA, NxOrder.NX_ORDER.ASC));

            Paginacao.build(propriedades, nxOrders, Plantao.class, criterion, paginacaoVo);

            info = Info.GetSuccess(paginacaoVo);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao listar Plantao");
        }

        return info;
    }

    /**
     * Retorno de Plantaos com todas as propriendades carregadas
     *
     * @param vo PlantaoVo
     * @return
     */

    public Info getPlantaoById(PlantaoVo vo) {
        Info info = null;
        try {
            if (vo != null && vo.getId() != null) {
                GenericDao<Plantao> dao = new GenericDao();

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Plantao.ID));
                propriedades.add(new Propriedade(Plantao.HORA_FIM));
                propriedades.add(new Propriedade(Plantao.HORA_INICIO));
                propriedades.add(new Propriedade(Plantao.DIA));
                propriedades.add(new Propriedade(Plantao.TURNO));
                propriedades.add(new Propriedade(Plantao.NUMERO_VAGA));

                NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, true, Filtro.NOT_EQUAL));
                NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getId(), Filtro.EQUAL));
                criterion = NxCriterion.and(criterion, criterionAux);

                Plantao plantao = dao.selectUnique(propriedades, Plantao.class, criterion);

                vo = PlantaoMapper.convertToVo(plantao);

                info = Info.GetSuccess(vo);
            } else {
                info = Info.GetError("Plantao não encontrado.");
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao buscar Plantao.");
        }
        return info;
    }

    /**
     * Faz a exclusão logica de um PlantaoEspecialidade
     *
     * @param vo
     * @return
     **/
    public Info excluirPlantaoEspecialidade(PlantaoVo vo) {
        Info info = null;
        List<PlantaoVo> listaVo = new ArrayList<>();
        try {
            GenericDao<PlantaoEspecialidade> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();

            propriedades.add(new Propriedade(PlantaoEspecialidade.ID));


            String aliasPlantao = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.TURNO, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.DIA, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.HORA_FIM, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.VALOR, Plantao.class, aliasPlantao));

            String aliasEspecialidade = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.ESPECIALIDADE);
            propriedades.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getId(), Filtro.EQUAL, aliasPlantao));

            List<PlantaoEspecialidade> lista = dao.listarByFilter(propriedades, null, PlantaoEspecialidade.class, Constants.NO_LIMIT, nxCriterion);
            for (PlantaoEspecialidade plantaoEspecialidade : lista) {
                dao.delete(plantaoEspecialidade);
            }
            info = Info.GetSuccess("Especialidade deletado com sucesso");

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao deletar Especialidade");
        }
        return info;
    }


    public Info excluirPlantaoNotification(PlantaoVo vo) {
        try {
            GenericDao<Notification> dao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Notification.ID));

            String aliasPlantao = NxCriterion.montaAlias(Notification.ALIAS_CLASSE, Notification.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getId(), Filtro.EQUAL, aliasPlantao));

            var lista = dao.listarByFilter(propriedades, null, Notification.class, Constants.NO_LIMIT, nxCriterion);
            for (Notification notification : lista) {
                dao.delete(notification);
            }

            return Info.GetSuccess("Notifications deletado com sucesso");

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);

            return Info.GetError("Erro ao deletar Notification");
        }

    }

    /**
     * Faz a exclusão logica de um PlantaoSetor
     *
     * @param vo
     * @return
     **/
    public Info excluirPlantaoSetor(PlantaoVo vo) {
        Info info = null;
        List<PlantaoVo> listaVo = new ArrayList<>();
        try {
            GenericDao<PlantaoSetor> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(PlantaoSetor.ID));

            String aliasPlantao = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.TURNO, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.DIA, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.HORA_FIM, Plantao.class, aliasPlantao));
            propriedades.add(new Propriedade(Plantao.VALOR, Plantao.class, aliasPlantao));

            String aliasSetor = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.SETOR);
            propriedades.add(new Propriedade(Setor.ID, Setor.class, aliasSetor));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getId(), Filtro.EQUAL, aliasPlantao));

            List<PlantaoSetor> lista = dao.listarByFilter(propriedades, null, PlantaoSetor.class, Constants.NO_LIMIT, nxCriterion);
            for (PlantaoSetor plantaoSetor : lista) {
                dao.delete(plantaoSetor);
            }
            info = Info.GetSuccess("Setor deletado com sucesso");


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao deletar Setor");
        }
        return info;
    }

    /**
     * Faz a exclusão logica de um PlantaoSetor
     *
     * @param vo
     * @return
     **/

    public Info excluirCandidatosPlantao(PlantaoVo vo) {
        try {
            GenericDao<CandidatoPlantao> dao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(CandidatoPlantao.ID));

            String aliasPlantao = NxCriterion.montaAlias(CandidatoPlantao.ALIAS_CLASSE, CandidatoPlantao.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getId(), Filtro.EQUAL, aliasPlantao));

            var lista = dao.listarByFilter(propriedades, null, CandidatoPlantao.class, Constants.NO_LIMIT, nxCriterion);
            for (CandidatoPlantao candidatoPlantao: lista) {
                dao.delete(candidatoPlantao);
            }

            return Info.GetSuccess("Candidatos do plantão deletados com sucesso");

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);

            return Info.GetError("Erro ao deletar Candidatos do plantão");
        }

    }

    public Info excluirPlantao(PlantaoVo vo) {
        Info info = null;
        List<PlantaoVo> listaVo = new ArrayList<>();
        try {
            GenericDao<Plantao> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.TURNO));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.VALOR));
            propriedades.add(new Propriedade(Plantao.NUMERO_VAGA));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getId(), Filtro.EQUAL));

            List<Plantao> lista = dao.listarByFilter(propriedades, null, Plantao.class, Constants.NO_LIMIT, nxCriterion);
            for (Plantao plantao : lista) {
                info = excluirPlantaoEspecialidade(vo);
                if (!info.getErro()) {
                    info = excluirPlantaoSetor(vo);
                    if (!info.getErro()) {
                        info = excluirPlantaoNotification(vo);
                        if (!info.getErro()) {
                            dao.delete(plantao);
                        }
                    }
                }

            }
            info = Info.GetSuccess("Plantao deletado com sucesso");


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao deletar plantao");
        }
        return info;
    }

    /**
     * Atualiza o plantão que está sendo gerenciado na tela de gestão de escala
     * <p>
     * Pode adicioar um médico ao plantão, remover, alterar o status ou bloquear o plantão
     *
     * @param vo
     * @return
     */
    public Info atualizaPlantaoGestaoEscala(PlantaoVo vo) {
        Info info = null;
        try {
            GenericDao<Plantao> dao = new GenericDao();

            //propriedades do plantão
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.TURNO));
            propriedades.add(new Propriedade(Plantao.DIA));
            propriedades.add(new Propriedade(Plantao.DATA));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.VALOR));
            propriedades.add(new Propriedade(Plantao.NUMERO_VAGA));
            propriedades.add(new Propriedade(Plantao.BLOQUEADO));
            propriedades.add(new Propriedade(Plantao.MEDICO));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.DATA));
            propriedades.add(new Propriedade(Plantao.DISPONIVEL));
            propriedades.add(new Propriedade(Plantao.EM_TROCA));
            propriedades.add(new Propriedade(Plantao.ESCALA));
            propriedades.add(new Propriedade(Plantao.BLOCKED_REASON));

            //filtro por ID do plantão
            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getId(), Filtro.EQUAL));

            //retorna o plantão
            Plantao plantao = dao.selectUnique(propriedades, Plantao.class, nxCriterion);

            boolean valorAlterado = !vo.getValor().equals(plantao.getValor());

            //se for bloqueio do plantão
            //remove o médico do plantão (caso tenha) e faz o set de status como null
            if (vo.getBloqueado() != null && vo.getBloqueado()) {
                plantao.setValor(vo.getValor());
                plantao.setBloqueado(vo.getBloqueado());
                plantao.setMedico(null);
                plantao.setStatus(null);
                plantao.setBlockedReason(vo.getBlockedReason());
                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                AuditoriaUtil.alteracao(plantao, usuario);
                dao.update(plantao, propriedades);
                info = Info.GetSuccess(Constants.SUCESSO);

                //se o plantão estiver com bloqueado = false e um médico está sendo adicionado
            } else if (vo.getBloqueado() != null && !vo.getBloqueado() && vo.getMedico() != null) {
                //converte o vo do médico para entity
                Medico medico = MedicoMapper.convertToEntity(vo.getMedico());


                //obtém os plantões atrelados ao médico para verificar o conflito de horários
                List<Plantao> listaPlantoesMedico = obterPlantoesMedico(medico);

                //se retornar true significa que há horários conflitantes na agenda de plantões do médico
                if (Util.verificaHorarioConflitantePlantaoMedico(plantao, listaPlantoesMedico)) {
                    return Info.GetError(Constants.MSG_HORARIO_CONFLITANTE_MEDICO_PLANTAO);
                }

                //faz o set de bloqueado = false, do medico e do status selecionados na tela
                plantao.setBloqueado(vo.getBloqueado());
                plantao.setStatus(vo.getStatus());
                plantao.setValor(vo.getValor());
                plantao.setBlockedReason(null);
                if (plantao.getStatus().equals("default")) {
                    plantao.setMedico(null);
                } else {
                    plantao.setMedico(medico);
                }

                //a disponibilidade do plantão para candidatura dos médicos no app é feita através
                //do botão "Divulgar plantões disponíveis" na tela de gestão de escala. Portanto faz o set
                //de disponível = false
                plantao.setDisponivel(false);
                plantao.setEmTroca(false);

                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());
                AuditoriaUtil.alteracao(plantao);
                dao.update(plantao, propriedades);
                vo.setMedico(obterMedico(vo.getMedico()));

                if (!vo.getStatus().equals("default")) {
                    String status;

                    //monta a string de status para a notificação
                    if (plantao.getStatus().equals(Constants.STATUS_PLANTAO_FIXO)) {
                        status = "fixo";
                    } else if (plantao.getStatus().equals(Constants.STATUS_PLANTAO_A_CONFIRMAR)) {
                        status = "a confirmar";
                    } else {
                        status = "confirmado";
                    }

                    var isNotDraft = isNullOrFalse(plantao.getEscala().getIsDraft());
                    if (isNotDraft) {
                        var pushNotificationController = new PushNotificationController(UsuarioMapper.convertToVo(this.usuario));
                        try {
                            var plantaoPush = (Plantao) getSession()
                                    .createQuery("from Plantao where id = :id")
                                    .setInteger("id", plantao.getId())
                                    .uniqueResult();
                            if (valorAlterado) {
                                pushNotificationController.sendPushUpdateDutyValue(plantaoPush);
                            } else {
                                pushNotificationController.sendPushUpdateDutyStatus(plantaoPush, status);
                            }

                        } catch (HibernateException e) {
                            logger.log(Level.SEVERE, e.getMessage());
                        }

                        // Envia um e-mail para o médico da alteração do status
                        medico = MedicoMapper.convertToEntity(vo.getMedico());
                        var email = new EmailSendGrid(obterEmailMedico(medico.getId()),
                                "Status de plantão",
                                getStatusPlantaoAlteradoHtml(plantao, medico, status),
                                true);
                        SendGridUtil.enviar(email);

                        // Envia um e-mail para os usuários do grupo sistema web
                        Util.enviaEmail(getStatusPlantaoAlteradoHygeaHtml(plantao, medico, status),
                                Constants.TIPO_NOTIFICACAO_GESTAO_ESCALA);
                    }
                }
                info = Info.GetSuccess(Constants.SUCESSO, vo);


            } else {
                //se o plantão estiver sendo apenas bloqueado/desbloqueado
                plantao.setBloqueado(vo.getBloqueado());
                plantao.setValor(vo.getValor());
                plantao.setBlockedReason(null);
                if (vo.getMedico() == null) {
                    plantao.setMedico(null);
                    plantao.setStatus(null);
                    plantao.setDisponivel(true);
                }
                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());
                AuditoriaUtil.alteracao(plantao, usuario);
                dao.update(plantao, propriedades);

                info = Info.GetSuccess(Constants.SUCESSO);
            }


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao bloquear plantao");
        }
        return info;
    }

    /**
     * Monta o conteúdo do email em formato html da alteração do status do plantão para o médico
     *
     * @param plantao
     * @return retorna template html para email
     */
    private String getStatusPlantaoAlteradoHtml(Plantao plantao, Medico medico, String status) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");

        Date horaInicio = Util.converterDataTimeZone(plantao.getHoraInicio());
        Date horaFim = Util.converterDataTimeZone(plantao.getHoraFim());

//        String local = plantao.getEscala() != null && plantao.getEscala().getContrato() != null
//                ? plantao.getEscala().getContrato().getLocal() : "";

        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá Dr(a). " + medico.getNome() + ",</p>";
        html += "<p>O status do seu plantão de " + plantao.getDia() + " " +
                sdf.format(plantao.getData()) + " " + sdfHour.format(horaInicio) + " - " + sdfHour.format(horaFim) + " " +
                "" + " foi alterado para " + status + ". Acesse o aplicativo e confira em sua agenda.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * Monta o conteúdo do email em formato html da alteração de status plantão para os usuários do sistema Web
     * com a configuração de notificação de gestão de escala,.
     *
     * @param plantao
     * @return retorna template html para email
     */
    private String getStatusPlantaoAlteradoHygeaHtml(Plantao plantao, Medico medico, String status) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");

        Date horaInicio = Util.converterDataTimeZone(plantao.getHoraInicio());
        Date horaFim = Util.converterDataTimeZone(plantao.getHoraFim());

//        String local = plantao.getEscala() != null && plantao.getEscala().getContrato() != null
//                ? plantao.getEscala().getContrato().getLocal() : "";

        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>O status do plantão de " + plantao.getDia() + " " +
                sdf.format(plantao.getData()) + " " + sdfHour.format(horaInicio) + " - " + sdfHour.format(horaFim) + " " +
                " do médico " + medico.getNome() + " foi alterado para " + status + ".</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }


    private MedicoVo obterMedico(@NotNull MedicoVo vo) throws Exception {
        GenericDao<MedicoEspecialidade> dao = new GenericDao<>();

        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(MedicoEspecialidade.ID));

        String aliasEspecialidade = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.ESPECIALIDADE);
        propriedades.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
        propriedades.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));

        String aliasMedico = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.MEDICO);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
        propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, vo.getId(), Filtro.EQUAL, aliasMedico));

        List<MedicoEspecialidade> lista = dao.listarByFilter(propriedades, null, MedicoEspecialidade.class, Constants.NO_LIMIT, nxCriterion);

        StringBuilder especialidades = new StringBuilder();
        if (lista != null && lista.size() > 0) {
            for (MedicoEspecialidade medicoEspecialidade : lista) {
                if (medicoEspecialidade.getEspecialidade() != null) {
                    especialidades.append(medicoEspecialidade.getEspecialidade().getDescricao());
                    especialidades.append("; ");
                }

            }
        }
        if ((lista != null && lista.size() > 0 ? lista.get(0) : null) != null && lista.get(0).getMedico() != null) {
            vo.setNome(lista.get(0).getMedico().getNome());
        } else {
            GenericDao<Medico> genericDao = new GenericDao<>();
            propriedades.clear();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.NOME));

            nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, vo.getId(), Filtro.EQUAL));
            Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);
            if (medico != null && medico.getNome() != null) {
                vo.setNome(medico.getNome());
            }
        }

        vo.setEspecialidadesStr(especialidades.toString());

        return vo;
    }

    /**
     * Obtém todos os plantões em que o médico passado por parâmetro está atrelado
     *
     * @param medico
     * @return
     * @throws Exception
     */
    private List<Plantao> obterPlantoesMedico(Medico medico) throws Exception {

        //propriedades do plantão
        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(Plantao.ID));
        propriedades.add(new Propriedade(Plantao.DATA));
        propriedades.add(new Propriedade(Plantao.HORA_INICIO));
        propriedades.add(new Propriedade(Plantao.HORA_FIM));
        propriedades.add(new Propriedade(Plantao.EXCLUIDO));

        //alias médico
        String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

        String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
        propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
        propriedades.add(new Propriedade(Escala.EXCLUIDO, Escala.class, aliasEscala));

        //filtro por ID do médico e EXCLUIDO = null ou false do plantão
        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medico.getId(), Filtro.EQUAL, aliasMedico));
        nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL)));
        nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, false, Filtro.EQUAL, aliasEscala)));
        GenericDao<Plantao> genericDao = new GenericDao<>();

        //retorna a lista de plantões
        return genericDao.listarByFilter(propriedades, null, Plantao.class, Constants.NO_LIMIT, nxCriterion);

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

    @SuppressWarnings("java:S112")
    public void createAccessControlByOnCall(Plantao onCall) {
        if (onCall.getId() == null) throw new RuntimeException("On Call ID cannot be null!");
        AccessControlApiSample accessControlApiSample = new AccessControlApiSample();
        accessControlApiSample.createAccessControl(buildAccessControlCreateDTO(onCall));
    }

    @SuppressWarnings("java:S112")
    public void createAccessControlsByOnCalls(List<Plantao> onCalls) {
        Set<AccessControlCreateDTO> accessControls = new HashSet<>();
        AccessControlApiSample accessControlApiSample = new AccessControlApiSample();

        onCalls.forEach(onCall -> {
            if (onCall.getId() == null) throw new RuntimeException("On Call ID cannot be null!");
            accessControls.add(buildAccessControlCreateDTO(onCall));
        });

        accessControlApiSample.createAccessControls(accessControls);
    }

    private AccessControlCreateDTO buildAccessControlCreateDTO(Plantao onCall) {
        OnCallIdDTO onCallObject = new OnCallIdDTO();
        AccessControlCreateDTO accessControl = new AccessControlCreateDTO();

        onCallObject.setId(Long.valueOf(onCall.getId()));
        accessControl.setOnCall(onCallObject);

        return accessControl;
    }

}
