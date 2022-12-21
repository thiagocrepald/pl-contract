package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.nextage.util.RelatorioBean;
import br.com.nextage.util.RelatorioUtil;
import br.com.plantaomais.entitybean.Address;
import br.com.plantaomais.entitybean.Attachment;
import br.com.plantaomais.entitybean.BloqueioMedicoEscala;
import br.com.plantaomais.entitybean.CameToUs;
import br.com.plantaomais.entitybean.CampoAnexo;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.MedicoAnexo;
import br.com.plantaomais.entitybean.MedicoCurso;
import br.com.plantaomais.entitybean.MedicoEspecialidade;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.PlantaoEspecialidade;
import br.com.plantaomais.entitybean.PreferencesLocality;
import br.com.plantaomais.entitybean.PreferencesMedic;
import br.com.plantaomais.entitybean.State;
import br.com.plantaomais.entitybean.TipoPermissao;
import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.entitybean.Address;
import br.com.plantaomais.entitybean.Attachment;
import br.com.plantaomais.entitybean.BloqueioMedicoEscala;
import br.com.plantaomais.entitybean.CampoAnexo;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.MedicoAnexo;
import br.com.plantaomais.entitybean.MedicoCurso;
import br.com.plantaomais.entitybean.MedicoEspecialidade;
import br.com.plantaomais.entitybean.PaymentData;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.PlantaoEspecialidade;
import br.com.plantaomais.entitybean.PreferencesLocality;
import br.com.plantaomais.entitybean.PreferencesMedic;
import br.com.plantaomais.entitybean.State;
import br.com.plantaomais.entitybean.TipoPermissao;
import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.entitybean.enums.AttachmentType;
import br.com.plantaomais.entitybean.enums.NotificationStatus;
import br.com.plantaomais.entitybean.enums.PaymentType;
import br.com.plantaomais.filtro.FiltroMedico;
import br.com.plantaomais.mapper.AddressMapper;
import br.com.plantaomais.mapper.AttachmentMapper;
import br.com.plantaomais.mapper.BloqueioMedicoEscalaMapper;
import br.com.plantaomais.mapper.CameToUsMapper;
import br.com.plantaomais.mapper.CampoAnexoMapper;
import br.com.plantaomais.mapper.EscalaMapper;
import br.com.plantaomais.mapper.EspecialidadeMapper;
import br.com.plantaomais.mapper.MedicoAnexoMapper;
import br.com.plantaomais.mapper.MedicoCursoMapper;
import br.com.plantaomais.mapper.MedicoEspecialidadeMapper;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PaymentDataMapper;
import br.com.plantaomais.mapper.PlantaoEspecialidadeMapper;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.mapper.UsuarioMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.util.builder.PropriedadeListBuilder;
import br.com.plantaomais.util.criptografia.Criptografia;
import br.com.plantaomais.util.email.EmailSendGrid;
import br.com.plantaomais.util.email.SendGridUtil;
import br.com.plantaomais.vo.AnexoCampoCadastroMedicoVo;
import br.com.plantaomais.vo.ArquivoVo;
import br.com.plantaomais.vo.BloqueioMedicoEscalaVo;
import br.com.plantaomais.vo.CampoAnexoVo;
import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.MedicoAnexoVo;
import br.com.plantaomais.vo.MedicoCursoVo;
import br.com.plantaomais.vo.MedicoEspecialidadeVo;
import br.com.plantaomais.vo.MedicoExportarEspecialidadeVo;
import br.com.plantaomais.vo.MedicoExportarLocalityVo;
import br.com.plantaomais.vo.MedicoExportarVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.NotificationVo;
import br.com.plantaomais.vo.PlantaoEspecialidadeVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.PreferencesMedicVo;
import br.com.plantaomais.vo.TodosAnexosMedicoVo;
import br.com.plantaomais.vo.AnexoCampoCadastroMedicoVo;
import br.com.plantaomais.vo.ArquivoVo;
import br.com.plantaomais.vo.BloqueioMedicoEscalaVo;
import br.com.plantaomais.vo.CampoAnexoVo;
import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.MedicoAnexoVo;
import br.com.plantaomais.vo.MedicoCursoVo;
import br.com.plantaomais.vo.MedicoEspecialidadeVo;
import br.com.plantaomais.vo.MedicoExportarEspecialidadeVo;
import br.com.plantaomais.vo.MedicoExportarLocalityVo;
import br.com.plantaomais.vo.MedicoExportarVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.NotificationVo;
import br.com.plantaomais.vo.PaymentDataVo;
import br.com.plantaomais.vo.PlantaoEspecialidadeVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.PreferencesMedicVo;
import br.com.plantaomais.vo.TodosAnexosMedicoVo;
import br.com.plantaomais.vo.aplicativo.PushNotificationVo;
import org.apache.commons.lang3.tuple.Pair;
import org.hibernate.Query;
import org.jfree.util.Log;
import org.joda.time.DateTime;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;
import static br.com.plantaomais.controller.AuthController.PASSWORD_ENCODER;


/**
 * Created by nextage on 04/06/2019.
 */
public class MedicoController extends Controller {
    private static final Logger logger = Logger.getLogger(MedicoController.class.getName());

    private MedicAttachmentController medicAttachmentController;

    private PreferencesMedicController preferencesMedicController;

    private PaymentDataController paymentDataController;

    private PixController pixController;

    private CameToUsController cameToUsController;

    private final PushNotificationController pushNotificationController;

    public <T extends Principal> MedicoController(T vo) throws AuthenticationException {
        super(vo);
        medicAttachmentController = new MedicAttachmentController(vo);
        preferencesMedicController = new PreferencesMedicController(vo);
        pushNotificationController = new PushNotificationController(vo);
        paymentDataController = new PaymentDataController(vo);
        pixController = new PixController(vo);
        cameToUsController = new CameToUsController(vo);
    }


    public List<MedicoVo> listar(String ativo, String status, List<Integer> medicosId, String estado, Integer especialidadeId, Integer offset, Integer limit, String startDate, String endDate) {
        List<MedicoVo> listaVo = null;
        List<MedicoAnexoVo> listaMedicoAnexoVo = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            String queryString = "select m.id, m.nome, m.email, m.telefone, m.ufConselhoMedico, m.sexo, m.status, m.ativo, m.tokenPushNotification " +
                    "from Medico m where m.excluido = false ";

            if (ativo != null) {
                queryString += " and m.ativo = " + !ativo.equals("INATIVOS");
            }

            if (status != null) {
                queryString += " and m.status = '" + status + "'";
            }

            if (medicosId != null && medicosId.size() > 0) {
                queryString += " and m.id in :medicosId";
            }

            if (estado != null) {
                queryString += " and m.ufConselhoMedico = '" + estado + "'";
            }

            if (especialidadeId != null) {
                queryString += " and m.id in (select me.medico.id from MedicoEspecialidade me where me.especialidade.id = " + especialidadeId + ")";
            }

            if (startDate != null) {
                queryString += " and m.dataUsuarioInc >= '" + startDate + "'";
            }

            if (endDate != null) {
                queryString += " and m.dataUsuarioInc <= '" + endDate + "'";
            }

            var orderByString = " order by m.nome";

            if ("EA".equals(status)) {
                orderByString = " order by m.dataUsuarioInc";
            }

            Query query = getSession()
                    .createQuery(queryString + orderByString);
            if (medicosId != null && medicosId.size() > 0) {
                query.setParameterList("medicosId", medicosId);
            }

            if (offset != null && limit != null) {
                query.setFirstResult(offset)
                        .setMaxResults(limit);
            }

            List<Medico> lista = new ArrayList<>();

            query
                    .list()
                    .forEach(it -> {
                        Medico newMedico = new Medico();
                        Object[] result = (Object[]) it;
                        newMedico.setId((Integer) result[0]);
                        newMedico.setNome((String) result[1]);
                        newMedico.setEmail((String) result[2]);
                        newMedico.setTelefone((String) result[3]);
                        newMedico.setUfConselhoMedico((String) result[4]);
                        newMedico.setSexo((String) result[5]);
                        newMedico.setStatus((String) result[6]);
                        newMedico.setAtivo((Boolean) result[7]);
                        newMedico.setTokenPushNotification((String) result[8]);
                        lista.add(newMedico);
                    });

            listaVo = MedicoMapper.convertToListVo(lista);
            return listaVo;

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        return listaVo;
    }

    public Medico getMedico(Integer medicId) {
        return (Medico) getSession().createQuery("select m from Medico m where id = :id")
                .setInteger("id", medicId)
                .uniqueResult();
    }

    public Info getMedicoStatus(Integer medicId) {
        try {
            var medico = getMedico(medicId);
            var vo = MedicoMapper.convertToVo(medico);
            return Info.GetSuccess(Constants.SUCESSO, vo);
        } catch (Exception e) {
            Log.error(e);
            return Info.GetError(e.getMessage());
        }
    }

    private boolean rulesToHistory(MedicoAnexoVo medicoAnexoVo, MedicoAnexoVo newAttachment) {
        if (medicoAnexoVo.getEhHistorico() == null || medicoAnexoVo.getEhHistorico() == true) return true;

        if (medicoAnexoVo.getEspecialidade() != null && newAttachment.getEspecialidade() != null) {
            if (medicoAnexoVo.getEspecialidade().getId() != newAttachment.getEspecialidade().getId()) {
                return false;
            }
        }

        if (medicoAnexoVo.getMedicoCurso() != null && newAttachment.getMedicoCurso() != null &&
                medicoAnexoVo.getMedicoCurso().getCurso() != null && newAttachment.getMedicoCurso().getCurso() != null) {
            if (medicoAnexoVo.getMedicoCurso().getCurso().getId() != newAttachment.getMedicoCurso().getCurso().getId()) {
                return false;
            }
        }

        return true;
    }

    public Info salvar(MedicoVo vo) {
        Info info;
        GenericDao dao = new GenericDao<>();

        List<Integer> attachmentIds = new ArrayList<>();

        //document CampoAnexo.Campos.DOCUMENTOS_ADICIONAIS
        boolean invalidExtraDocumentFound = false;
        boolean containsExtraDocument = false;
        boolean containsNewExtraDocument = false;
        boolean sendPushMedicStatus = false;

        List<Pair<MedicoCursoVo, MedicoAnexo>> courseToSave = new ArrayList();

        try {
            boolean statusWasCompleted = false;
            if (vo.getId() != null) {
                var medicoExistente = getMedico(vo.getId());
                statusWasCompleted = medicoExistente.getStatus().equals(Constants.COMPLETO) &&
                        (medicoExistente.getCadastroCompleto() != null && medicoExistente.getCadastroCompleto());
            }

            dao.beginTransaction();
            List<Propriedade> propriedades;

            Medico medico = MedicoMapper.convertToEntity(vo);
            medico.setAtivo(vo.getAtivo());

            if (medico.getId() != null && medico.getId() > 0) {
                propriedades = new ArrayList<>();

                propriedades.add(new Propriedade(Medico.ID));
                propriedades.add(new Propriedade(Medico.PONTUACAO));

                if (!Util.isNullOrEmpty(vo.getNumeroCrm())) {
                    propriedades.add(new Propriedade(Medico.NUMERO_CRM));
                }
                if (!Util.isNullOrEmpty(vo.getNome())) {
                    propriedades.add(new Propriedade(Medico.NOME));
                }
                if (!Util.isNullOrEmpty(vo.getEmail())) {
                    propriedades.add(new Propriedade(Medico.EMAIL));
                }
                if (!Util.isNullOrEmpty(vo.getTelefone())) {
                    propriedades.add(new Propriedade(Medico.TELEFONE));
                }
                if (!Util.isNullOrEmpty(vo.getUfConselhoMedico())) {
                    propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO));
                }

                if (!Util.isNullOrEmpty(vo.getSexo())) {
                    propriedades.add(new Propriedade(Medico.SEXO));
                }
                if (!Util.isNullOrEmpty(vo.getBanco())) {
                    propriedades.add(new Propriedade(Medico.BANCO));
                }
                if (!Util.isNullOrEmpty(vo.getAgencia())) {
                    propriedades.add(new Propriedade(Medico.AGENCIA));
                }
                if (!Util.isNullOrEmpty(vo.getOperacao())) {
                    propriedades.add(new Propriedade(Medico.OPERACAO));
                }
                if (!Util.isNullOrEmpty(vo.getConta())) {
                    propriedades.add(new Propriedade(Medico.CONTA));
                }
                if (!Util.isNullOrEmpty(vo.getCpf())) {
                    propriedades.add(new Propriedade(Medico.CPF));
                }
                if (!Util.isNullOrEmpty(vo.getCnpj())) {
                    propriedades.add(new Propriedade(Medico.CNPJ));
                }
                if (!Util.isNullOrEmpty(vo.getNomeTitular())) {
                    propriedades.add(new Propriedade(Medico.NOME_TITULAR));
                }
                if (!Util.isNullOrEmpty(vo.getNumeroPis())) {
                    propriedades.add(new Propriedade(Medico.NUMERO_PIS));
                }
                if ((vo.getEhContaEmpresa() != null)) {
                    propriedades.add(new Propriedade(Medico.EH_CONTA_EMPRESA));
                }
                if (vo.getAddress() != null) {
                    AddressController addressController = new AddressController();
                    propriedades.add(new Propriedade(Medico.ADDRESS));
                    addressController.save(dao, vo.getAddress());
                }
                if (vo.getBirthDate() != null) {
                    propriedades.add(new Propriedade(Medico.BIRTH_DATE));
                }
                if (vo.getCrmIssueDate() != null) {
                    propriedades.add(new Propriedade(Medico.CRM_ISSUE_DATE));
                }
                if (vo.getNumeroCrmAdicional() != null) {
                    propriedades.add(new Propriedade(Medico.NUMERO_CRM_ADICIONAL));
                }
                if (vo.getUfConselhoMedicoAdicional() != null) {
                    propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO_ADICIONAL));
                }
                if (vo.getCrmAdicionalIssueDate() != null) {
                    propriedades.add(new Propriedade(Medico.CRM_ADICIONAL_ISSUE_DATE));
                }

                for (PaymentData paymentData : PaymentDataMapper.convertToListEntity(vo.getPaymentsData())) {
                    if (paymentData.getIsCompanyAccount() == null) {
                        paymentData.setIsCompanyAccount(false);
                    }
                    if (paymentData.getId() == null) {
                        Util.enviaEmail(getRecebimentoNovaModalidadeHtml(medico, paymentData), Constants.TIPO_NOTIFICACAO_NOVA_MODALIDADE);
                    }
                    paymentData.setMedico(medico);
                    if (paymentData.getPix() != null) {
                        var pix = pixController.save(paymentData.getPix(), dao);
                        paymentData.setPix(pix);
                    }
                    paymentDataController.save(paymentData, dao);
                }
                if (vo.getId() != null) {
                    Info infoMedico = this.getMedicoById(vo);
                    MedicoVo medicoVo = (MedicoVo) infoMedico.getObjeto();
                    List<PaymentData> oldPaymentsData = PaymentDataMapper.convertToListEntity(medicoVo.getPaymentsData());
                    List<PaymentData> newPaymentsData = PaymentDataMapper.convertToListEntity(vo.getPaymentsData());
                    for (PaymentData paymentData : oldPaymentsData.stream().filter(it -> newPaymentsData.stream().noneMatch(et -> it.getId().equals(et.getId()))).collect(Collectors.toList())) {
                        if (paymentData.getPix() != null) {
                            pixController.delete(paymentData.getPix(), dao);
                        }
                        paymentDataController.delete(paymentData, dao);
                    }
                }

                if (vo.getPreferencesMedic() != null) {
                    preferencesMedicController.saveByMedicVo(vo, dao);
                }

                if (!Util.isNullOrEmpty(vo.getTipoRecebimento())) {

                    propriedades.add(new Propriedade(Medico.TIPO_RECEBIMENTO));

                    if (vo.getTipoRecebimento().equals("PF")) {
                        propriedades.add(new Propriedade(Medico.BANCO));
                        propriedades.add(new Propriedade(Medico.AGENCIA));
                        propriedades.add(new Propriedade(Medico.OPERACAO));
                        propriedades.add(new Propriedade(Medico.CONTA));
                        propriedades.add(new Propriedade(Medico.CPF));
                        propriedades.add(new Propriedade(Medico.CNPJ));
                        propriedades.add(new Propriedade(Medico.NOME_TITULAR));
                        propriedades.add(new Propriedade(Medico.NUMERO_PIS));

                    } else if (vo.getTipoRecebimento().equals("PJ")) {
                        propriedades.add(new Propriedade(Medico.EH_CONTA_EMPRESA));
                    }
                }

                if (vo.getSenha() != null && vo.getSenha().length() > 0) {
                    propriedades.add(new Propriedade(Usuario.SENHA));
                    propriedades.add(new Propriedade(Medico.EMAIL_VALIDADO));
                    medico.setEmailValidado(true);
                    medico.setSenha(PASSWORD_ENCODER.encode(vo.getSenha()));
                }

                if (!Util.isNullOrEmpty(vo.getAnexoFoto())) {
                    propriedades.add(new Propriedade(Medico.ANEXO_FOTO));
                    propriedades.add(new Propriedade(Medico.NOME_ANEXO_FOTO));
                    propriedades.add(new Propriedade(Medico.TIPO_ANEXO_FOTO));
                }

                boolean temCnh = false;
                boolean rgPossuiCpf = false;

                for (TodosAnexosMedicoVo attachments : vo.getListTodosAnexosMedicoVo()) {
                    if (attachments.getCampoAnexo().getId() == 14) {
                        if (attachments.getListMedicoAnexo().size() > 0) {
                            temCnh = true;
                            break;
                        }
                    }
                    if (attachments.getCampoAnexo().getId() == 4) {
                        rgPossuiCpf = attachments.getListMedicoAnexo().stream().anyMatch(it ->
                                it.getExtra() != null && it.getExtra().getRgPossuiCpf()
                        );
                    }
                    if (attachments.getCampoAnexo().getId() == CampoAnexo.Campos.DOCUMENTOS_ADICIONAIS.getId()) {

                        containsExtraDocument = attachments.getListMedicoAnexo().size() > 0;

                        containsNewExtraDocument = attachments.getListMedicoAnexo().stream()
                                .anyMatch(it -> it.getId() == null);
                    }
                }
                boolean validoCadastroCompleto = true;
                for (TodosAnexosMedicoVo attachments : vo.getListTodosAnexosMedicoVo()) {
                    if ((attachments.getCampoAnexo().getId() == 11 || attachments.getCampoAnexo().getId() == 12) && (vo.getPaymentsData() == null || vo.getPaymentsData().size() == 0 || vo.getPaymentsData().stream().noneMatch(it -> it.getType().equals(PaymentType.PJ)))) {
                        continue;
                    }

                    if (attachments.getCampoAnexo().getId() == 20) {
                        continue;
                    }

                    if (attachments.getCampoAnexo().getId() != 2 &&
                            attachments.getCampoAnexo().getId() != 7 &&
                            attachments.getCampoAnexo().getId() != 8 &&
                            attachments.getCampoAnexo().getId() != 9 &&
                            attachments.getCampoAnexo().getId() != 10 &&
                            attachments.getCampoAnexo().getId() != 14 &&
                            attachments.getCampoAnexo().getId() != 20 &&
                            attachments.getCampoAnexo().getId() != 21 &&
                            attachments.getCampoAnexo().getId() != CampoAnexo.Campos.CRM.getId() &&
                            attachments.getCampoAnexo().getId() != CampoAnexo.Campos.CRM_ADICIONAL.getId() &&
                            attachments.getCampoAnexo().getId() != CampoAnexo.Campos.PROTOCOLO_ADICIONAL.getId() &&
                            attachments.getCampoAnexo().getId() != CampoAnexo.Campos.JUNTA_COMERCIAL.getId() &&
                            attachments.getCampoAnexo().getId() != CampoAnexo.Campos.CARTAO_CNPJ.getId() &&
                            attachments.getCampoAnexo().getId() != CampoAnexo.Campos.CONTRATO_SOCIAL.getId() &&
                            attachments.getCampoAnexo().getId() != CampoAnexo.Campos.DOCUMENTOS_ADICIONAIS.getId()) {

                        if ((attachments.getCampoAnexo().getId() == 4 || attachments.getCampoAnexo().getId() == 5)) {
                            if (!temCnh) {
                                if (attachments.getListMedicoAnexo().size() <= 0 && !rgPossuiCpf) {
                                    validoCadastroCompleto = false;
                                }
                            }

                        } else if (attachments.getCampoAnexo().getId() != 14 && attachments.getListMedicoAnexo().size() <= 0) {
                            validoCadastroCompleto = false;
                        }
                    }

                    for (MedicoAnexoVo newAttachment : attachments.getListMedicoAnexo()) {
                        // Se vier do front com  flag excluido = true o usuário removeu o anexo
                        if (newAttachment.isExcluido()) {
                            MedicoAnexo medicoAnexo = MedicoAnexoMapper.convertToEntity(newAttachment);


                            if (newAttachment.getAttachment() != null) {
//                                new AttachmentController().delete(medicoAnexo.getAttachment());
                            }

                            checkExtraDocumentPermission(medicoAnexo.getCampoAnexo().getId());

                            dao.deleteWithCurrentTransaction(medicoAnexo);
                        } else {
                            // Faz a validação do anexo apenas se não for histórico
                            if (!Util.isNullOrFalse(newAttachment.getEhHistorico())) {
                                continue;
                            }
                            if (Util.isNullOrFalse(newAttachment.getValidado())
                                    && attachments.getCampoAnexo().getId() != 7
                                    && attachments.getCampoAnexo().getId() != 10
                                    && attachments.getCampoAnexo().getId() != 15) {
                                // Caso o anexo não esteja validado pelo usuário e o mesmo é diferente de anexos de especialidades e cursos
                                validoCadastroCompleto = false;
                            }
                        }

                        if (newAttachment.getId() == null) {
                            for (MedicoAnexoVo medicoAnexoVo : attachments.getListMedicoAnexo()) {
                                if (medicoAnexoVo.equals(newAttachment)) {
                                    continue;
                                }
                                if (medicoAnexoVo.getId() != null) {
                                    medicoAnexoVo.setEhHistorico(this.rulesToHistory(medicoAnexoVo, newAttachment));
                                    medicoAnexoVo.setUsuarioAlt(vo.getName());
                                    medicoAnexoVo.setDataUsuarioAlt(new Date());
                                    medicoAnexoVo.setDataUsuarioInc(new Date());
                                    medicoAnexoVo.setUsuarioInc(vo.getNome());
                                    MedicoAnexo medicoAnexo = MedicoAnexoMapper.convertToEntity(medicoAnexoVo);
                                    AuditoriaUtil.alteracao(medicoAnexo, usuario);
                                    List<Propriedade> propriedadesMedicoAnexo = new ArrayList<>();

                                    propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.EH_HISTORICO));
                                    propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.OBSERVACAO_VALIDACAO));
                                    propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.VALIDADO));
                                    propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.BASE64_ANEXO));
                                    propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.EXTRA));
                                    propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.ATTACHMENT));
                                    propriedadesMedicoAnexo.addAll(AuditoriaUtil.getCamposAlteracao());

                                    checkExtraDocumentPermission(medicoAnexoVo.getCampoAnexo().getId());

                                    if (isExtraDocument(medicoAnexo) && !medicoAnexo.getValidado()) {
                                        invalidExtraDocumentFound = true;
                                    }

                                    if (medicoAnexo.getBase64Anexo() != null) {
                                        Attachment attachment = new Attachment();
                                        attachment.setContentType(medicoAnexo.getTipoAnexo());
                                        attachment.setFile(medicoAnexo.getBase64Anexo());
                                        attachment.setFileName(medicoAnexo.getNomeAnexo());
                                        attachment.setName(medicoAnexo.getNomeAnexo());
                                        attachment.setProcessed(false);
                                        attachment.setType(AttachmentType.DOCUMENT);

                                        Integer attachmentId = dao.persistWithCurrentTransaction(attachment);
                                        attachment.setId(attachmentId);
                                        attachmentIds.add(attachmentId);

                                        medicoAnexo.setAttachment(attachment);
                                        medicoAnexo.setBase64Anexo(null);
                                    }

                                    dao.updateWithCurrentTransaction(medicoAnexo, propriedadesMedicoAnexo);
                                }
                            }
                        }

                        if (newAttachment.getId() == null) {
                            MedicoAnexoVo medicoAnexoVo = new MedicoAnexoVo();
                            medicoAnexoVo.setMedico(vo);
                            medicoAnexoVo.setCampoAnexo(attachments.getCampoAnexo());
                            medicoAnexoVo.setEhHistorico(false);
                            medicoAnexoVo.setValidado(!Util.isNullOrFalse(newAttachment.getValidado()));
                            medicoAnexoVo.setNomeAnexo(newAttachment.getNomeAnexo());
                            medicoAnexoVo.setBase64Anexo(newAttachment.getBase64Anexo());
                            medicoAnexoVo.setTipoAnexo(newAttachment.getTipoAnexo());
                            medicoAnexoVo.setEhVerso(newAttachment.getEhVerso());
                            medicoAnexoVo.setVisualizado(false);
                            medicoAnexoVo.setExtra(newAttachment.getExtra());
                            if (newAttachment.getEspecialidade() != null) {
                                medicoAnexoVo.setEspecialidade(newAttachment.getEspecialidade());
                            }
                            if (newAttachment.getMedicoCurso() != null) {
                                MedicoCursoController medicoCursoController = new MedicoCursoController(
                                        UsuarioMapper.convertToVo(this.usuario));

                                MedicoCursoVo novoMedicoCursoVo = medicoCursoController
                                        .salvar(newAttachment.getMedicoCurso());

                                medicoAnexoVo.setMedicoCurso(novoMedicoCursoVo);
                            }
                            MedicoAnexo medicoAnexo = MedicoAnexoMapper.convertToEntity(medicoAnexoVo);
                            AuditoriaUtil.inclusao(medicoAnexo, usuario);

                            checkExtraDocumentPermission(medicoAnexoVo.getCampoAnexo().getId());

                            if (isExtraDocument(medicoAnexo) && !medicoAnexo.getValidado() && !medicoAnexo.getExcluido()) {
                                invalidExtraDocumentFound = true;
                            }

                            if (medicoAnexo.getBase64Anexo() != null) {
                                Attachment attachment = new Attachment();
                                attachment.setContentType(medicoAnexo.getTipoAnexo());
                                attachment.setFile(medicoAnexo.getBase64Anexo());
                                attachment.setFileName(medicoAnexo.getNomeAnexo());
                                attachment.setName(medicoAnexo.getNomeAnexo());
                                attachment.setProcessed(false);
                                attachment.setType(AttachmentType.DOCUMENT);

                                Integer attachmentId = dao.persistWithCurrentTransaction(attachment);
                                attachment.setId(attachmentId);
                                attachmentIds.add(attachmentId);

                                medicoAnexoVo.setAttachment(AttachmentMapper.convertToVo(attachment));
                                medicoAnexo.setAttachment(attachment);
                                medicoAnexoVo.setBase64Anexo(null);
                                medicoAnexo.setBase64Anexo(null);
                            }

                            dao.persistWithCurrentTransaction(medicoAnexo);
                        } else {
                            MedicoAnexo attachment = MedicoAnexoMapper.convertToEntity(newAttachment);
                            attachment.setValidado(!Util.isNullOrFalse(newAttachment.getValidado()));
                            AuditoriaUtil.alteracao(attachment, usuario);
                            List<Propriedade> propriedadesUpdt = new ArrayList<>();

                            propriedadesUpdt.add(new Propriedade(MedicoAnexo.EH_HISTORICO));
                            propriedadesUpdt.add(new Propriedade(MedicoAnexo.OBSERVACAO_VALIDACAO));
                            propriedadesUpdt.add(new Propriedade(MedicoAnexo.VALIDADO));
                            propriedadesUpdt.add(new Propriedade(MedicoAnexo.BASE64_ANEXO));
                            propriedadesUpdt.add(new Propriedade(MedicoAnexo.EXTRA));
                            propriedadesUpdt.add(new Propriedade(MedicoAnexo.ATTACHMENT));
                            propriedadesUpdt.addAll(AuditoriaUtil.getCamposAlteracao());

                            if (isExtraDocument(attachment) && !attachment.getValidado() && !attachment.getExcluido()) {
                                invalidExtraDocumentFound = true;
                            }

                            if (attachment.getBase64Anexo() != null) {
                                Attachment anexoAttachment = new Attachment();
                                anexoAttachment.setContentType(attachment.getTipoAnexo());
                                anexoAttachment.setFile(attachment.getBase64Anexo());
                                anexoAttachment.setFileName(attachment.getNomeAnexo());
                                anexoAttachment.setName(attachment.getNomeAnexo());
                                anexoAttachment.setProcessed(false);
                                anexoAttachment.setType(AttachmentType.DOCUMENT);

                                Integer attachmentId = dao.persistWithCurrentTransaction(anexoAttachment);
                                anexoAttachment.setId(attachmentId);
                                attachmentIds.add(attachmentId);

                                newAttachment.setAttachment(AttachmentMapper.convertToVo(anexoAttachment));
                                attachment.setAttachment(anexoAttachment);
                                attachment.setBase64Anexo(null);
                            }

                            dao.updateWithCurrentTransaction(attachment, propriedadesUpdt);

                        }
                    }
                }
                propriedades.add(new Propriedade(Medico.CADASTRO_COMPLETO));
                propriedades.add(new Propriedade(Medico.STATUS));
                propriedades.add(new Propriedade(Medico.ATIVO));

                if (validoCadastroCompleto && !statusWasCompleted) {
                    sendPushMedicStatus = true;

                    sendMedicStatusNotification(
                            vo,
                            "Validação de cadastro",
                            "O seu cadastro foi validado e agora você já pode se candidatar aos nossos plantões.",
                            Constants.TIPO_PUSH_VALIDACAO_CADASTRO);


                    // Envia um e-mail
                    EmailSendGrid email = new EmailSendGrid(obterEmailMedico(medico.getId()), "Validação de cadastro", getCadastroValidadoHtml(medico), true);
                    SendGridUtil.enviar(email);
                }

                if (validoCadastroCompleto) {
                    medico.setCadastroCompleto(true);
                    medico.setStatus(Constants.COMPLETO);
                } else {
                    sendPushMedicStatus = true;

                    sendMedicStatusNotification(
                            vo,
                            "Validação de cadastro",
                            "Foram encontradas Inconsistências em seu cadastro.",
                            Constants.TIPO_PUSH_INVALIDO_CADASTRO);

                    EmailSendGrid email = new EmailSendGrid(obterEmailMedico(medico.getId()), "Validação de cadastro", getCadastroInvalidoHtml(medico), true);
                    SendGridUtil.enviar(email);

                    medico.setCadastroCompleto(false);
                    if (medico.getStatus().equals(Constants.EM_ANALISE) || medico.getStatus().equals(Constants.COMPLETO)) {
                        medico.setStatus(Constants.DOCUMENTOS_PENDENTES);
                    }
                }

                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                AuditoriaUtil.alteracao(medico, usuario);
                dao.updateWithCurrentTransaction(medico, propriedades);
                info = Info.GetSuccess(Constants.MSG_MEDICO_SALVO_SUCESSO, vo);

                if (!Util.isNullOrEmpty(vo.getListaMedicoEspecialidade())) {
                    for (var medicoEspecialidadeVo : vo.getListaMedicoEspecialidade()) {
                        if (medicoEspecialidadeVo.getId() == null) {
                            var medicoEspecialidade = MedicoEspecialidadeMapper.convertToEntity(medicoEspecialidadeVo);
                            medicoEspecialidade.setMedico(medico);
                            dao.persistWithCurrentTransaction(medicoEspecialidade);
                        }
                    }
                }
                if (!Util.isNullOrEmpty(vo.getListaBloqueioMedicoEscala())) {
                    for (BloqueioMedicoEscalaVo bloqueioMedicoEscalaVo : vo.getListaBloqueioMedicoEscala()) {
                        if (bloqueioMedicoEscalaVo.getId() == null) {
                            BloqueioMedicoEscala bloqueioMedicoEscala = new BloqueioMedicoEscala();
                            bloqueioMedicoEscala.setMedico(medico);
                            bloqueioMedicoEscala.setEscala(EscalaMapper.convertToEntity(bloqueioMedicoEscalaVo.getEscala()));
                            dao.persistWithCurrentTransaction(bloqueioMedicoEscala);
                        }
                    }
                }
            } else {
                var props = new ArrayList<Propriedade>();
                props.add(new Propriedade(Medico.ID));
                props.add(new Propriedade(Medico.NOME));
                props.add(new Propriedade(Medico.EMAIL));
                props.add(new Propriedade(Medico.PONTUACAO));

                NxCriterion criterionMedico = NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, true, Filtro.NOT_EQUAL));
                NxCriterion criterionAuxMedico = NxCriterion.montaRestriction(new Filtro(Medico.EMAIL, vo.getEmail(), Filtro.EQUAL));
                criterionMedico = NxCriterion.and(criterionMedico, criterionAuxMedico);

                Medico medicoExisteEmail = (Medico) dao.selectUnique(props, Medico.class, criterionMedico);
                if (medicoExisteEmail != null && medicoExisteEmail.getId() != null) {
                    return Info.GetError("E-mail já cadastrado no PlantãoMais");
                } else {
                    props.add(new Propriedade(Medico.EMAIL_VALIDADO));
                    medico.setEmailValidado(true);

                    medico.setSenha(PASSWORD_ENCODER.encode(medico.getSenha()));
                    AuditoriaUtil.inclusao(medico, usuario);
                    if (medico.getStatus() == null) {
                        medico.setStatus(Constants.COMPLETO);
                        medico.setCadastroCompleto(true);
                    }
                    if (vo.getAddress() != null) {
                        dao.persistWithCurrentTransaction(medico.getAddress());
                    }
                    medico.setAtivo(true);
                    dao.persistWithCurrentTransaction(medico);
                    if (vo.getListaEspecialidadeSelecionado() != null && !vo.getListaEspecialidadeSelecionado().isEmpty()) {
                        for (EspecialidadeVo especialidadeVo : vo.getListaEspecialidadeSelecionado()) {
                            MedicoEspecialidade medicoEspecialidade = new MedicoEspecialidade();
                            medicoEspecialidade.setMedico(medico);
                            medicoEspecialidade.setEspecialidade(EspecialidadeMapper.convertToEntity(especialidadeVo));
                            dao.persistWithCurrentTransaction(medicoEspecialidade);
                        }
                    }
                    if (vo.getListTodosAnexosMedicoVo() != null && !vo.getListTodosAnexosMedicoVo().isEmpty()) {
                        for (TodosAnexosMedicoVo todosAnexosMedico : vo.getListTodosAnexosMedicoVo()) {
                            for (MedicoAnexoVo medicoAnexoVo1 : todosAnexosMedico.getListMedicoAnexo()) {
                                if (medicoAnexoVo1.getId() == null && todosAnexosMedico.getListMedicoAnexo().size() >= 2) {
                                    Comparator<MedicoAnexoVo> comparator = Comparator.comparing(MedicoAnexoVo::getDataUsuarioInc);
                                    Optional<MedicoAnexoVo> op = todosAnexosMedico.getListMedicoAnexo().stream().filter(obj -> obj.getDataUsuarioInc() != null).max(comparator);
                                    if (op.isPresent()) {
                                        MedicoAnexoVo anexoAtual = op.get();
                                        anexoAtual.setEhHistorico(true);
                                        anexoAtual.setUsuarioAlt(vo.getName());
                                        anexoAtual.setDataUsuarioAlt(new Date());
                                        anexoAtual.setDataUsuarioInc(new Date());
                                        anexoAtual.setUsuarioInc(vo.getNome());
                                        MedicoAnexo medicoAnexo = MedicoAnexoMapper.convertToEntity(anexoAtual);
                                        AuditoriaUtil.alteracao(medicoAnexo, usuario);
                                        List<Propriedade> propriedadesMedicoAnexo = new ArrayList<>();

                                        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.EH_HISTORICO));
                                        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.BASE64_ANEXO));
                                        propriedadesMedicoAnexo.addAll(AuditoriaUtil.getCamposAlteracao());
                                        dao.updateWithCurrentTransaction(medicoAnexo, propriedadesMedicoAnexo);
                                    }
                                }
                                if (medicoAnexoVo1.getId() == null) {
                                    MedicoAnexoVo medicoAnexoVo = new MedicoAnexoVo();
                                    medicoAnexoVo.setCampoAnexo(todosAnexosMedico.getCampoAnexo());
                                    medicoAnexoVo.setEhHistorico(false);
                                    medicoAnexoVo.setObservacaoValidacao(null);
                                    medicoAnexoVo.setValidado(true);
                                    medicoAnexoVo.setNomeAnexo(medicoAnexoVo1.getNomeAnexo());
                                    medicoAnexoVo.setExtra(medicoAnexoVo1.getExtra());
                                    medicoAnexoVo.setBase64Anexo(medicoAnexoVo1.getBase64Anexo());
                                    medicoAnexoVo.setTipoAnexo(medicoAnexoVo1.getTipoAnexo());

                                    if (medicoAnexoVo1.getEspecialidade() != null) {
                                        medicoAnexoVo.setEspecialidade(medicoAnexoVo1.getEspecialidade());
                                    }


                                    MedicoAnexo medicoAnexo = MedicoAnexoMapper.convertToEntity(medicoAnexoVo);
                                    medicoAnexo.setMedico(medico);
                                    medicoAnexo.setUsuarioAlt(vo.getNome());
                                    medicoAnexo.setDataUsuarioAlt(new Date());
                                    medicoAnexo.setDataUsuarioInc(new Date());
                                    medicoAnexo.setUsuarioInc(vo.getNome());
                                    AuditoriaUtil.inclusao(medicoAnexo, usuario);

                                    Attachment attachment = new Attachment();
                                    attachment.setContentType(medicoAnexo.getTipoAnexo());
                                    attachment.setFile(medicoAnexo.getBase64Anexo());
                                    attachment.setFileName(medicoAnexo.getNomeAnexo());
                                    attachment.setName(medicoAnexo.getNomeAnexo());
                                    attachment.setProcessed(false);
                                    attachment.setType(AttachmentType.DOCUMENT);

                                    Integer attachmentId = dao.persistWithCurrentTransaction(attachment);
                                    attachment.setId(attachmentId);
                                    attachmentIds.add(attachmentId);

                                    medicoAnexo.setAttachment(attachment);
                                    medicoAnexo.setBase64Anexo(null);

                                    dao.persistWithCurrentTransaction(medicoAnexo);

                                    if (medicoAnexoVo1.getMedicoCurso() != null) {
                                        courseToSave.add(Pair.of(medicoAnexoVo1.getMedicoCurso(), medicoAnexo));
                                    }
                                }
                            }
                        }
                    }
                    if (vo.getListaBloqueioMedicoEscala() != null && vo.getListaBloqueioMedicoEscala().size() > 0) {
                        for (BloqueioMedicoEscalaVo bloqueioMedicoEscalaVo : vo.getListaBloqueioMedicoEscala()) {
                            BloqueioMedicoEscala bloqueioMedicoEscala = new BloqueioMedicoEscala();
                            bloqueioMedicoEscala.setMedico(medico);
                            bloqueioMedicoEscala.setEscala(EscalaMapper.convertToEntity(bloqueioMedicoEscalaVo.getEscala()));
                            dao.persistWithCurrentTransaction(bloqueioMedicoEscala);
                        }
                    }

                    if (vo.getListaMedicoEspecialidade() != null && !vo.getListaMedicoEspecialidade().isEmpty()) {
                        for (MedicoEspecialidadeVo medicoEspecialidadeVo : vo.getListaMedicoEspecialidade()) {
                            if (medicoEspecialidadeVo.getId() == null) {
                                MedicoEspecialidade medicoEspecialidade = MedicoEspecialidadeMapper.convertToEntity(medicoEspecialidadeVo);
                                medicoEspecialidade.setMedico(medico);
                                dao.persistWithCurrentTransaction(medicoEspecialidade);
                            }
                        }
                    }

                    for (PaymentData paymentData : PaymentDataMapper.convertToListEntity(vo.getPaymentsData())) {
                        if (paymentData.getIsCompanyAccount() == null) {
                            paymentData.setIsCompanyAccount(false);
                        }
                        if (paymentData.getId() == null) {
                            Util.enviaEmail(getRecebimentoNovaModalidadeHtml(medico, paymentData), Constants.TIPO_NOTIFICACAO_NOVA_MODALIDADE);
                        }
                        paymentData.setMedico(medico);
                        if (paymentData.getPix() != null) {
                            var pix = pixController.save(paymentData.getPix(), dao);
                            paymentData.setPix(pix);
                        }
                        paymentDataController.save(paymentData, dao);
                    }

                    vo.setSenha(null);
                    info = Info.GetSuccess(Constants.MSG_MEDICO_SALVO_SUCESSO, vo);
                }
            }

            var cameToUs = CameToUsMapper.convertToEntity(vo.getCameToUs());
            // Remover verificação quando web e app implementarem
            if (cameToUs != null) {
                cameToUs.setMedico(medico);
                var existing = cameToUsController.findByMedic(medico);
                if (existing != null) {
                    cameToUs.setId(existing.getId());
                }
                vo.setCameToUs(CameToUsMapper.convertToVo(cameToUsController.save(cameToUs, dao)));
            }

            dao.commitCurrentTransaction();


            Util.notifyAdminERPMedicRegisterCompleted(medico);
            Util.notifyAdminMedicRegisterCompletedReceiveByAnotherModality(medico, PaymentDataMapper.convertToListEntity(vo.getPaymentsData()));

            // persist new medic course by web
            for (Pair<MedicoCursoVo, MedicoAnexo> pairs : courseToSave) {
                MedicoCurso medicoCurso = MedicoCursoMapper.convertToEntity(pairs.getLeft());
                MedicoAnexo medicoAnexo = pairs.getRight();

                medicoCurso.setMedico(medico);
                dao.persist(medicoCurso);

                medicoAnexo.setMedicoCurso(medicoCurso);
                dao.update(medicoAnexo);
            }

            if (containsExtraDocument && !sendPushMedicStatus) {
                if (invalidExtraDocumentFound) {
                    sendExtraDocumentNotification(
                            vo,
                            "Validação de documento adicional",
                            "Seus documentos adicionais foram invalidados. Verifique por gentileza.",
                            Constants.TIPO_PUSH_DOCUMENTO_ADICIONAL_INVALIDO);
                } else if (containsNewExtraDocument) {
                    sendExtraDocumentNotification(
                            vo,
                            "Novo documento adicional disponível",
                            "Verifique por gentileza.",
                            Constants.TIPO_PUSH_DOCUMENTO_ADICIONAL);
                }
            }

            new AttachmentController().uploadByAttachmentIds(attachmentIds);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);

            var errorMessage = Constants.MSG_MEDICO_SALVO_ERRO;

            if (e instanceof AuthenticationException) {
                errorMessage = e.getMessage();
            }

            info = Info.GetError(errorMessage);
            dao.rollbackCurrentTransaction();
        }
        return info;
    }

    private void sendMedicStatusNotification(MedicoVo medico, String title, String message, String type) {
        try {
            PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                    .setTitle(title)
                    .setBody(message)
                    .setType(type)
                    .buildDefault();

            NotificationVo notification = new NotificationVo.Builder()
                    .setDate(new Date())
                    .setStatus(NotificationStatus.PENDING)
                    .setType(type)
                    .setMessage(message)
                    .setMedico(medico)
                    .create();

            pushNotificationController.sendNotification(pushNotification, notification);

        } catch (Exception e) {
            logger.log(Level.SEVERE, "Erro ao enviar push notification");
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
    }

    private void sendExtraDocumentNotification(MedicoVo medic, String title, String message, String type) {
        PushNotificationVo pushNotificationVo = new PushNotificationVo.Builder()
                .setTitle(title)
                .setBody(message)
                .setType(type)
                .buildDefault();

        NotificationVo notification = new NotificationVo.Builder()
                .setDate(new Date())
                .setStatus(NotificationStatus.PENDING)
                .setType(type)
                .setMessage(message)
                .setMedico(medic)
                .create();

        try {
            pushNotificationController.sendNotification(pushNotificationVo, notification);
        } catch (Exception ex) {
            logger.log(Level.SEVERE, "Erro ao enviar push notification");
            logger.log(Level.SEVERE, ex.getMessage(), ex);
        }
    }

    private boolean isExtraDocument(MedicoAnexo medicoAnexo) {
        return medicoAnexo.getCampoAnexo().getId().equals(CampoAnexo.Campos.DOCUMENTOS_ADICIONAIS.getId());
    }

    /**
     * Extra doc requires a specific permission
     *
     * @param attachmentId
     */
    private void checkExtraDocumentPermission(Integer attachmentId) throws AuthenticationException {
        if (attachmentId == 15) {
            UserPermissionController controller = new UserPermissionController(UsuarioMapper.convertToVo(super.usuario));
            if (!controller.userContainPermission(TipoPermissao.Tipos.CriarAlterarExcluirDocumentosAdicionais)) {
                throw new AuthenticationException("Usuário não tem permissão pra salvar/alterar Documentos Adicionais");
            }
        }
    }

    /**
     * @param medico
     * @return retorna template html para email
     */
    private String getCadastroValidadoHtml(Medico medico) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá Dr(a). " + medico.getNome() + ",</p>";
        html += "<p>O seu cadastro foi validado e agora você já pode se candidatar aos nossos plantões.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * @param medico
     * @return retorna template html para email
     */
    private String getCadastroInvalidoHtml(Medico medico) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá Dr(a). " + medico.getNome() + ",</p>";
        html += "<p>Foram encontradas Inconsistências em seu cadastro. Por favor, acesse a tela 'Meu Perfil' no menu lateral do aplicativo e confira nossas observações.</p>";
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

    public Info salvarCadastroCompleto(MedicoVo vo) {
        Info info;
        GenericDao dao = new GenericDao<>();

        List<Integer> attachmentIds = new ArrayList<>();

        try {
            Info infoMedico = this.getMedicoById(vo);
            dao.beginTransaction();
            MedicoVo medicoVo = (MedicoVo) infoMedico.getObjeto();
            Medico medico = MedicoMapper.convertToEntity(medicoVo);
            Address address = AddressMapper.convertToEntity(vo.getAddress());

            List<Propriedade> propriedades = new ArrayList<>();

            propriedades.add(new Propriedade(Medico.ADDRESS));
            propriedades.add(new Propriedade(Medico.BIRTH_DATE));
            propriedades.add(new Propriedade(Medico.CRM_ISSUE_DATE));
            propriedades.add(new Propriedade(Medico.CRM_ADICIONAL_ISSUE_DATE));

            medico.setAddress(address);
            dao.persistWithCurrentTransaction(address);

            medico.setBirthDate(vo.getBirthDate());
            medico.setCrmIssueDate(vo.getCrmIssueDate());
            medico.setCrmAdicionalIssueDate(vo.getCrmAdicionalIssueDate());
            medico.setSexo(vo.getSexo());

            if (vo.getPreferencesMedic() != null) {
                medicoVo.setPreferencesMedic(vo.getPreferencesMedic());
                preferencesMedicController.saveByMedicVo(medicoVo, dao);
            }

            for (MedicoAnexo medicoAnexo : MedicoAnexoMapper.convertToListEntity(vo.getListaMedicoAnexo())) {
                if (medicoAnexo.getId() == null) {
                    AuditoriaUtil.inclusao(medicoAnexo, this.usuario);
                    medicoAnexo.setDataUsuarioInc(new Date());
                    medicoAnexo.setDataUsuarioAlt(new Date());
                    medicoAnexo.setMedico(medico);

                    Attachment attachment = new Attachment();
                    attachment.setContentType(medicoAnexo.getTipoAnexo());
                    attachment.setFile(medicoAnexo.getBase64Anexo());
                    attachment.setFileName(medicoAnexo.getNomeAnexo());
                    attachment.setName(medicoAnexo.getNomeAnexo());
                    attachment.setProcessed(false);
                    attachment.setType(AttachmentType.DOCUMENT);

                    Integer attachmentId = dao.persistWithCurrentTransaction(attachment);
                    attachment.setId(attachmentId);
                    attachmentIds.add(attachmentId);

                    medicoAnexo.setAttachment(attachment);
                    medicoAnexo.setBase64Anexo(null);

                    dao.persistWithCurrentTransaction(medicoAnexo);
                }
            }

            if (vo.getListaEspecialidadeSelecionado() != null && !vo.getListaEspecialidadeSelecionado().isEmpty()) {
                for (EspecialidadeVo especialidadeVo : vo.getListaEspecialidadeSelecionado()) {
                    if (especialidadeVo.getId() != null) {
                        MedicoEspecialidade medicoEspecialidade = new MedicoEspecialidade();
                        medicoEspecialidade.setMedico(medico);
                        medicoEspecialidade.setEspecialidade(EspecialidadeMapper.convertToEntity(especialidadeVo));

                        dao.persistWithCurrentTransaction(medicoEspecialidade);
                    }
                }
            }

            var tipoRecebimentoOutraModalidade = false;
            for (PaymentData paymentData : PaymentDataMapper.convertToListEntity(vo.getPaymentsData())) {
                if (paymentData.getIsCompanyAccount() == null) {
                    paymentData.setIsCompanyAccount(false);
                }
                if (paymentData.getId() == null) {
                    Util.enviaEmail(getRecebimentoNovaModalidadeHtml(medico, paymentData), Constants.TIPO_NOTIFICACAO_NOVA_MODALIDADE);
                }
                paymentData.setMedico(medico);
                if (paymentData.getPix() != null) {
                    var pix = pixController.save(paymentData.getPix(), dao);
                    paymentData.setPix(pix);
                }
                paymentDataController.save(paymentData, dao);
                switch (paymentData.getPaymentType()) {
                    case PF:
                        Util.enviaEmail(getRecebimentoPessoaFisicaHtml(medico), Constants.TIPO_NOTIFICACAO_CADASTRO_COMPLETO);
                        break;
                    case PJ:
                        Util.enviaEmail(getEhContaEmpresaHtml(medico), Constants.TIPO_NOTIFICACAO_CADASTRO_COMPLETO);
                        break;
                    case SO:
                        Util.enviaEmail(getRecebimentoPorOutraModalidadeHtml(medico), Constants.TIPO_NOTIFICACAO_CADASTRO_COMPLETO);
                        tipoRecebimentoOutraModalidade = true;
                }
            }
            List<PaymentData> oldPaymentsData = PaymentDataMapper.convertToListEntity(medicoVo.getPaymentsData());
            List<PaymentData> newPaymentsData = PaymentDataMapper.convertToListEntity(vo.getPaymentsData());
            for (PaymentData paymentData : oldPaymentsData.stream().filter(it -> newPaymentsData.stream().noneMatch(et -> it.getId().equals(et.getId()))).collect(Collectors.toList())) {
                if (paymentData.getPix() != null) {
                    pixController.delete(paymentData.getPix(), dao);
                }
                paymentDataController.delete(paymentData, dao);
            }

            var cameToUs = CameToUsMapper.convertToEntity(vo.getCameToUs());
            // Remover verificação quando web e app implementarem
            if (cameToUs != null) {
                cameToUs.setMedico(medico);
                var existing = cameToUsController.findByMedic(medico);
                if (existing != null) {
                    cameToUs.setId(existing.getId());
                }
                vo.setCameToUs(CameToUsMapper.convertToVo(cameToUsController.save(cameToUs, dao)));
            }

            if (vo.getAtivo() != null) {
                propriedades.add(new Propriedade(Medico.ATIVO));
                medico.setAtivo(vo.getAtivo());
            }
            medico.setSexo(vo.getSexo());
            medico.setCadastroCompleto(true);
            medico.setStatus(Constants.EM_ANALISE);
            propriedades.add(new Propriedade(Medico.CADASTRO_COMPLETO));
            propriedades.add(new Propriedade(Medico.STATUS));
            propriedades.add(new Propriedade(Medico.SEXO));
            dao.updateWithCurrentTransaction(medico, propriedades);
            dao.commitCurrentTransaction();
            info = Info.GetSuccess("Cadastro salvo com sucesso");
            if (tipoRecebimentoOutraModalidade) {
                Util.notifyAdminMedicRegisterCompletedReceiveByAnotherModality(medico, PaymentDataMapper.convertToListEntity(vo.getPaymentsData()));
            }
            new AttachmentController().uploadByAttachmentIds(attachmentIds);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao salvar Medico.");
            dao.rollbackCurrentTransaction();
        }

        return info;
    }

    /**
     * @param medico
     * @return retorna template html para email
     */
    private String getRecebimentoPessoaFisicaHtml(Medico medico) {
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá, </p>";
        html += "<p>O médico " + medico.getNome() + " realizou o cadastro completo no aplicativo e informou recebimento por pessoa física.</p>";
        html += "<p>Confira na tela de médicos no sistema.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * @param medico
     * @return retorna template html para email
     */
    private String getRecebimentoPorOutraModalidadeHtml(Medico medico) {
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá, </p>";
        html += "<p>O médico " + medico.getNome() + " realizou o cadastro completo no aplicativo e informou recebimento por outra modalidade.</p>";
        html += "<p>Telefone: " + medico.getTelefone() + ".</p>";
        html += "<p>E-mail: " + medico.getEmail() + ".</p>";
        html += "<p>Confira na tela de médicos no sistema.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * @param medico
     * @return retorna template html para email
     */
    private String getRecebimentoPorOutraModalidadeERPHtml(Medico medico) {

        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>O Dr(a). " + medico.getNome() + " está com cadastro completo e selecionou o recebimento como outra modalidade</p>";
        html += "<p>Link: <a href='" + Constants.URL_SYSTEM + "admin/cadastro-usuario-app/" + medico.getId() + "'>" + Constants.URL_SYSTEM + "admin/cadastro-usuario-app/" + medico.getId() + "</a></p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * @param medico
     * @return retorna template html para email
     */
    private String getEhContaEmpresaHtml(Medico medico) {
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá, </p>";
        html += "<p>O médico " + medico.getNome() + " realizou o cadastro completo no aplicativo e informou uma conta PJ para recebimento.</p>";
        if (medico.getEhContaEmpresa() != null && medico.getEhContaEmpresa()) {
            html += "<p>A conta informada foi indicada como conta da empresa.</p>";
        }
        html += "<p>Confira na tela de médicos no sistema.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    private String getRecebimentoNovaModalidadeHtml(Medico medico, PaymentData paymentData) {
        String tipoRecebimento = "";
        switch (paymentData.getPaymentType()) {
            case PF:
                tipoRecebimento = "por pessoa física";
                break;
            case PJ:
                tipoRecebimento = "por pessoa jurídica";
                break;
            case SO:
                tipoRecebimento = "por outra modalidade";
        }
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá, </p>";
        html += "<p>Foi criado um novo tipo de recebimento " + tipoRecebimento + " para o médico " + medico.getNome() + " </p>";
        if (paymentData.getIsCompanyAccount() != null && paymentData.getIsCompanyAccount()) {
            html += "<p>A conta informada foi indicada como conta da empresa.</p>";
        }
        html += "<p>Confira na tela de médicos no sistema.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    public List<MedicoEspecialidadeVo> listarMedicoEspecialidade(FiltroMedico filtro) {
        Info info = null;
        List<MedicoEspecialidadeVo> listaVo = new ArrayList<>();
        try {
            GenericDao<MedicoEspecialidade> dao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(MedicoEspecialidade.ID));

            String aliasMedico = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.CADASTRO_COMPLETO, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.STATUS, Medico.class, aliasMedico));

            String aliasEspecialidade = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.ESPECIALIDADE);
            propriedades.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
            propriedades.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));

            NxCriterion nxCriterionEspecialidade = NxCriterion.montaRestriction(new Filtro(Medico.ID, filtro.getId(), Filtro.EQUAL, aliasMedico));

            List<MedicoEspecialidade> listaEspecialidade = dao.listarByFilter(propriedades, null, MedicoEspecialidade.class, Constants.NO_LIMIT, nxCriterionEspecialidade);
            listaVo = MedicoEspecialidadeMapper.convertToListVo(listaEspecialidade);


            for (MedicoEspecialidadeVo vo : listaVo) {
                vo.setAnexos(medicAttachmentController.findSimpleVOForCurrentMedic(null, null, vo.getEspecialidade().getId(), null));
            }


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listaVo;
    }

    /**
     * Retorno de Usuarios App com todas as propriendades carregadas
     *
     * @param vo UsuarioVo
     * @return
     */

    public Info getMedicoById(MedicoVo vo) {
        Info info;
        List<MedicoEspecialidadeVo> listMedicoEspecialidade;
        List<CampoAnexoVo> listCampoAnexoVo;
        List<BloqueioMedicoEscalaVo> listaBloqueioMedicoEscala;
//        List<AnexoCampoCadastroMedicoVo> listAnexoCampoCadrastroMedico = new ArrayList<>();
        List<TodosAnexosMedicoVo> listTodosAnexosMedicoVo = new ArrayList<>();
        List<PaymentDataVo> paymentsData = new ArrayList<>();

        GenericDao dao = new GenericDao();
        try {
            if (vo != null && vo.getId() != null) {
                dao.beginTransaction();

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Medico.ID));
                propriedades.add(new Propriedade(Medico.NOME));
                propriedades.add(new Propriedade(Medico.EMAIL));
                propriedades.add(new Propriedade(Medico.EXCLUIDO));
                propriedades.add(new Propriedade(Medico.TELEFONE));
                propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO));
                propriedades.add(new Propriedade(Medico.SEXO));
                propriedades.add(new Propriedade(Medico.NUMERO_CRM));
                propriedades.add(new Propriedade(Medico.STATUS));

                propriedades.add(new Propriedade(Medico.NOME_ANEXO_FOTO));

                propriedades.add(new Propriedade(Medico.VALIDADO));
                propriedades.add(new Propriedade(Medico.OBSERVACOES_VALIDACAO));

                propriedades.add(new Propriedade(Medico.BANCO));
                propriedades.add(new Propriedade(Medico.AGENCIA));
                propriedades.add(new Propriedade(Medico.OPERACAO));
                propriedades.add(new Propriedade(Medico.CONTA));
                propriedades.add(new Propriedade(Medico.CPF));
                propriedades.add(new Propriedade(Medico.CNPJ));
                propriedades.add(new Propriedade(Medico.NOME_TITULAR));
                propriedades.add(new Propriedade(Medico.NUMERO_PIS));
                propriedades.add(new Propriedade(Medico.EH_CONTA_EMPRESA));
                propriedades.add(new Propriedade(Medico.TIPO_RECEBIMENTO));
                propriedades.add(new Propriedade(Medico.ATIVO));
                propriedades.add(new Propriedade(Medico.ADDRESS));
                propriedades.add(new Propriedade(Medico.BIRTH_DATE));
                propriedades.add(new Propriedade(Medico.CRM_ISSUE_DATE));
                propriedades.add(new Propriedade(Medico.PONTUACAO));
                propriedades.add(new Propriedade(Medico.NUMERO_CRM_ADICIONAL));
                propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO_ADICIONAL));
                propriedades.add(new Propriedade(Medico.CRM_ADICIONAL_ISSUE_DATE));
                propriedades.add(new Propriedade(Medico.ATTACHMENT));

                NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, true, Filtro.NOT_EQUAL));
                NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Usuario.ID, vo.getId(), Filtro.EQUAL));
                criterion = NxCriterion.and(criterion, criterionAux);

                Medico usuario = (Medico) dao.selectUnique(propriedades, Medico.class, criterion);

                //listar os UsuarioEspecialidade dos usuariosApp id
                List<Propriedade> propriedadesUsuarioEspecialidade = new ArrayList<>();
                propriedadesUsuarioEspecialidade.add(new Propriedade(MedicoEspecialidade.ID));

                String aliasMedico = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.MEDICO);
                propriedadesUsuarioEspecialidade.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

                String aliasEspecialidade = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.ESPECIALIDADE);
                propriedadesUsuarioEspecialidade.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
                propriedadesUsuarioEspecialidade.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));


                NxCriterion nxCriterionUsuario = NxCriterion.montaRestriction(new Filtro(Medico.ID, vo.getId(), Filtro.EQUAL, aliasMedico));

                listMedicoEspecialidade = dao.listarByFilter(propriedadesUsuarioEspecialidade, null, MedicoEspecialidade.class, Constants.NO_LIMIT, nxCriterionUsuario);


                vo = MedicoMapper.convertToVo(usuario);

                // Listar paymentsData
                paymentsData = paymentDataController.findByMedic(usuario);
                vo.setPaymentsData(paymentsData);

                vo.setCameToUs(cameToUsController.findByMedic(usuario));

                //listar os CamposAnexos
                List<Propriedade> propriedadesCampoAnexo = new ArrayList<>();
                propriedadesCampoAnexo.add(new Propriedade(CampoAnexo.ID));
                propriedadesCampoAnexo.add(new Propriedade(CampoAnexo.DESCRICAO));
                propriedadesCampoAnexo.add(new Propriedade(CampoAnexo.ORDEM));

                List<CampoAnexo> listCampoAnexo = dao.listarByFilter(propriedadesCampoAnexo, null, CampoAnexo.class, Constants.NO_LIMIT, null);
                listCampoAnexoVo = CampoAnexoMapper.convertToListVo(listCampoAnexo);

                Comparator<CampoAnexoVo> ordem = Comparator.comparingInt(CampoAnexoVo::getOrdem);
                listCampoAnexoVo = listCampoAnexoVo.stream().sorted(ordem).collect(Collectors.toList());

                for (CampoAnexoVo campoAnexo : listCampoAnexoVo) {
                    //listar os ANEXOS do medico
                    List<MedicoAnexoVo> listaMedicoAnexoVo = listarMedicoAnexoPorMedicoCampoAnexo(vo.getId(), campoAnexo.getId(), true);

                    if (listaMedicoAnexoVo.size() == 0) {
                        TodosAnexosMedicoVo todosAnexosMedicoVo = new TodosAnexosMedicoVo();
                        todosAnexosMedicoVo.setCampoAnexo(campoAnexo);
                        todosAnexosMedicoVo.setListMedicoAnexo(new ArrayList<>());
                        listTodosAnexosMedicoVo.add(todosAnexosMedicoVo);
                    }
                    for (MedicoAnexoVo medicoAnexoVo : listaMedicoAnexoVo) {

                        TodosAnexosMedicoVo todosAnexosMedicoVo = listTodosAnexosMedicoVo.stream().filter(o -> o.getCampoAnexo().equals(medicoAnexoVo.getCampoAnexo())).findAny().orElse(null);

                        if (todosAnexosMedicoVo != null) {
                            todosAnexosMedicoVo.getListMedicoAnexo().add(medicoAnexoVo);

                        } else {
                            todosAnexosMedicoVo = new TodosAnexosMedicoVo();
                            todosAnexosMedicoVo.setCampoAnexo(medicoAnexoVo.getCampoAnexo());
                            todosAnexosMedicoVo.setListMedicoAnexo(new ArrayList<>());
                            todosAnexosMedicoVo.getListMedicoAnexo().add(medicoAnexoVo);
                            listTodosAnexosMedicoVo.add(todosAnexosMedicoVo);
                        }
                    }
                }

                //listar as Escalas bloqueadas
                List<Propriedade> propriedadesBloqueioMedicoEscala = new ArrayList<>();
                propriedadesBloqueioMedicoEscala.add(new Propriedade(BloqueioMedicoEscala.ID));

                String aliasMedicoB = NxCriterion.montaAlias(BloqueioMedicoEscala.ALIAS_CLASSE, BloqueioMedicoEscala.MEDICO);
                propriedadesBloqueioMedicoEscala.add(new Propriedade(Medico.ID, Medico.class, aliasMedicoB));

                String aliasEscala = NxCriterion.montaAlias(BloqueioMedicoEscala.ALIAS_CLASSE, BloqueioMedicoEscala.ESCALA);
                propriedadesBloqueioMedicoEscala.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
                propriedadesBloqueioMedicoEscala.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));

                NxCriterion nxCriterionBloqueia = NxCriterion.montaRestriction(new Filtro(Medico.ID, vo.getId(), Filtro.EQUAL, aliasMedico));

                listaBloqueioMedicoEscala = dao.listarByFilter(propriedadesBloqueioMedicoEscala, null, BloqueioMedicoEscala.class, Constants.NO_LIMIT, nxCriterionBloqueia);

                vo.setListaBloqueioMedicoEscala(listaBloqueioMedicoEscala);
                vo.setListTodosAnexosMedicoVo(listTodosAnexosMedicoVo);
//                vo.setListAnexoCampoCadrastroMedico(listAnexoCampoCadrastroMedico);
                vo.setListaMedicoEspecialidade(listMedicoEspecialidade);

                List<MedicoCursoVo> listaMedicoCurso = this.listarMedicoCursos(usuario);
                vo.setListaMedicoCurso(listaMedicoCurso);

                PreferencesMedicVo preferencesMedic = preferencesMedicController.findByMedic(usuario);
                vo.setPreferencesMedic(preferencesMedic);

                dao.commitCurrentTransaction();

                info = Info.GetSuccess(vo);
            } else {
                info = Info.GetError("Usuário não encontrado.");
                dao.rollbackCurrentTransaction();
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao buscar Usuário.");
        }
        return info;
    }

    private List<MedicoCursoVo> listarMedicoCursos(Medico medico) throws Exception {

        if (medico == null || medico.getId() == null) return null;

        GenericDao<MedicoCurso> dao = new GenericDao<>();

        List<Propriedade> props = new ArrayList<>();
        props.add(new Propriedade(MedicoCurso.ID));
        props.add(new Propriedade(MedicoCurso.CURSO));
        props.add(new Propriedade(MedicoCurso.DATA_VENCIMENTO));
        props.add(new Propriedade(MedicoCurso.MEDICO));

        String aliasMedico = NxCriterion.montaAlias(MedicoCurso.ALIAS_CLASSE, MedicoCurso.MEDICO);
        props.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medico.getId(), Filtro.EQUAL, aliasMedico));

        List<MedicoCurso> medicoCurso = dao.listarByFilter(props, null, MedicoCurso.class, Constants.NO_LIMIT, nxCriterion);

        List<MedicoCursoVo> medicoCursoVos = MedicoCursoMapper.convertToListVo(medicoCurso);
        medicoCursoVos.forEach(m -> m.setMedico(null));

        return medicoCursoVos;
    }

    public Info getMedicoByIdVisualizar(MedicoVo vo) {
        Info info;
        List<EspecialidadeVo> listEspecialidade;
        List<AnexoCampoCadastroMedicoVo> listAnexoCampoCadrastroMedico = new ArrayList<>();
        List<CampoAnexoVo> listCampoAnexoVo;
        List<TodosAnexosMedicoVo> listTodosAnexosMedicoVo = new ArrayList<>();
        List<PaymentDataVo> paymentsData = new ArrayList<>();
        GenericDao dao = new GenericDao();
        try {
            if (vo != null && vo.getId() != null) {
                dao.beginTransaction();

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Medico.ID));
                propriedades.add(new Propriedade(Medico.NOME));
                propriedades.add(new Propriedade(Medico.EMAIL));
                propriedades.add(new Propriedade(Medico.EXCLUIDO));
                propriedades.add(new Propriedade(Medico.TELEFONE));
                propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO));
                propriedades.add(new Propriedade(Medico.SEXO));
                propriedades.add(new Propriedade(Medico.TIPO_RECEBIMENTO));

                //Anexos
                propriedades.add(new Propriedade(Medico.ANEXO_FOTO));
                propriedades.add(new Propriedade(Medico.NOME_ANEXO_FOTO));
                propriedades.add(new Propriedade(Medico.TIPO_ANEXO_FOTO));
                propriedades.add(new Propriedade(Medico.VALIDADO));
                propriedades.add(new Propriedade(Medico.ATTACHMENT));
                propriedades.add(new Propriedade(Medico.OBSERVACOES_VALIDACAO));
                propriedades.add(new Propriedade(Medico.ATIVO));

                NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, true, Filtro.NOT_EQUAL));
                NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Usuario.ID, vo.getId(), Filtro.EQUAL));
                criterion = NxCriterion.and(criterion, criterionAux);

                Medico usuario = (Medico) dao.selectUnique(propriedades, Medico.class, criterion);

                //listar os UsuarioEspecialidade dos usuariosApp id
                List<Propriedade> propriedadesUsuarioEspecialidade = new ArrayList<>();
                propriedadesUsuarioEspecialidade.add(new Propriedade(MedicoEspecialidade.ID));

                String aliasMedico = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.MEDICO);
                propriedadesUsuarioEspecialidade.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

                String aliasEspecialidade = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.ESPECIALIDADE);
                propriedadesUsuarioEspecialidade.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
                propriedadesUsuarioEspecialidade.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));


                NxCriterion nxCriterionUsuario = NxCriterion.montaRestriction(new Filtro(Medico.ID, vo.getId(), Filtro.EQUAL, aliasMedico));

                listEspecialidade = dao.listarByFilter(propriedadesUsuarioEspecialidade, null, MedicoEspecialidade.class, Constants.NO_LIMIT, nxCriterionUsuario);


                vo = MedicoMapper.convertToVo(usuario);

                //listar os CamposAnexos
                List<Propriedade> propriedadesCampoAnexo = new ArrayList<>();
                propriedadesCampoAnexo.add(new Propriedade(CampoAnexo.ID));
                propriedadesCampoAnexo.add(new Propriedade(CampoAnexo.DESCRICAO));

                List<CampoAnexo> listCampoAnexo = dao.listarByFilter(propriedadesCampoAnexo, null, CampoAnexo.class, Constants.NO_LIMIT, null);
                listCampoAnexoVo = CampoAnexoMapper.convertToListVo(listCampoAnexo);


                for (CampoAnexoVo campoAnexo : listCampoAnexoVo) {
                    //listar os ANEXOS do medico
//
                    List<MedicoAnexoVo> listaMedicoAnexoVo = medicAttachmentController.find(vo.getId(), null, null, null, MedicoAnexo.DATA_USUARIO_INC);

                    if (listaMedicoAnexoVo.size() == 0) {
                        TodosAnexosMedicoVo todosAnexosMedicoVo = new TodosAnexosMedicoVo();
                        todosAnexosMedicoVo.setCampoAnexo(campoAnexo);
                        todosAnexosMedicoVo.setListMedicoAnexo(new ArrayList<>());
                        listTodosAnexosMedicoVo.add(todosAnexosMedicoVo);
                    }
                    for (MedicoAnexoVo medicoAnexoVo : listaMedicoAnexoVo) {

                        TodosAnexosMedicoVo todosAnexosMedicoVo = listTodosAnexosMedicoVo.stream().filter(o -> o.getCampoAnexo().equals(medicoAnexoVo.getCampoAnexo())).findAny().orElse(null);

                        if (todosAnexosMedicoVo != null) {
                            todosAnexosMedicoVo.getListMedicoAnexo().add(medicoAnexoVo);

                        } else {
                            todosAnexosMedicoVo = new TodosAnexosMedicoVo();
                            todosAnexosMedicoVo.setCampoAnexo(medicoAnexoVo.getCampoAnexo());
                            todosAnexosMedicoVo.setListMedicoAnexo(new ArrayList<>());
                            todosAnexosMedicoVo.getListMedicoAnexo().add(medicoAnexoVo);
                            listTodosAnexosMedicoVo.add(todosAnexosMedicoVo);
                        }
                    }
                }

                // Listar paymentsData
                paymentsData = paymentDataController.findByMedic(usuario);
                vo.setPaymentsData(paymentsData);

                vo.setListTodosAnexosMedicoVo(listTodosAnexosMedicoVo);

                vo.setListaEspecialidadeSelecionado(listEspecialidade);

                dao.commitCurrentTransaction();
                info = Info.GetSuccess(vo);
            } else {
                info = Info.GetError("Usuário não encontrado.");
                dao.rollbackCurrentTransaction();
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao buscar Usuário.");
        }
        return info;
    }

    public Info excluir(MedicoVo vo) {
        Info info;
        try {
            GenericDao dao = new GenericDao();
            Medico medico = MedicoMapper.convertToEntity(vo);
            if (medico.getId() > 0) {
                AuditoriaUtil.exclusao(medico, null);
                medico.setTokenPushNotification(null);

                List<Propriedade> propriedades = AuditoriaUtil.getCamposExclusao();
                propriedades.add(new Propriedade(Medico.TOKEN_PUSH_NOTIFICATION));
                dao.update(medico, propriedades);
                info = Info.GetSuccess("Médico excluído com sucesso.", MedicoMapper.convertToVo(medico));
            } else {
                info = Info.GetError("Não foi possivel excluir o médico.");
            }

            // Verifica os plantões do médico exluído para que seja feito o set de null

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.DISPONIVEL));
            propriedades.add(new Propriedade(Plantao.STATUS));

            String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medico.getId(), Filtro.EQUAL, aliasMedico));

            List<Plantao> listaPlantoes = (List<Plantao>) dao.listarByFilter(propriedades, null, Plantao.class, -1, nxCriterion);

            if (!Util.isNullOrEmpty(listaPlantoes)) {
                propriedades.clear();
                propriedades.add(new Propriedade(Plantao.ID));
                propriedades.add(new Propriedade(Plantao.MEDICO));
                propriedades.add(new Propriedade(Plantao.STATUS));
                propriedades.add(new Propriedade(Plantao.DISPONIVEL));


                for (Plantao plantao : listaPlantoes) {
                    plantao.setMedico(null);
                    plantao.setStatus(null);
                    plantao.setDisponivel(true);

                    dao.update(plantao, propriedades);
                }
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao excluir o médico.");
        }
        return info;
    }

    // lista combo de usuariosApp(medicos)
    public List<MedicoVo> listarComboMedico() {
        List<MedicoVo> listVo = new ArrayList<>();
        try {
            GenericDao<Medico> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.NOME));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Medico.NOME, NxOrder.NX_ORDER.ASC));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL));

            List<Medico> lista = dao.listarByFilter(propriedades, nxOrders, Medico.class, -1, nxCriterion);

            listVo = MedicoMapper.convertToListVo(lista);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listVo;
    }


    public Info validar(MedicoVo vo) {
        Info info;
        GenericDao dao = new GenericDao<>();
        List<Integer> attachmentIds = new ArrayList<>();
        try {
            List<Propriedade> propriedades;

            Medico medico = MedicoMapper.convertToEntity(vo);

            if (medico.getId() != null && medico.getId() > 0) {
                dao.beginTransaction();
                propriedades = new ArrayList<>();

                propriedades.add(new Propriedade(Medico.ID));
                propriedades.add(new Propriedade(Medico.VALIDADO));
                propriedades.add(new Propriedade(Medico.OBSERVACOES_VALIDACAO));
                propriedades.add(new Propriedade(Medico.CADASTRO_COMPLETO));
                Boolean validoCadastroCompleto = true;
                for (TodosAnexosMedicoVo todosAnexosMedico : vo.getListTodosAnexosMedicoVo()) {

                    if ((todosAnexosMedico.getCampoAnexo().getId() == 11 || todosAnexosMedico.getCampoAnexo().getId() == 12 || todosAnexosMedico.getCampoAnexo().getId() == 13) && (vo.getPaymentsData() == null || vo.getPaymentsData().size() == 0 || vo.getPaymentsData().stream().noneMatch(it -> it.getType().equals(PaymentType.PJ)))) {
                        continue;
                    }
                    if (todosAnexosMedico.getCampoAnexo().getId() != 2 && todosAnexosMedico.getCampoAnexo().getId() != 7 && todosAnexosMedico.getCampoAnexo().getId() != 8 && todosAnexosMedico.getCampoAnexo().getId() != 9 && todosAnexosMedico.getCampoAnexo().getId() != 10) {
                        if (todosAnexosMedico.getListMedicoAnexo().size() <= 0) {
                            validoCadastroCompleto = false;
                        }
                    }

                    for (MedicoAnexoVo medicoAnexoVo : todosAnexosMedico.getListMedicoAnexo()) {
                        if (medicoAnexoVo.getValidado() == null) {
                            medicoAnexoVo.setValidado(false);
                        }
                        if (medicoAnexoVo.getValidado() != null && !medicoAnexoVo.getValidado()) {
                            validoCadastroCompleto = false;
                        }
                        List<Propriedade> propriedadesMedicoAnexos = new ArrayList<>();

                        propriedadesMedicoAnexos.add(new Propriedade(MedicoAnexo.ID));
                        propriedadesMedicoAnexos.add(new Propriedade(MedicoAnexo.VALIDADO));
                        propriedadesMedicoAnexos.add(new Propriedade(MedicoAnexo.OBSERVACAO_VALIDACAO));
                        MedicoAnexoVo medicoAnexoUpdate = new MedicoAnexoVo();
                        medicoAnexoUpdate.setCampoAnexo(medicoAnexoVo.getCampoAnexo());
                        medicoAnexoUpdate.setNomeAnexo(medicoAnexoVo.getNomeAnexo());
                        medicoAnexoUpdate.setBase64Anexo(medicoAnexoVo.getBase64Anexo());
                        medicoAnexoUpdate.setTipoAnexo(medicoAnexoVo.getTipoAnexo());
                        medicoAnexoUpdate.setMedico(vo);
                        medicoAnexoUpdate.setValidado(medicoAnexoVo.getValidado());
                        medicoAnexoUpdate.setObservacaoValidacao(medicoAnexoVo.getObservacaoValidacao());
                        medicoAnexoUpdate.setId(medicoAnexoVo.getId());
                        MedicoAnexo medicoAnexo = MedicoAnexoMapper.convertToEntity(medicoAnexoVo);
                        medicoAnexo.setUsuarioInc(vo.getNome());
                        medicoAnexo.setUsuarioAlt(vo.getNome());
                        medicoAnexo.setDataUsuarioAlt(new Date());
                        medicoAnexo.setDataUsuarioInc(new Date());

                        Attachment attachment = new Attachment();
                        attachment.setContentType(medicoAnexo.getTipoAnexo());
                        attachment.setFile(medicoAnexo.getBase64Anexo());
                        attachment.setFileName(medicoAnexo.getNomeAnexo());
                        attachment.setName(medicoAnexo.getNomeAnexo());
                        attachment.setProcessed(false);
                        attachment.setType(AttachmentType.DOCUMENT);

                        Integer attachmentId = dao.persistWithCurrentTransaction(attachment);
                        attachment.setId(attachmentId);
                        attachmentIds.add(attachmentId);

                        medicoAnexo.setAttachment(attachment);
                        medicoAnexo.setBase64Anexo(null);

                        dao.updateWithCurrentTransaction(medicoAnexo, propriedadesMedicoAnexos);

                    }


                }
                if (validoCadastroCompleto) {
                    medico.setCadastroCompleto(true);
                } else {
                    medico.setCadastroCompleto(false);
                }
                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                AuditoriaUtil.alteracao(medico);
                dao.updateWithCurrentTransaction(medico, propriedades);
            } else {
                AuditoriaUtil.inclusao(medico, null);
                dao.persist(medico);
            }
            vo.setId(medico.getId());
            dao.commitCurrentTransaction();
            if (medico.getValidado() != null) {
                if (medico.getValidado()) {
                    info = Info.GetSuccess("Medico Validado com sucesso.");
                } else {
                    info = Info.GetSuccess("Medico Invalidado com sucesso.");
                }
            } else {
                info = Info.GetSuccess(Constants.SUCESSO);

            }
            new AttachmentController().uploadByAttachmentIds(attachmentIds);

        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao validar o Medico.");
        }
        return info;
    }


    public Info excluirMedicoEspecialidade(MedicoEspecialidadeVo vo) {
        Info info = null;
        try {
            GenericDao<MedicoEspecialidade> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(MedicoEspecialidade.ID));

            String aliasMedico = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.EMAIL, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.EXCLUIDO, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.TELEFONE, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.SEXO, Medico.class, aliasMedico));

            String aliasEspecialidade = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.ESPECIALIDADE);
            propriedades.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, vo.getMedico().getId(), Filtro.EQUAL, aliasMedico));

            List<MedicoEspecialidade> lista = dao.listarByFilter(propriedades, null, MedicoEspecialidade.class, Constants.NO_LIMIT, nxCriterion);
            for (MedicoEspecialidade medicoEspecialidade : lista) {
                if (medicoEspecialidade.getEspecialidade().getId() == vo.getEspecialidade().getId()) {
                    dao.delete(medicoEspecialidade);
                }
            }

            info = Info.GetSuccess("Especialidade excluida com sucesso!");
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao excluir a Especialidade.");
        }
        return info;
    }

    public Info verificarPossibilidadeCandidatura(FiltroMedico filtroMedico) {
        try {
            GenericDao genericDao = new GenericDao();


            List<MedicoEspecialidadeVo> listaMedicoEspecialidadeVo = listarMedicoEspecialidade(filtroMedico);

            MedicoVo medicoVo;
            if (!Util.isNullOrEmpty(listaMedicoEspecialidadeVo)) {
                medicoVo = listaMedicoEspecialidadeVo.get(0).getMedico();
            } else {
                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Medico.ID));
                propriedades.add(new Propriedade(Medico.CADASTRO_COMPLETO));
                propriedades.add(new Propriedade(Medico.STATUS));

                NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, filtroMedico.getId(), Filtro.EQUAL));

                Medico medico = (Medico) genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

                medicoVo = MedicoMapper.convertToVo(medico);
            }

            if (medicoVo.getStatus() == null) {
                filtroMedico.setCadastroCompleto(true);
                return Info.GetSuccess(filtroMedico);
            }

            if (medicoVo.getStatus().equals(Constants.DOCUMENTOS_PENDENTES) || !medicoVo.getCadastroCompleto()) {
                filtroMedico.setCadastroCompleto(false);
                return Info.GetSuccess(filtroMedico);
            }

            if (medicoVo.getStatus().equals(Constants.EM_ANALISE)) {
                filtroMedico.setEmAnalise(true);
                return Info.GetSuccess(filtroMedico);
            }


            List<EspecialidadeVo> especialidades = new ArrayList<>();
            if (!Util.isNullOrEmpty(listaMedicoEspecialidadeVo)) {
                for (MedicoEspecialidadeVo usuarioAppEspecialidadeVo : listaMedicoEspecialidadeVo) {
                    if (usuarioAppEspecialidadeVo.getEspecialidade() != null) {
                        especialidades.add(usuarioAppEspecialidadeVo.getEspecialidade());
                    }
                }
            }

            if (filtroMedico.getPlantao().getListaEspecialidades().size() == 1) {
                EspecialidadeVo especialidadeVo = filtroMedico.getPlantao().getListaEspecialidades().get(0);
                if (especialidadeVo.getDescricao().equals("CLÍNICO GERAL") || especialidadeVo.getDescricao().equals("CLÍNICO GERAL/PEDIATRIA") || especialidadeVo.getDescricao().equals("CLÍNICO GERAL/GINECOLOGIA")) {
                    return Info.GetSuccess();
                }
            }

            if (!especialidades.containsAll(filtroMedico.getPlantao().getListaEspecialidades())) {
                filtroMedico.setEspecialidadeNaoCadastrada(true);
                return Info.GetSuccess(filtroMedico);
            } else {
                // Recupero os anexos do médico para verificar se os anexos estão validados para cada especialidade
                List<MedicoAnexoVo> listaMedicoAnexoVo = listarMedicoAnexoPorMedicoCampoAnexo(medicoVo.getId(), null, false);
                for (EspecialidadeVo especialidade : filtroMedico.getPlantao().getListaEspecialidades()) {
                    List<MedicoAnexoVo> listTmp = listaMedicoAnexoVo.stream()
                            .filter(a -> a.getEspecialidade() != null && a.getEspecialidade().equals(especialidade))
                            .collect(Collectors.toList());
                    if (listTmp.isEmpty() || listTmp.stream().anyMatch(a -> Util.isNullOrFalse(a.getValidado()) && Util.isNullOrFalse(a.getEhHistorico()))) {
                        filtroMedico.setEspecialidadeNaoValidada(true);
                        return Info.GetSuccess(filtroMedico);
                    }
                }
            }

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.DATA));

            SimpleDateFormat dfData = new SimpleDateFormat("dd/MM/yyyy");

            String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.CADASTRO_COMPLETO, Medico.class, aliasMedico));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, filtroMedico.getId(), Filtro.EQUAL, aliasMedico));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.STATUS, "A-CONFIRMAR", Filtro.EQUAL)));

            List<Plantao> listaPlantoesMedico = genericDao.listarByFilter(propriedades, null, Plantao.class, Constants.NO_LIMIT, nxCriterion);

            DateTime horaInicioPlantao = new DateTime(filtroMedico.getPlantao().getHoraInicio());
            DateTime horaFimPlantao = new DateTime(filtroMedico.getPlantao().getHoraFim());

            GregorianCalendar inicioPlantao = new GregorianCalendar();
            inicioPlantao.setTime(filtroMedico.getPlantao().getData());
            inicioPlantao.set(GregorianCalendar.HOUR_OF_DAY, horaInicioPlantao.getHourOfDay() + 3);
            inicioPlantao.set(GregorianCalendar.MINUTE, horaInicioPlantao.getMinuteOfDay());
            inicioPlantao.set(GregorianCalendar.SECOND, 0);

            GregorianCalendar fimPlantao = new GregorianCalendar();
            fimPlantao.setTime(filtroMedico.getPlantao().getData());
            fimPlantao.set(GregorianCalendar.HOUR_OF_DAY, horaFimPlantao.getHourOfDay() + 3);
            fimPlantao.set(GregorianCalendar.MINUTE, horaFimPlantao.getMinuteOfDay());
            fimPlantao.set(GregorianCalendar.SECOND, 0);


            if (listaPlantoesMedico != null && listaPlantoesMedico.size() > 0) {
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


                    if (dfData.format(plantao.getData()).equals(dfData.format(filtroMedico.getPlantao().getData()))) {
                        if (inicioPlantao.getTime().before(fimPlantaoBase.getTime()) && (inicioPlantao.getTime().after(inicioPlantaoBase.getTime()) || inicioPlantao.getTime().equals(inicioPlantaoBase.getTime()))
                                || (fimPlantao.getTime().before(fimPlantaoBase.getTime()) || fimPlantao.getTime().equals(fimPlantaoBase.getTime())) && fimPlantao.getTime().after(inicioPlantaoBase.getTime())) {
                            filtroMedico.setJaTemCandidatura(true);
                            return Info.GetSuccess(filtroMedico);
                        }
                    }
                }
            }
            return Info.GetSuccess(filtroMedico);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("Ocorreu um erro");
        }
    }

    /**
     * @param vo
     * @return
     * @
     */
    public Info candidatarMedico(PlantaoVo vo) {
        Info info;
        try {
            if (vo != null && vo.getId() != null) {
                GenericDao<Plantao> dao = new GenericDao();
                PlantaoVo plantaoVo;
                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Plantao.ID));
                propriedades.add(new Propriedade(Plantao.STATUS));
                propriedades.add(new Propriedade(Plantao.MEDICO));
                propriedades.add(new Propriedade(Plantao.DISPONIVEL));

                NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, true, Filtro.NOT_EQUAL));
                NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Plantao.ID, vo.getId(), Filtro.EQUAL));
                criterion = NxCriterion.and(criterion, criterionAux);

                Plantao plantao = dao.selectUnique(propriedades, Plantao.class, criterion);

                plantaoVo = PlantaoMapper.convertToVo(plantao);
                plantaoVo.setMedico(vo.getMedico());
                plantaoVo.setStatus(vo.getStatus());
                plantaoVo.setDisponivel(false);

                plantao = PlantaoMapper.convertToEntity(plantaoVo);
                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());
                AuditoriaUtil.alteracao(plantao);
                dao.update(plantao, propriedades);

                info = Info.GetSuccess(vo);
            } else {
                info = Info.GetError("Plantao não encontrado.");
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao adicionar Médico");
        }
        return info;
    }

    public Info adicionarBiometria(MedicoVo vo) {
        Info info;
        try {
            if (vo != null) {
                GenericDao<Medico> dao = new GenericDao();
                List<Propriedade> propriedades = new PropriedadeListBuilder()
                        .propriedades(Medico.ID, Medico.EMAIL, Medico.PUBLIC_KEY, Medico.SIGNATURE)
                        .build();

                if (this.medicoVO.getId() == null) {
                    return Info.GetError("Houve um problema ao adicionar a biometria, tente novamente mais tarde");
                }

                NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, this.medicoVO.getId(), Filtro.EQUAL));
                Medico medico = dao.selectUnique(propriedades, Medico.class, nxCriterion);

                if (medico == null) {
                    throw new Exception("Not found");
                }

                if (Objects.isNull(vo.getPublicKey()) || Objects.isNull(vo.getSignature())) {
                    return Info.GetError("Public key ou Signature não podem ser nulos");
                }

                medico.setPublicKey(vo.getPublicKey());
                medico.setSignature(vo.getSignature());

                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());
                AuditoriaUtil.alteracao(medico);
                dao.update(medico, propriedades);

                info = Info.GetSuccess(vo);
            } else {
                info = Info.GetError("Médico não encontrado.");
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao adicionar Biometria");
        }
        return info;
    }

    public Info carregarCampoAnexo(MedicoVo vo) {
        Info info;
        List<CampoAnexoVo> listCampoAnexoVo;
        List<TodosAnexosMedicoVo> listTodosAnexosMedicoVo = new ArrayList<>();
        GenericDao<CampoAnexo> dao = new GenericDao<>();
        MedicoVo medicoVo = new MedicoVo();
        try {
            //listar os CamposAnexos
            List<Propriedade> propriedadesCampoAnexo = new ArrayList<>();
            propriedadesCampoAnexo.add(new Propriedade(CampoAnexo.ID));
            propriedadesCampoAnexo.add(new Propriedade(CampoAnexo.DESCRICAO));
            propriedadesCampoAnexo.add(new Propriedade(CampoAnexo.ORDEM));

            List<CampoAnexo> listCampoAnexo = dao.listarByFilter(propriedadesCampoAnexo, null, CampoAnexo.class, Constants.NO_LIMIT, null);
            listCampoAnexoVo = CampoAnexoMapper.convertToListVo(listCampoAnexo);

            Comparator<CampoAnexoVo> ordem = Comparator.comparingInt(CampoAnexoVo::getOrdem);

            listCampoAnexoVo = listCampoAnexoVo.stream().sorted(ordem).collect(Collectors.toList());

            for (CampoAnexoVo campoAnexo : listCampoAnexoVo) {
                TodosAnexosMedicoVo todosAnexosMedicoVo = new TodosAnexosMedicoVo();
                todosAnexosMedicoVo.setCampoAnexo(campoAnexo);
                todosAnexosMedicoVo.setListMedicoAnexo(new ArrayList<>());
                listTodosAnexosMedicoVo.add(todosAnexosMedicoVo);
            }
            medicoVo.setListTodosAnexosMedicoVo(listTodosAnexosMedicoVo);
            medicoVo.setListaEspecialidadeSelecionado(null);
            info = Info.GetSuccess(medicoVo);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao adicionar Médico");
        }
        return info;
    }

    public Info getAnexosByMedico(MedicoVo medico) {
        GenericDao dao = new GenericDao();

        try {
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(MedicoAnexo.ID));
            propriedades.add(new Propriedade(MedicoAnexo.NOME_ANEXO));
            propriedades.add(new Propriedade(MedicoAnexo.BASE64_ANEXO));
            propriedades.add(new Propriedade(MedicoAnexo.CAMPO_ANEXO));
            propriedades.add(new Propriedade(MedicoAnexo.ESPECIALIDADE));
            propriedades.add(new Propriedade(MedicoAnexo.EH_VERSO));
            propriedades.add(new Propriedade(MedicoAnexo.MEDICO));
            propriedades.add(new Propriedade(MedicoAnexo.MEDICO_CURSO));
            propriedades.add(new Propriedade(MedicoAnexo.VALIDADO));
            propriedades.add(new Propriedade(MedicoAnexo.EXTRA));
            propriedades.add(new Propriedade(MedicoAnexo.OBSERVACAO_VALIDACAO));

            String aliasMedico = NxCriterion.montaAlias(MedicoAnexo.ALIAS_CLASSE, MedicoAnexo.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medico.getId(), Filtro.EQUAL, aliasMedico));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion
                    .or(NxCriterion.montaRestriction(new Filtro(MedicoAnexo.EH_HISTORICO, false, Filtro.EQUAL)),
                            (NxCriterion.montaRestriction(new Filtro(MedicoAnexo.EH_HISTORICO, null, Filtro.IS_NULL)))));
            List<MedicoAnexo> anexos = dao.listarByFilter(propriedades, null, MedicoAnexo.class, Constants.NO_LIMIT, nxCriterion);
            List<MedicoAnexoVo> anexosVo = MedicoAnexoMapper.convertToListVo(anexos);

            return Info.GetSuccess(anexosVo);
        } catch (Exception e) {
            e.printStackTrace();
            return Info.GetError("Não foi possivel recuperar os anexos do medico");
        }

    }

    public Info atualizarTokenPushNotificationMedico(MedicoVo medicoVo) {
        Info info;
        try {
            GenericDao<Medico> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.TOKEN_PUSH_NOTIFICATION));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medicoVo.getId(), Filtro.EQUAL));
            Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            if (medico == null) {
                return Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            }

            medico.setTokenPushNotification(medicoVo.getTokenPushNotification());

            genericDao.update(medico, propriedades);


            info = Info.GetSuccess(Constants.SUCESSO, medicoVo);
        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    public Info salvarInformacoesMeuPerfil(MedicoVo vo) {
        Info info;
        GenericDao dao = new GenericDao<>();

        List<Integer> attachmentIds = new ArrayList<>();

        try {
            dao.beginTransaction();
            List<Propriedade> propriedades;
            Medico medico = MedicoMapper.convertToEntity(vo);

            boolean novosDocs = false;
            boolean novasEspecialidade = false;
            if (medico.getId() != null && medico.getId() > 0) {
                propriedades = new ArrayList<>();

                propriedades.add(new Propriedade(Medico.ID));

                if (!Util.isNullOrEmpty(vo.getNome())) {
                    propriedades.add(new Propriedade(Medico.NOME));
                }
                if (!Util.isNullOrEmpty(vo.getEmail())) {
                    propriedades.add(new Propriedade(Medico.EMAIL));
                }
                if (!Util.isNullOrEmpty(vo.getTelefone())) {
                    propriedades.add(new Propriedade(Medico.TELEFONE));
                }
                if (!Util.isNullOrEmpty(vo.getUfConselhoMedico())) {
                    propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO));
                }

                if (!Util.isNullOrEmpty(vo.getSexo())) {
                    propriedades.add(new Propriedade(Medico.SEXO));
                }

                if (!Util.isNullOrEmpty(vo.getNumeroCrm())) {
                    propriedades.add(new Propriedade(Medico.NUMERO_CRM));
                }

                if (!Util.isNullOrEmpty(vo.getNumeroCrmAdicional())) {
                    propriedades.add(new Propriedade(Medico.NUMERO_CRM_ADICIONAL));
                }

                if (!Util.isNullOrEmpty(vo.getUfConselhoMedicoAdicional())) {
                    propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO_ADICIONAL));
                }

                if (vo.getCrmAdicionalIssueDate() != null) {
                    propriedades.add(new Propriedade(Medico.CRM_ADICIONAL_ISSUE_DATE));
                }

                if (!Util.isNullOrEmpty(vo.getAnexoFoto())) {
                    propriedades.add(new Propriedade(Medico.ANEXO_FOTO));
                    propriedades.add(new Propriedade(Medico.ATTACHMENT));
                    Attachment attachment = new Attachment();
                    attachment.setContentType(medico.getTipoAnexoFoto());
                    attachment.setFile(medico.getAnexoFoto());
                    attachment.setFileName(medico.getNomeAnexoFoto());
                    attachment.setName(medico.getNomeAnexoFoto());
                    attachment.setProcessed(false);
                    attachment.setType(AttachmentType.IMAGE);

                    Integer attachmentId = dao.persistWithCurrentTransaction(attachment);
                    attachment.setId(attachmentId);
                    attachmentIds.add(attachmentId);

                    medico.setAttachment(attachment);
                    medico.setAnexoFoto(null);
                }

                if (vo.getSenha() != null && vo.getSenha().length() > 0) {
                    propriedades.add(new Propriedade(Usuario.SENHA));
                    medico.setSenha(PASSWORD_ENCODER.encode(vo.getSenha()));
                }

                for (MedicoAnexo medicoAnexo : MedicoAnexoMapper.convertToListEntity(vo.getListaMedicoAnexo())) {
                    if (medicoAnexo.getId() == null) {
                        AuditoriaUtil.inclusao(medicoAnexo, this.usuario);
                        medicoAnexo.setDataUsuarioInc(new Date());
                        medicoAnexo.setDataUsuarioAlt(new Date());
                        medicoAnexo.setMedico(medico);

                        Attachment attachment = new Attachment();
                        attachment.setContentType(medicoAnexo.getTipoAnexo());
                        attachment.setFile(medicoAnexo.getBase64Anexo());
                        attachment.setFileName(medicoAnexo.getNomeAnexo());
                        attachment.setName(medicoAnexo.getNomeAnexo());
                        attachment.setProcessed(false);
                        attachment.setType(AttachmentType.DOCUMENT);

                        Integer attachmentId = dao.persistWithCurrentTransaction(attachment);
                        attachment.setId(attachmentId);
                        attachmentIds.add(attachmentId);

                        medicoAnexo.setAttachment(attachment);
                        medicoAnexo.setBase64Anexo(null);

                        dao.persistWithCurrentTransaction(medicoAnexo);
                    }
                }


                if (vo.getListaEspecialidadeSelecionado() != null && !vo.getListaEspecialidadeSelecionado().isEmpty()) {
                    novasEspecialidade = true;
                    for (EspecialidadeVo especialidadeVo : vo.getListaEspecialidadeSelecionado()) {
                        if (especialidadeVo.getId() != null) {
                            MedicoEspecialidade medicoEspecialidade = new MedicoEspecialidade();
                            medicoEspecialidade.setMedico(medico);
                            medicoEspecialidade.setEspecialidade(EspecialidadeMapper.convertToEntity(especialidadeVo));

                            dao.persistWithCurrentTransaction(medicoEspecialidade);
                        }
                    }
                    //medico.setStatus(Constants.EM_ANALISE);
                    //propriedades.add(new Propriedade(Medico.STATUS));
                }
                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                medico.setStatus(Constants.EM_ANALISE);
                propriedades.add(new Propriedade(Medico.STATUS));

                AuditoriaUtil.alteracao(medico);
                dao.updateWithCurrentTransaction(medico, propriedades);
                dao.commitCurrentTransaction();
            }

            if (novosDocs) {
                Util.enviaEmail(getHtmlNovosDocsHygea(medico), Constants.TIPO_NOTIFICACAO_CADASTRO_APLICATIVO);
            }

            if (novasEspecialidade) {
                Util.enviaEmail(getHtmlNovasEspecialidades(medico, vo.getListaEspecialidadeSelecionado()), Constants.TIPO_NOTIFICACAO_CADASTRO_APLICATIVO);
            }

            info = Info.GetSuccess(medico);

            new AttachmentController().uploadByAttachmentIds(attachmentIds);
        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }

        return info;
    }

    /**
     * @param medico
     * @param especialidades
     * @return
     */
    private String getHtmlNovasEspecialidades(Medico medico, List<EspecialidadeVo> especialidades) {
        StringBuilder html = new StringBuilder();
        html.append("<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">");
        html.append("<p style=\"font-weight:bold;\">Olá,</p>");
        html.append("<p>O Dr(a). ").append(medico.getNome()).append(" adicionou as seguintes especialidades em seu perfil:</p>");
        for (EspecialidadeVo especialidade : especialidades) {
            html.append("<p>").append(especialidade.getDescricao()).append("</p>");
        }
        html.append("<p>Confira acessando a tela de médicos no sistema.</p>");
        html.append("<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>");
        html.append("<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>");
        html.append("</div>");
        return html.toString();
    }

    /**
     * Retorna o HMTL do e-mail de notificação de novos documentos
     *
     * @param medico
     * @return
     */
    private String getHtmlNovosDocsHygea(Medico medico) {
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>O Dr(a). " + medico.getNome() + " enviou novos documentos para análise.</p>";
        html += "<p>Confira acessando a tela de médicos no sistema.</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    public Info excluirBloqueioMedicoEscala(BloqueioMedicoEscalaVo vo) {
        Info info = null;
        try {
            GenericDao<BloqueioMedicoEscala> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(BloqueioMedicoEscala.ID));

            String aliasMedico = NxCriterion.montaAlias(BloqueioMedicoEscala.ALIAS_CLASSE, BloqueioMedicoEscala.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.EMAIL, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.EXCLUIDO, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.TELEFONE, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.SEXO, Medico.class, aliasMedico));

            String aliasEscala = NxCriterion.montaAlias(BloqueioMedicoEscala.ALIAS_CLASSE, BloqueioMedicoEscala.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, vo.getMedico().getId(), Filtro.EQUAL, aliasMedico));

            List<BloqueioMedicoEscala> lista = dao.listarByFilter(propriedades, null, BloqueioMedicoEscala.class, Constants.NO_LIMIT, nxCriterion);
            for (BloqueioMedicoEscala bloqueioMedicoEscala : lista) {
                if (bloqueioMedicoEscala.getEscala().getNomeEscala().equals(vo.getEscala().getNomeEscala())) {
                    dao.delete(bloqueioMedicoEscala);
                }
            }

            info = Info.GetSuccess("Escala excluida com sucesso!");
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao excluir a Escala.");
        }
        return info;
    }


    public List<MedicoVo> findMedicOfContractWithSpecialty(PlantaoVo plantaoVo) {
        return new BloqueioMedicoContratoController().findMedicOfContractWithSpecialty(plantaoVo);
    }

    // lista combo de usuariosApp(medicos)
    public List<MedicoVo> listarComboMedicoNaoBloqueados(PlantaoVo plantaoVo) {
        List<MedicoVo> listVo = new ArrayList<>();
        List<BloqueioMedicoEscalaVo> listaBloqueioMedicoEscalaVo = new ArrayList<>();
        List<PlantaoEspecialidadeVo> listaPlantaoEspecialidadeVo = new ArrayList<>();
        List<MedicoEspecialidadeVo> listaMedicoEspecialidadeVo = new ArrayList<>();
        try {
            // lista os plantoes bloqueados do medico
            GenericDao<BloqueioMedicoEscala> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(BloqueioMedicoEscala.ID));

            String aliasEscala = NxCriterion.montaAlias(BloqueioMedicoEscala.ALIAS_CLASSE, BloqueioMedicoEscala.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));

            String aliasMedico = NxCriterion.montaAlias(BloqueioMedicoEscala.ALIAS_CLASSE, BloqueioMedicoEscala.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.EXCLUIDO, Medico.class, aliasMedico));


            NxCriterion nxCriterion = NxCriterion.or(
                    NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, true, Filtro.NOT_EQUAL, aliasMedico)),
                    NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, null, Filtro.IS_NULL, aliasMedico))
            );
            NxCriterion nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Escala.ID, plantaoVo.getEscala().getId(), Filtro.EQUAL, aliasEscala));
            nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);

            List<BloqueioMedicoEscala> lista = dao.listarByFilter(propriedades, null, BloqueioMedicoEscala.class, -1, nxCriterion);

            listaBloqueioMedicoEscalaVo = BloqueioMedicoEscalaMapper.convertToListVo(lista);

            List<Integer> ids = new ArrayList<Integer>();
            for (BloqueioMedicoEscalaVo bloqueioMedicoEscala : listaBloqueioMedicoEscalaVo) {
                ids.add(bloqueioMedicoEscala.getMedico().getId());
            }

            // combo medico com criterium que nao mostra o medico bloqueado para aquele plantao
            GenericDao<Medico> daoMedico = new GenericDao();
            List<Propriedade> propriedadesMedico = new ArrayList<>();
            propriedadesMedico.add(new Propriedade(Medico.ID));
            propriedadesMedico.add(new Propriedade(Medico.NOME));
            propriedadesMedico.add(new Propriedade(Medico.CADASTRO_COMPLETO));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Medico.NOME, NxOrder.NX_ORDER.ASC));

            NxCriterion nxCriterionMedico = NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, true, Filtro.NOT_EQUAL));
            NxCriterion nxCriterionMedicoAuxCadastroCompleto = NxCriterion.montaRestriction(new Filtro(Medico.CADASTRO_COMPLETO, false, Filtro.NOT_EQUAL));
            nxCriterionMedico = NxCriterion.and(nxCriterionMedico, nxCriterionMedicoAuxCadastroCompleto);
            if (ids.size() > 0) {
                NxCriterion nxCriterionMedicoAux = NxCriterion.montaRestriction(new Filtro(Medico.ID, ids, Filtro.NOT_IN));
                nxCriterionMedico = NxCriterion.and(nxCriterionMedico, nxCriterionMedicoAux);
            }

            List<Medico> listaMedico = daoMedico.listarByFilter(propriedadesMedico, nxOrders, Medico.class, -1, nxCriterionMedico);

            // lista os plantaoes especialidades do plantao
            GenericDao<PlantaoEspecialidade> daoPlantaoEspecialidade = new GenericDao();
            List<Propriedade> propriedadesPlantaoEspecialidade = new ArrayList<>();
            propriedadesPlantaoEspecialidade.add(new Propriedade(PlantaoEspecialidade.ID));

            String aliasPlantao = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO);
            propriedadesPlantaoEspecialidade.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            String aliasEspecialidade = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.ESPECIALIDADE);
            propriedadesPlantaoEspecialidade.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
            propriedadesPlantaoEspecialidade.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));

            NxCriterion nxCriterionPlantaoEspecialidade = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantaoVo.getId(), Filtro.EQUAL, aliasPlantao));

            List<PlantaoEspecialidade> listaPlantaoEspecialidades = daoPlantaoEspecialidade.listarByFilter(propriedadesPlantaoEspecialidade, null, PlantaoEspecialidade.class, -1, nxCriterionPlantaoEspecialidade);

            listaPlantaoEspecialidadeVo = PlantaoEspecialidadeMapper.convertToListVo(listaPlantaoEspecialidades);
            List<EspecialidadeVo> listaEspecialidadePlantao = new ArrayList<>();
            for (PlantaoEspecialidadeVo plantaoEspecialidadeVo : listaPlantaoEspecialidadeVo) {
                listaEspecialidadePlantao.add(plantaoEspecialidadeVo.getEspecialidade());
            }

            for (Medico medico : listaMedico) {

                // lista de todos os medicos Especialidades
                GenericDao<MedicoEspecialidade> daoMedicoEspecialidade = new GenericDao();
                List<Propriedade> propriedadesMedicoEspecialidade = new ArrayList<>();
                propriedadesMedicoEspecialidade.add(new Propriedade(MedicoEspecialidade.ID));

                String aliasMedicoA = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.MEDICO);
                propriedadesMedicoEspecialidade.add(new Propriedade(Medico.ID, Medico.class, aliasMedicoA));

                String aliasEspecialidadeA = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.ESPECIALIDADE);
                propriedadesMedicoEspecialidade.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidadeA));
                propriedadesMedicoEspecialidade.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidadeA));

                NxCriterion nxCriterionMedicoEspececialidade = NxCriterion.montaRestriction(new Filtro(Medico.ID, medico.getId(), Filtro.EQUAL, aliasMedicoA));


                List<MedicoEspecialidade> listaMedicoEspecialidade = daoMedicoEspecialidade.listarByFilter(propriedadesMedicoEspecialidade, null, MedicoEspecialidade.class, -1, nxCriterionMedicoEspececialidade);

                listaMedicoEspecialidadeVo = MedicoEspecialidadeMapper.convertToListVo(listaMedicoEspecialidade);
                List<EspecialidadeVo> listaEspecialidadeMedico = new ArrayList<>();
                for (MedicoEspecialidadeVo medicoEspecialidadeVo : listaMedicoEspecialidadeVo) {
                    listaEspecialidadeMedico.add(medicoEspecialidadeVo.getEspecialidade());
                }

                if (listaEspecialidadePlantao.size() == 1 && (listaEspecialidadePlantao.get(0).getDescricao().equals("CLÍNICO GERAL") ||
                        listaEspecialidadePlantao.get(0).getDescricao().equals("CLÍNICO GERAL/PEDIATRIA") ||
                        listaEspecialidadePlantao.get(0).getDescricao().equals("CLÍNICO GERAL/GINECOLOGIA"))) {
                    listVo.add(MedicoMapper.convertToVo(medico));

                } else if (listaEspecialidadeMedico.containsAll(listaEspecialidadePlantao)) {
                    listVo.add(MedicoMapper.convertToVo(medico));
                }
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listVo;
    }

    /**
     * @param medicoAnexoVo
     * @return
     */
    public Info excluirMedicoAnexo(MedicoAnexoVo medicoAnexoVo) {
        Info info;
        try {
            MedicoAnexo medicoAnexo = MedicoAnexoMapper.convertToEntity(medicoAnexoVo);

            GenericDao<MedicoAnexo> genericDao = new GenericDao<>();

            genericDao.delete(medicoAnexo);

            info = Info.GetSuccess(Constants.SUCESSO);
        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    public Info obterAvatarMedico(MedicoVo medicoVo) {
        Info info;
        try {
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.ANEXO_FOTO));

            GenericDao<Medico> genericDao = new GenericDao<>();

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medicoVo.getId(), Filtro.EQUAL));

            Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            MedicoVo retorno = MedicoMapper.convertToVo(medico);

            info = Info.GetSuccess(retorno);
        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    protected List<MedicoAnexoVo> listarMedicoAnexoPorMedicoCampoAnexo(Integer idMedico, Integer idCampoAnexo, boolean comAnexo) throws Exception {
        List<Propriedade> propriedadesMedicoAnexo = new ArrayList<>();
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.ID));
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.NOME_ANEXO));
        if (comAnexo) {
            propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.BASE64_ANEXO));
        }
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.NOME_ANEXO));
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.EH_HISTORICO));
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.OBSERVACAO_VALIDACAO));
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.VALIDADO));
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.TIPO_ANEXO));
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.EXTRA));
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.DATA_USUARIO_INC));
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.MEDICO_CURSO));
        propriedadesMedicoAnexo.add(new Propriedade(MedicoAnexo.ATTACHMENT));

        String aliasMedicoA = NxCriterion.montaAlias(MedicoAnexo.ALIAS_CLASSE, MedicoAnexo.MEDICO);
        propriedadesMedicoAnexo.add(new Propriedade(Medico.ID, Medico.class, aliasMedicoA));

        String aliasCampoAnexo = NxCriterion.montaAlias(MedicoAnexo.ALIAS_CLASSE, MedicoAnexo.CAMPO_ANEXO);
        propriedadesMedicoAnexo.add(new Propriedade(CampoAnexo.ID, CampoAnexo.class, aliasCampoAnexo));
        propriedadesMedicoAnexo.add(new Propriedade(CampoAnexo.DESCRICAO, CampoAnexo.class, aliasCampoAnexo));

        String aliasEspecialidadeAnexo = NxCriterion.montaAlias(MedicoAnexo.ALIAS_CLASSE, MedicoAnexo.ESPECIALIDADE);
        propriedadesMedicoAnexo.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidadeAnexo));
        propriedadesMedicoAnexo.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidadeAnexo));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(MedicoAnexo.EXCLUIDO, false, Filtro.EQUAL));
        if (!Util.isNullOrEmpty(idMedico)) {
            NxCriterion nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Medico.ID, idMedico, Filtro.EQUAL, aliasMedicoA));
            nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
        }

        if (!Util.isNullOrEmpty(idCampoAnexo)) {
            NxCriterion nxCriterionAux = NxCriterion.montaRestriction(new Filtro(CampoAnexo.ID, idCampoAnexo, Filtro.EQUAL, aliasCampoAnexo));
            nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);
        }

        List<NxOrder> nxOrders = Collections.singletonList(new NxOrder(MedicoAnexo.DATA_USUARIO_INC, NxOrder.NX_ORDER.ASC));

        GenericDao<MedicoAnexo> dao = new GenericDao<>();
        List<MedicoAnexo> medicoAnexo = dao.listarByFilter(propriedadesMedicoAnexo, nxOrders, MedicoAnexo.class, Constants.NO_LIMIT, nxCriterion);
        return MedicoAnexoMapper.convertToListVo(medicoAnexo);
    }


    public MedicoExportarVo handlePreferences(MedicoExportarVo medicoExportarVo, PreferencesMedic preferencesMedic) {
        StringBuilder preferenciasLocalidade = new StringBuilder();
        var preferenciasPeriodo = "";
        var preferenciasSetor = "";
        var preferenciasDiaSemana = "";

        var periodo = preferencesMedic.getPreferencesPeriodo();
        var setor = preferencesMedic.getPreferencesSetor();
        var weekday = preferencesMedic.getPreferencesWeekday();
        if (periodo != null) {
            if (periodo.getCinderela() != null && periodo.getCinderela()) {
                preferenciasPeriodo += "Cinderela ";
            }
            if (periodo.getManha() != null && periodo.getManha()) {
                preferenciasPeriodo += "Manhã ";
            }
            if (periodo.getNoite() != null && periodo.getNoite()) {
                preferenciasPeriodo += "Noite ";
            }
            if (periodo.getTarde() != null && periodo.getTarde()) {
                preferenciasPeriodo += "Tarde ";
            }
        }

        if (setor != null) {
            if (setor.getConsultorio() != null && setor.getConsultorio()) {
                preferenciasSetor += "Consultório ";
            }
            if (setor.getEmergencia() != null && setor.getEmergencia()) {
                preferenciasSetor += "Emergencial ";
            }
            if (setor.getObservacao() != null && setor.getObservacao()) {
                preferenciasSetor += "Observação ";
            }
            if (setor.getPediatria() != null && setor.getPediatria()) {
                preferenciasSetor += "Pediatria ";
            }
        }

        if (weekday != null) {
            if (weekday.getMonday() != null && weekday.getMonday()) {
                preferenciasDiaSemana += "Segunda-feira ";
            }
            if (weekday.getTuesday() != null && weekday.getTuesday()) {
                preferenciasDiaSemana += "Terça-feira ";
            }
            if (weekday.getWednesday() != null && weekday.getWednesday()) {
                preferenciasDiaSemana += "Quarta-feira ";
            }
            if (weekday.getThursday() != null && weekday.getThursday()) {
                preferenciasDiaSemana += "Quinta-feira ";
            }
            if (weekday.getFriday() != null && weekday.getFriday()) {
                preferenciasDiaSemana += "Sexta-feira ";
            }
            if (weekday.getSaturday() != null && weekday.getSaturday()) {
                preferenciasDiaSemana += "Sábado ";
            }
            if (weekday.getSunday() != null && weekday.getSunday()) {
                preferenciasDiaSemana += "Domingo ";
            }
        }

        var preferenciasLocal = (List<PreferencesLocality>) getSession()
                .createQuery("select pl from PreferencesLocality pl " +
                        "join pl.preferencesMedic pm " +
                        "where pm.id = :id").setInteger("id", preferencesMedic.getId()).list();

        if (!Util.isNullOrEmpty(preferenciasLocal)) {
            for (PreferencesLocality preferencesLocality : preferenciasLocal) {
                String stateName = preferencesLocality.getState().getName();
                var currentLocality = new ArrayList<String>();
                if (preferencesLocality.getCapital() != null && preferencesLocality.getCapital()) {
                    preferenciasLocalidade.append(stateName + " - Capital, ");
                    currentLocality.add("Capital");
                }

                if (preferencesLocality.getCoastal() != null && preferencesLocality.getCoastal()) {
                    preferenciasLocalidade.append(stateName + " - Litoral, ");
                    currentLocality.add("Litoral");
                }
                if (preferencesLocality.getCountryside() != null && preferencesLocality.getCountryside()) {
                    preferenciasLocalidade.append(stateName + " - Interior, ");
                    currentLocality.add("Interior");
                }
                var prefs = currentLocality.stream().collect(Collectors.joining(","));
                medicoExportarVo.getMapLocality().put(preferencesLocality.getState().getAcronym(), prefs);
            }
        }

        medicoExportarVo.setPeriodo(preferenciasPeriodo);
        medicoExportarVo.setSetor(preferenciasSetor);
        medicoExportarVo.setDiaSemana(preferenciasDiaSemana);
        medicoExportarVo.setLocalidade(preferenciasLocalidade.toString());

        return medicoExportarVo;
    }

    public List<MedicoExportarVo> getMedicosParaExportar(String ativo, String status, List<Integer> medicosId, String estado, String especialidade, String startDate, String endDate) {
        GenericDao<Medico> dao = new GenericDao<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.NOME));
            propriedades.add(new Propriedade(Medico.EMAIL));
            propriedades.add(new Propriedade(Medico.PONTUACAO));
            propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO));
            propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO_ADICIONAL));
            propriedades.add(new Propriedade(Medico.NUMERO_CRM));
            propriedades.add(new Propriedade(Medico.NUMERO_CRM_ADICIONAL));
            propriedades.add(new Propriedade(Medico.TIPO_RECEBIMENTO));
            propriedades.add(new Propriedade(Medico.SEXO));
            propriedades.add(new Propriedade(Medico.BANCO));
            propriedades.add(new Propriedade(Medico.AGENCIA));
            propriedades.add(new Propriedade(Medico.CONTA));
            propriedades.add(new Propriedade(Medico.OPERACAO));
            propriedades.add(new Propriedade(Medico.NUMERO_PIS));
            propriedades.add(new Propriedade(Medico.STATUS));
            propriedades.add(new Propriedade(Medico.ATIVO));
            propriedades.add(new Propriedade(Medico.TELEFONE));
            propriedades.add(new Propriedade(Medico.BIRTH_DATE));
            propriedades.add(new Propriedade(Medico.CRM_ISSUE_DATE));
            propriedades.add(new Propriedade(Medico.CRM_ADICIONAL_ISSUE_DATE));
            propriedades.add(new Propriedade(Medico.ADDRESS));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL));

            if (ativo != null) {
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.ATIVO, ativo.equals("ATIVOS"), Filtro.EQUAL)));
            }

            if (estado != null) {
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.UF_CONSELHO_MEDICO, estado, Filtro.EQUAL)));
            }

            if (medicosId != null && medicosId.size() > 0) {
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.ID, medicosId, Filtro.IN)));
            }

            if (status != null) {
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.STATUS, status, Filtro.EQUAL)));
            }

            if (startDate != null) {
                Date startDateFormatted = sdf.parse(startDate);
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.DATA_USUARIO_INC, startDateFormatted, Filtro.MAIOR_IGUAL)));
            }

            if (endDate != null) {
                Date endDateFormatted = sdf.parse(startDate);
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.DATA_USUARIO_INC, endDateFormatted, Filtro.MENOR_IGUAL)));
            }

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Medico.NOME, NxOrder.NX_ORDER.ASC));

            List<Medico> medicos = dao.listarByFilter(propriedades, nxOrders, Medico.class, Constants.NO_LIMIT, nxCriterion);

            var medicosExportarVo = MedicoMapper.convertToListExportarVo(medicos);

            medicosExportarVo.forEach(it -> {
                var medicoEspecialidades = (List<MedicoEspecialidade>) getSession()
                        .createQuery("select mp from MedicoEspecialidade mp " +
                                "join mp.medico m " +
                                "where m.id = :id").setInteger("id", it.getId()).list();
                var especialidades = "";
                for (MedicoEspecialidade medicoEspecialidade : medicoEspecialidades) {
                    especialidades += medicoEspecialidade.getEspecialidade().getDescricao() + " ";
                    it.getEspecialidades().add(medicoEspecialidade.getEspecialidade().getDescricao());
                }
                it.setEspecialidade(especialidades);

                var medicoPreferencias = (PreferencesMedic) getSession()
                        .createQuery("select pm from PreferencesMedic pm " +
                                "join pm.medico m " +
                                "where m.id = :id").setInteger("id", it.getId()).uniqueResult();

                if (medicoPreferencias != null) {
                    it = handlePreferences(it, medicoPreferencias);
                }

                var cameToUs = (CameToUs) getSession().createQuery(
                                "select ctu from CameToUs ctu " +
                                        "join ctu.medico m " +
                                        "where m.id = :id")
                        .setInteger("id", it.getId())
                        .uniqueResult();

                it = handleCameToUs(it, cameToUs);


                var medicoAnexos = (List<MedicoAnexo>) getSession()
                        .createQuery("select ma from MedicoAnexo ma " +
                                "join ma.medico m " +
                                "where m.id = :id " +
                                "and ma.excluido = :excluido " +
                                "and (ma.ehHistorico is null or ma.ehHistorico = :historico)")
                        .setInteger("id", it.getId())
                        .setBoolean("excluido", false)
                        .setBoolean("historico", false)
                        .list();

                it = handleMedicoAnexos(it, medicoAnexos);
            });

            if (especialidade != null) {
                medicosExportarVo = medicosExportarVo.stream()
                        .filter(it -> it.getEspecialidades().stream().anyMatch(especialidade::equals))
                        .collect(Collectors.toList());
            }

            return medicosExportarVo;
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }

        return new ArrayList<>();
    }


    private String checkValidado(List<MedicoAnexo> anexos, Integer campoAnexoId) {
        var hasFalseValidation = anexos.stream().anyMatch(it -> it.getCampoAnexo().getId().equals(campoAnexoId) && (it.getValidado() == null || !it.getValidado()));
        var hasTrueValidation = anexos.stream().anyMatch(it -> it.getCampoAnexo().getId().equals(campoAnexoId) && (it.getValidado() != null && it.getValidado()));
        if (!hasFalseValidation && hasTrueValidation) {
            return "Consta";
        } else {
            return "Não";
        }
    }

    private MedicoExportarVo handleCameToUs(MedicoExportarVo medicoExportarVo, CameToUs cameToUs) {
        if (cameToUs == null) {
            medicoExportarVo.setComoChegouAteNos("");
            return medicoExportarVo;
        }
        String howDidYouGetToUs = "";
        if (cameToUs.getGoogleOrSite()) {
            howDidYouGetToUs += "Busca no Google / Site  ";
        }

        if (cameToUs.getColleagueIndication()) {
            howDidYouGetToUs += "Indicação de colega  ";
        }

        if (cameToUs.getProvideServiceAtWork()) {
            howDidYouGetToUs += "Prestam serviço onde atuo  ";
        }

        if (cameToUs.getRecruitment()) {
            howDidYouGetToUs += "Recrutamento direto " + cameToUs.getRecruiterName() + " ";
        }

        if (cameToUs.getSocialMedia()) {
            howDidYouGetToUs += "Redes Sociais  ";
        }

        if (cameToUs.getOther()) {
            howDidYouGetToUs += "Outros  " + cameToUs.getOtherDescription() + " ";
        }
        medicoExportarVo.setComoChegouAteNos(howDidYouGetToUs);
        return medicoExportarVo;
    }

    private MedicoExportarVo handleMedicoAnexos(MedicoExportarVo medicoExportarVo, List<MedicoAnexo> anexos) {

        medicoExportarVo.setCrmDefinitivo(checkValidado(anexos, 1));
        medicoExportarVo.setProtocoloCrm(checkValidado(anexos, 2));
        medicoExportarVo.setDiplomaDeclaracao(checkValidado(anexos, 3));
        medicoExportarVo.setRg(checkValidado(anexos, 4));
        medicoExportarVo.setCpf(checkValidado(anexos, 5));
        medicoExportarVo.setComprovanteEndereco(checkValidado(anexos, 6));
        medicoExportarVo.setAnexoEspecialidade(checkValidado(anexos, 7));
        medicoExportarVo.setCertidaoRqe(checkValidado(anexos, 8));
        medicoExportarVo.setCertidaoCasamento(checkValidado(anexos, 9));
        medicoExportarVo.setCarteirinhaCursos(checkValidado(anexos, 10));
        medicoExportarVo.setCnh(checkValidado(anexos, 14));
        medicoExportarVo.setDocumentosAdicionais(checkValidado(anexos, 15));
        medicoExportarVo.setAnexoCrmAdicional(checkValidado(anexos, 17));
        medicoExportarVo.setAnexoProtocoloAdicional(checkValidado(anexos, 18));

        return medicoExportarVo;
    }


    public ArquivoVo gerarExcel(String ativo, String status, List<Integer> medicosId, String estado, String especialidade, String startDate, String endDate) {
        ArquivoVo arquivoVo = new ArquivoVo();

        List<MedicoExportarVo> medicosVo = getMedicosParaExportar(ativo, status, medicosId, estado, especialidade, startDate, endDate);

        if (!br.com.plantaomais.util.Util.isNullOrEmpty(medicosVo)) {
            Map<String, String> mapItens = new HashMap<>();
            int cont = 0;


            mapItens.put(MedicoExportarVo.ID, cont++ + ":" + "Médico id:");
            mapItens.put(MedicoExportarVo.NOME, cont++ + ":" + "Nome do Médico:");
            mapItens.put(MedicoExportarVo.PONTUACAO, cont++ + ":" + "Pontuação:");
            mapItens.put(MedicoExportarVo.EMAIL, cont++ + ":" + "E-mail:");
            mapItens.put(MedicoExportarVo.TELEFONE, cont++ + ":" + "Telefone:");
            mapItens.put(MedicoExportarVo.CRM, cont++ + ":" + "Número do CRM:");
            mapItens.put(MedicoExportarVo.ESTADO, cont++ + ":" + "UF Conselho Médico:");
            mapItens.put(MedicoExportarVo.CRM_ISSUE_DATE, cont++ + ":" + "DT Emissão CRM:");
            mapItens.put(MedicoExportarVo.CRM_ADICIONAL, cont++ + ":" + "Número do CRM adicional:");
            mapItens.put(MedicoExportarVo.ESTADO_ADICIONAL, cont++ + ":" + "UF Conselho Médico Adicional:");
            mapItens.put(MedicoExportarVo.CRM_ADICIONAL_ISSUE_DATE, cont++ + ":" + "DT Emissão CRM Adicional:");
            mapItens.put(MedicoExportarVo.SEXO, cont++ + ":" + "Sexo:");
            mapItens.put(MedicoExportarVo.BANCO, cont++ + ":" + "Banco:");
            mapItens.put(MedicoExportarVo.AGENCIA, cont++ + ":" + "Agência:");
            mapItens.put(MedicoExportarVo.OPERACAO, cont++ + ":" + "Operação:");
            mapItens.put(MedicoExportarVo.CONTA, cont++ + ":" + "Conta:");
            mapItens.put(MedicoExportarVo.NUMERO_PIS, cont++ + ":" + "Número PIS:");
            mapItens.put(MedicoExportarVo.TIPO_RECEBIMENTO, cont++ + ":" + "Tipo de recebimento:");
            mapItens.put(MedicoExportarVo.ESPECIALIDADE, cont++ + ":" + "Especialidades:");
            mapItens.put(MedicoExportarVo.DIA_SEMANA, cont++ + ":" + "Preferências - Dia da Semana:");
            mapItens.put(MedicoExportarVo.PERIODO, cont++ + ":" + "Preferências - Período:");
            mapItens.put(MedicoExportarVo.SETOR, cont++ + ":" + "Preferências - Setor:");
            mapItens.put(MedicoExportarVo.LOCALIDADE, cont++ + ":" + "Preferências - Localidade:");
            mapItens.put(MedicoExportarVo.BIRTH_DATE, cont++ + ":" + "Data Nascimento:");
            mapItens.put(MedicoExportarVo.ADDRESS, cont++ + ":" + "Endereço:");
            mapItens.put(MedicoExportarVo.ATIVO, cont++ + ":" + "Status:");
            mapItens.put(MedicoExportarVo.CRM_DEFINITIVO, cont++ + ":" + "CRM Definitivo:");
            mapItens.put(MedicoExportarVo.DIPLOMA_DECLARACAO, cont++ + ":" + "Diploma Médico:");
            mapItens.put(MedicoExportarVo.PROTOCOLO_CRM, cont++ + ":" + "Protocolo CRM:");
            mapItens.put(MedicoExportarVo.ANEXO_CRM_ADICIONAL, cont++ + ":" + "CRM Adicional:");
            mapItens.put(MedicoExportarVo.ANEXO_PROTOCOLO_ADICIONAL, cont++ + ":" + "Protocolo Adicional:");
            mapItens.put(MedicoExportarVo.RG, cont++ + ":" + "RG:");
            mapItens.put(MedicoExportarVo.CPF, cont++ + ":" + "CPF:");
            mapItens.put(MedicoExportarVo.CNH, cont++ + ":" + "CNH:");
            mapItens.put(MedicoExportarVo.COMPROVANTE_ENDERECO, cont++ + ":" + "Comprovante de endereço:");
            mapItens.put(MedicoExportarVo.CERTIDAO_RQE, cont++ + ":" + "Certidão RQE:");
            mapItens.put(MedicoExportarVo.CERTIDAO_CASAMENTO, cont++ + ":" + "Certidão de Casamento:");
            mapItens.put(MedicoExportarVo.ANEXO_ESPECIALIDADE, cont++ + ":" + "Titulo Especialidade:");
            mapItens.put(MedicoExportarVo.CARTEIRINHA_CURSOS, cont++ + ":" + "Carteirinha de Cursos:");
            mapItens.put(MedicoExportarVo.DOCUMENTOS_ADICIONAIS, cont++ + ":" + "Documentos Adicionais:");
            mapItens.put(MedicoExportarVo.COMO_CHEGOU_ATE_NOS, cont++ + ":" + "Como chegou até nós:");

            RelatorioBean relatorioBean = new RelatorioBean();
            relatorioBean.setItens(medicosVo);
            relatorioBean.setMapaListaItens(mapItens);
            relatorioBean.setTitulo("RELATÓRIO DE MÉDICOS");
            relatorioBean.setTipo(RelatorioBean.TipoRelatorio.XLS);
            relatorioBean.setNome("RELATORIO_MEDICOS" + ".xls");

            RelatorioBean relatorioPreferences = new RelatorioBean();
            Map<String, String> mapItensLocality = createMapItensRelatorioBeanLocality();
            List<MedicoExportarLocalityVo> medicosVoLocality = createItensRelatorioLocality(medicosVo);

            relatorioPreferences.setItens(medicosVoLocality);
            relatorioPreferences.setMapaListaItens(mapItensLocality);
            relatorioPreferences.setTitulo("RELATÓRIO LOCALIDADE");
            relatorioPreferences.setTipo(RelatorioBean.TipoRelatorio.XLS);

            Map<String, String> mapItensEspecialidade = createMapItensRelatorioBeanEspecialidades();
            List<MedicoExportarEspecialidadeVo> medicosVoEspecialidades = createItensRelatorioEspecialidades(medicosVo);

            RelatorioBean relatorioEspecialidade = new RelatorioBean();
            relatorioEspecialidade.setItens(medicosVoEspecialidades);
            relatorioEspecialidade.setMapaListaItens(mapItensEspecialidade);
            relatorioEspecialidade.setTitulo("RELATÓRIO ESPECIALIDADES");
            relatorioEspecialidade.setTipo(RelatorioBean.TipoRelatorio.XLS);

            List<RelatorioBean> listaItens = new ArrayList<>();
            listaItens.add(relatorioBean);
            listaItens.add(relatorioPreferences);
            listaItens.add(relatorioEspecialidade);
            relatorioBean.setMultipleSheet(true);
            relatorioBean.setListaRelatorioBeanItens(listaItens);

            RelatorioUtil relatorioUtil = new RelatorioUtil();
            byte[] conteudoRelatorio = relatorioUtil.geraRelatorio(relatorioBean);
            arquivoVo.setArquivo(conteudoRelatorio);
            arquivoVo.setNmAnexo(relatorioBean.getNome());

        }
        return arquivoVo;
    }

    private Map<String, String> createMapItensRelatorioBeanLocality() {
        Map<String, String> map = new HashMap<>();

        var cont = 0;
        map.put(MedicoExportarVo.ID, cont++ + ":" + "Médico id:");
        map.put(MedicoExportarVo.NOME, cont++ + ":" + "Nome do Médico:");

        List<State> states = (List<State>) getSession().createQuery("from State").list();
        for (State it : states) {
            map.put(MedicoExportarLocalityVo.getBean(it.getAcronym()), cont++ + ":" + it.getName());
        }
        return map;
    }

    private List<MedicoExportarLocalityVo> createItensRelatorioLocality(List<MedicoExportarVo> medicosVo) {
        List<MedicoExportarLocalityVo> medicosVoLocality = new ArrayList<>();
        for (MedicoExportarVo medicoExportarVo : medicosVo) {
            if (medicoExportarVo.getMapLocality().size() == 0) continue;

            MedicoExportarLocalityVo medicoExportarLocalityVo = new MedicoExportarLocalityVo();
            medicoExportarLocalityVo.setId(medicoExportarVo.getId().toString());
            medicoExportarLocalityVo.setNome(medicoExportarVo.getNome());
            for (Map.Entry<String, String> localityEntry : medicoExportarVo.getMapLocality().entrySet()) {
                medicoExportarLocalityVo.setValue(localityEntry.getKey(), localityEntry.getValue());
            }
            medicosVoLocality.add(medicoExportarLocalityVo);
        }
        return medicosVoLocality;
    }

    private Map<String, String> createMapItensRelatorioBeanEspecialidades() {
        Map<String, String> map = new HashMap<>();

        var cont = 0;
        map.put(MedicoExportarEspecialidadeVo.ID, cont++ + ":" + "Médico id:");
        map.put(MedicoExportarEspecialidadeVo.NOME, cont++ + ":" + "Nome do Médico:");
        map.put(MedicoExportarEspecialidadeVo.ESPECIALIDADE, cont++ + ":" + "Especialidade:");

        return map;
    }


    private List<MedicoExportarEspecialidadeVo> createItensRelatorioEspecialidades(List<MedicoExportarVo> medicosVo) {

        return medicosVo.stream().flatMap(it ->
                        it.getEspecialidades().stream().map(especialidade -> {
                            var medicoExportarEspecialidadeVo = new MedicoExportarEspecialidadeVo();

                            medicoExportarEspecialidadeVo.setId(it.getId().toString());
                            medicoExportarEspecialidadeVo.setNome(it.getNome());
                            medicoExportarEspecialidadeVo.setEspecialidade(especialidade);

                            return medicoExportarEspecialidadeVo;
                        }))
                .collect(Collectors.toList());
    }

}
