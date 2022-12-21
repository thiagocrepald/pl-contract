package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Attachment;
import br.com.plantaomais.entitybean.Event;
import br.com.plantaomais.entitybean.TipoPermissao;
import br.com.plantaomais.entitybean.enums.AttachmentType;
import br.com.plantaomais.entitybean.enums.NotificationStatus;
import br.com.plantaomais.mapper.AttachmentMapper;
import br.com.plantaomais.mapper.EventMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.AddressVo;
import br.com.plantaomais.vo.AttachmentVo;
import br.com.plantaomais.vo.EventVO;
import br.com.plantaomais.vo.NotificationVo;
import br.com.plantaomais.vo.aplicativo.PushNotificationVo;

import java.security.Principal;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * Created by gmribas on 27/04/20.
 */
public class EventController extends Controller {

    private static final Logger logger = Logger.getLogger(EventController.class.getName());

    private final PushNotificationController pushNotificationController;

    public <T extends Principal> EventController(T vo) throws AuthenticationException {
        super(vo);
        pushNotificationController = new PushNotificationController(vo);
    }

    public List<EventVO> find(Integer id, Boolean active, String orderBy) throws Exception {
        return EventMapper.toVO(doFind(id, active, orderBy));
    }

    private List<Event> doFind(Integer id, Boolean active, String orderBy) throws Exception {
        GenericDao<Event> dao = new GenericDao<>();

        try {
            List<Propriedade> props = Event
                    .getAllFields()
                    .stream()
                    .map(Propriedade::new)
                    .collect(Collectors.toList());

            NxCriterion nxCriterion = null;

            if (id != null) {
                nxCriterion = NxCriterion.montaRestriction(new Filtro(Event.ID, id, Filtro.EQUAL));
            }

            List<NxOrder> nxOrders = null;

            if (active != null) {
                NxCriterion nxCriterionActive = NxCriterion.montaRestriction(new Filtro(Event.ACTIVE, active, Filtro.EQUAL));

                if (nxCriterion != null) {
                    nxCriterion = NxCriterion.and(nxCriterion, nxCriterionActive);
                } else {
                    nxCriterion = nxCriterionActive;
                }
            }

            if (orderBy != null) {
                checkOrderByAttribute(orderBy);
                nxOrders = Collections.singletonList(new NxOrder(orderBy, NxOrder.NX_ORDER.DESC));
            }

            //noinspection unchecked
            return dao.listarByFilter(props, nxOrders, Event.class, Constants.NO_LIMIT, nxCriterion);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

    private void checkOrderByAttribute(String orderBy) {
        if (orderBy == null || orderBy.isEmpty()) {
            throw new IllegalArgumentException("order by not found");
        }

        if (!orderBy.equals(Event.ID) &&
                !orderBy.equals(Event.START_DATE)) {

            throw new IllegalArgumentException("order by not found");
        }
    }

    public EventVO save(EventVO vo) throws Exception {
        GenericDao<Event> dao = new GenericDao<>();

        checkPermission();

        try {
            dao.beginTransaction();

            AddressController addressController = new AddressController();

            String userJson = Util.getStringJsonFor(usuario);

            if (vo.getAddress() != null) {
                AddressVo saved = addressController.save(dao, vo.getAddress());
                vo.setAddress(saved);
            }

            Integer attachmentId = null;

            if (vo.getImageBase64() != null) {
                Attachment attachment = new Attachment();
                attachment.setContentType("image/*");
                attachment.setFile(Util.base64StringToByte(vo.getImageBase64()));
                attachment.setFileName(vo.getAttachment().getFileName());
                attachment.setName(vo.getAttachment().getName());
                attachment.setProcessed(false);
                attachment.setType(AttachmentType.IMAGE);

                attachmentId = dao.persistWithCurrentTransaction(attachment);

                AttachmentVo attachmentVo = AttachmentMapper.convertToVo(attachment);
                attachmentVo.setId(attachmentId);
                vo.setAttachment(attachmentVo);
            } else if (vo.getAttachment() != null && vo.getAttachment().getId() == null) {
                //empty initial attachment
                vo.setAttachment(null);
            }

            Event entity = EventMapper.toEntity(vo);
            entity.setDataUsuarioAlt(new Date());
            entity.setDataUsuarioInc(new Date());
            entity.setUsuarioInc(userJson);
            entity.setUsuarioAlt(userJson);

            Integer eventId;
            boolean sendNotification = false;

            if (entity.getId() != null) {
                List<Event> one = doFind(entity.getId(), null, null);

                if (one.size() != 1) {
                    throw new IllegalArgumentException("EventVO to be updated not found");
                }

                //merging stuff
                entity.setDataUsuarioInc(one.get(0).getDataUsuarioInc());
                entity.setUsuarioInc(one.get(0).getUsuarioInc());
                entity.setUsuarioAlt(userJson);

                dao.update(entity);
                eventId = entity.getId();

            } else {
                eventId = dao.persist(entity);
                sendNotification = true;
            }

            dao.commitCurrentTransaction();

            if (eventId == null) {
                throw new IllegalArgumentException("EventVO id cannot be null");
            }

            if (attachmentId != null) {
                new AttachmentController().uploadByAttachmentIds(List.of(attachmentId));
            }

            vo.setId(eventId);

            if (vo.getActive() && sendNotification) {
                sendNotifications(vo);
            }

            return vo;

        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

    public Boolean delete(Integer eventId) throws Exception {
        GenericDao<Event> dao = new GenericDao<>();

        checkPermission();

        try {
            if (eventId == null) {
                throw new IllegalArgumentException("Event id cannot be null");
            }

            dao.beginTransaction();

            new NotificationController().deleteAllEventRelatedNotifications(dao, eventId);

            List<Event> one = doFind(eventId, null, null);

            if (one.size() != 1) {
                throw new IllegalArgumentException("EventVO to be updated not found");
            }

            boolean deleted = dao.deleteWithCurrentTransaction(one.get(0));
            dao.commitCurrentTransaction();

            return deleted;
        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

    private void checkPermission() throws AuthenticationException {
        if (usuarioVO != null) {
            UserPermissionController controller = new UserPermissionController(usuarioVO);
            if (!controller.userContainPermission(TipoPermissao.Tipos.CriarAlterarExcluirEventos)) {
                throw new AuthenticationException("user does not have the permission to save/update");
            }
        }
    }

    private void sendNotifications(EventVO event) {
        PushNotificationVo pushNotification = new PushNotificationVo.Builder()
                .setTitle("Novo evento: " + event.getTitle())
                .setBody(event.getDescription())
                .setType(Constants.PUSH_TYPE_EVENT)
                .setObjeto(event)
                .buildDefault();

        NotificationVo notification = new NotificationVo.Builder()
                .setDate(new Date())
                .setEvent(event)
                .setStatus(NotificationStatus.PENDING)
                .setType(Constants.PUSH_TYPE_EVENT)
                .setMessage(event.getTitle())
                .create();

        //tokens are handled
        pushNotificationController.sendNotificationToAllMedics(pushNotification, notification);
    }
}
