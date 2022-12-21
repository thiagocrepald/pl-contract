package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Attachment;
import br.com.plantaomais.entitybean.CampoAnexo;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.MedicoAnexo;
import br.com.plantaomais.entitybean.MedicoCurso;
import br.com.plantaomais.entitybean.TipoPermissao;
import br.com.plantaomais.entitybean.enums.AttachmentType;
import br.com.plantaomais.mapper.MedicoAnexoMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.MedicAttachmentSimpleVO;
import br.com.plantaomais.vo.MedicoAnexoVo;

import java.security.Principal;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;

/**
 * Created by gmribas on 23/03/20.
 */
public class MedicAttachmentController extends Controller {

    private static final Logger logger = Logger.getLogger(MedicAttachmentController.class.getName());

    public <T extends Principal> MedicAttachmentController(T vo) throws AuthenticationException {
        super(vo);
    }

    public List<MedicAttachmentSimpleVO> findSimpleVOForCurrentMedic(Integer id, Integer attachmentId, Integer specialtyId, String orderBy) throws Exception {
        List<MedicoAnexo> found = doFind(getId(), id, attachmentId, specialtyId, orderBy);
        return MedicoAnexoMapper.convertToSimpleVo(found);
    }

    public List<MedicAttachmentSimpleVO> findSimpleVOForMedicId(Integer medicId) throws Exception {
        List<MedicoAnexo> found = doFind(medicId, null, null, null, null);
        return MedicoAnexoMapper.convertToSimpleVo(found);
    }

    public List<MedicoAnexoVo> findAllForCurrentMedic(String orderBy) throws Exception {
        List<MedicoAnexo> found = doFind(getId(), null, null, null, orderBy);
        return MedicoAnexoMapper.convertToListVo(found);
    }

    public List<MedicoAnexoVo> findForCurrentMedic(Integer id, Integer attachmentId, Integer specialtyId, String orderBy) throws Exception {
        List<MedicoAnexo> found = doFind(getId(), id, attachmentId, specialtyId, orderBy);
        return MedicoAnexoMapper.convertToListVo(found);
    }

    public List<MedicoAnexoVo> find(Integer medicId, Integer id, Integer attachmentId, Integer specialtyId, String orderBy) throws Exception {
        List<MedicoAnexo> found = doFind(medicId, id, attachmentId, specialtyId, orderBy);
        return MedicoAnexoMapper.convertToListVo(found);
    }

    public MedicAttachmentSimpleVO markAsSeen(Integer id) throws Exception {
        List<MedicoAnexo> found = doFind(getId(), id, null, null, null);

        if (found.size() == 0) {
            throw new IllegalStateException("attachment not found");
        }

        MedicoAnexo attachment = found.get(0);
        attachment.setVisualizado(true);

        try {
            GenericDao<MedicoAnexo> dao = new GenericDao<>();

            AuditoriaUtil.alteracao(attachment, usuario);
            dao.update(attachment);
            return MedicoAnexoMapper.convertToSimpleVo(attachment);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }


    private List<MedicoAnexo> doFind(Integer medicId, Integer id, Integer attachmentId, Integer specialtyId, String orderBy) throws Exception {
        GenericDao<MedicoAnexo> dao = new GenericDao<>();

        try {
            List<Propriedade> props = MedicoAnexo
                    .getAllFields()
                    .stream()
                    .map(Propriedade::new)
                    .collect(Collectors.toList());

            String aliasMedico = NxCriterion.montaAlias(MedicoAnexo.ALIAS_CLASSE, MedicoAnexo.MEDICO);
            props.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medicId, Filtro.EQUAL, aliasMedico));

            List<NxOrder> nxOrders = null;

            if (id != null) {
                NxCriterion nxCriterionId = NxCriterion.montaRestriction(new Filtro(MedicoAnexo.ID, id, Filtro.EQUAL));
                nxCriterion = NxCriterion.and(nxCriterion, nxCriterionId);
            }

            if (attachmentId != null) {
                String aliasAttachment = NxCriterion.montaAlias(MedicoAnexo.ALIAS_CLASSE, MedicoAnexo.CAMPO_ANEXO);
                props.add(new Propriedade(CampoAnexo.ID, CampoAnexo.class, aliasAttachment));
                NxCriterion nxCriterionId = NxCriterion.montaRestriction(new Filtro(CampoAnexo.ID, attachmentId, Filtro.EQUAL, aliasAttachment));
                nxCriterion = NxCriterion.and(nxCriterion, nxCriterionId);
            }

            if (specialtyId != null) {
                String aliasSpecialty = NxCriterion.montaAlias(MedicoAnexo.ALIAS_CLASSE, MedicoAnexo.ESPECIALIDADE);
                props.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasSpecialty));
                NxCriterion nxCriterionId = NxCriterion.montaRestriction(new Filtro(Especialidade.ID, specialtyId, Filtro.EQUAL, aliasSpecialty));
                nxCriterion = NxCriterion.and(nxCriterion, nxCriterionId);
            }

            if (orderBy != null) {
                checkOrderByAttribute(orderBy);
                nxOrders = Collections.singletonList(new NxOrder(orderBy, NxOrder.NX_ORDER.DESC));
            }

            //noinspection unchecked
            return dao.listarByFilter(props, nxOrders, MedicoAnexo.class, Constants.NO_LIMIT, nxCriterion);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

    public void saveAll(List<MedicoAnexoVo> attachments) throws Exception {
        try {
            if (attachments == null || attachments.size() == 0) {
                throw new IllegalArgumentException("attachments list is empty");
            }

            GenericDao<MedicoAnexo> dao = new GenericDao<>();

            for (MedicoAnexoVo vo: attachments) {
                dao.beginTransaction();
                save(vo, dao);
            }

            dao.commitCurrentTransaction();

            new AttachmentController().uploadPending();
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

    public MedicoAnexoVo save(MedicoAnexoVo attachmentVO) throws Exception {
        return save(attachmentVO, null);
    }

    private MedicoAnexoVo save(MedicoAnexoVo attachmentVO, GenericDao<MedicoAnexo> transactionDao) throws Exception {
        checkPermission();

        GenericDao<MedicoAnexo> dao;
        if (transactionDao != null) {
            dao = transactionDao;
        } else {
             dao = new GenericDao<>();
        }

        try {
            if (super.medico != null && !attachmentVO.getMedico().getId().equals(super.medico.getId())) {
                throw new IllegalArgumentException("Medic can save/update only his attachments");
            }

            if (attachmentVO.getBase64Anexo() == null ||
                    attachmentVO.getCampoAnexo() == null ||
                    attachmentVO.getMedico() == null) {

                throw new IllegalArgumentException("MedicoAnexoVo not valid");
            }

            String userJson = Util.getStringJsonFor(usuario);

            MedicoAnexo medicoAnexo = MedicoAnexoMapper.convertToEntity(attachmentVO);
            medicoAnexo.setDataUsuarioAlt(new Date());
            medicoAnexo.setDataUsuarioInc(new Date());
            medicoAnexo.setUsuarioInc(userJson);
            medicoAnexo.setUsuarioAlt(userJson);
            medicoAnexo.setVisualizado(false);

            Integer newAttachmentId = null;

            AuditoriaUtil.alteracao(medicoAnexo, usuario);
            if (attachmentVO.getId() == null) {
                if (transactionDao != null) {
                    newAttachmentId = dao.persistWithCurrentTransaction(medicoAnexo);
                } else {
                    newAttachmentId = dao.persist(medicoAnexo);
                }

            } else {
                List<MedicoAnexo> one = doFind(getId(), attachmentVO.getId(), null, null, null);

                if (one.size() != 1) {
                    throw new IllegalArgumentException("MedicoAnexoVo to be updated not found");
                }

                //merging stuff
                medicoAnexo.setDataUsuarioInc(one.get(0).getDataUsuarioInc());
                medicoAnexo.setUsuarioInc(one.get(0).getUsuarioInc());
                medicoAnexo.setUsuarioAlt(userJson);
                medicoAnexo.setVisualizado(one.get(0).getVisualizado());

                if (transactionDao != null) {
                    List<Propriedade> props = MedicoAnexo
                            .getAllFields()
                            .stream()
                            .map(Propriedade::new)
                            .collect(Collectors.toList());

                    dao.updateWithCurrentTransaction(medicoAnexo, props);
                } else {
                    dao.update(medicoAnexo);
                }
            }

            if (attachmentVO.getCampoAnexo().getId().equals(CampoAnexo.Campos.DOCUMENTOS_ADICIONAIS.getId())) {
                Util.enviaEmail(getNewAttachmentHygeaHtml(attachmentVO), Constants.TIPO_NOTIFICACAO_DOCUMENTO_ADICIONAL);

            }

            var attachment = new Attachment();
            attachment.setContentType(medicoAnexo.getTipoAnexo());
            attachment.setFile(medicoAnexo.getBase64Anexo());
            attachment.setFileName(medicoAnexo.getNomeAnexo());
            attachment.setName(medicoAnexo.getNomeAnexo());
            attachment.setProcessed(false);
            attachment.setType(AttachmentType.DOCUMENT);

            var attachmentId = dao.persistWithCurrentTransaction(attachment);
            attachment.setId(attachmentId);

            medicoAnexo.setAttachment(attachment);
            medicoAnexo.setBase64Anexo(null);

            if (attachmentVO.getId() == null) {

                dao.persistWithCurrentTransaction(medicoAnexo);
            }
            else {

                dao.updateWithCurrentTransaction(medicoAnexo, MedicoAnexo.getAllFields().stream().map(Propriedade::new).collect(Collectors.toList()));
            }
            dao.commitCurrentTransaction();

            var result = MedicoAnexoMapper.convertToVo(medicoAnexo);
            if (newAttachmentId != null) {
                result.setId(newAttachmentId);
            }

            return result;

        } catch (Exception e) {
            if (transactionDao != null) {
                dao.rollbackCurrentTransaction();
            }
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

    private Integer getId() {
        if (medico != null) {
            return medico.getId();
        }
        if (usuario != null) {
            return usuario.getId();
        }

        throw new IllegalStateException("vo não encontrado");
    }

    private void checkOrderByAttribute(String orderBy) {
        if (orderBy == null || orderBy.isEmpty()) {
            throw new IllegalArgumentException("order by not found");
        }

        if (!orderBy.equals(MedicoAnexo.ID) &&
                !orderBy.equals(MedicoAnexo.NOME_ANEXO) &&
                !orderBy.equals(MedicoAnexo.TIPO_ANEXO) &&
                !orderBy.equals(MedicoAnexo.VALIDADO) &&
                !orderBy.equals(MedicoAnexo.VISUALIZADO)) {

            throw new IllegalArgumentException("order by not found");
        }
    }

    private void checkPermission() throws AuthenticationException {
        if (usuarioVO != null) {
            UserPermissionController controller = new UserPermissionController(usuarioVO);
            if (!controller.userContainPermission(TipoPermissao.Tipos.CriarAlterarExcluirDocumentosAdicionais)) {
                throw new AuthenticationException("user does not have the permission to save/update");
            }
        }
    }

    private String getNewAttachmentHygeaHtml(MedicoAnexoVo attachment) {
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>Há novos documentos adicionais para validação.</p>" +
                "<p>Médico " + attachment.getMedico().getNome() + "</p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    public List<MedicoAnexo> findByMedicoCurso(Integer medicoCursoId) throws Exception {

        GenericDao<MedicoAnexo> dao = new GenericDao<>();
        List<Propriedade> props = MedicoAnexo
                .getAllFields()
                .stream()
                .map(Propriedade::new)
                .collect(Collectors.toList());

        String aliasMedicoCurso = NxCriterion.montaAlias(MedicoAnexo.ALIAS_CLASSE, MedicoAnexo.MEDICO_CURSO);
        props.add(new Propriedade(MedicoCurso.ID, MedicoCurso.class, aliasMedicoCurso));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(MedicoCurso.ID, medicoCursoId, Filtro.EQUAL, aliasMedicoCurso));

        return dao.listarByFilter(props, null, MedicoAnexo.class, Constants.NO_LIMIT, nxCriterion);
    }

    public boolean excluir(List<MedicoAnexo> medicoAnexos) throws Exception {
        GenericDao<MedicoAnexo> dao = new GenericDao<>();

        try {
            dao.beginTransaction();

            for (MedicoAnexo medicoAnexo : medicoAnexos) {
                if(!dao.deleteWithCurrentTransaction(medicoAnexo)) {
                    return false;
                }
            }

            dao.commitCurrentTransaction();

        } catch (Exception e) {

            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }

        return true;
    }

    public List<MedicoAnexo> getAttachmentsPending() {

        var medicAttachments = (List<MedicoAnexo>) getSession()
                .createQuery("from MedicoAnexo ma where ma.medico.id = :id and ma.validado == false")
                .setInteger("id", medico.getId())
                .list();

        return medicAttachments;
    }
}
