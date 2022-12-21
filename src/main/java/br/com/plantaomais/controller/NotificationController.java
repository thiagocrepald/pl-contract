package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.Notification;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.aplicativo.TrocaVaga;
import br.com.plantaomais.entitybean.enums.NotificationStatus;
import br.com.plantaomais.mapper.NotificationMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.NotificationVo;
import org.hibernate.Session;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;

public class NotificationController extends Controller {

    private static final Logger logger = Logger.getLogger(NotificationController.class.getName());

    public NotificationController() {
    }

    public <T extends Principal> NotificationController(T vo) throws AuthenticationException {
        super(vo);
    }

    public List<NotificationVo> get(int limit, int offset) throws Exception {

        try {
            List<Notification> notifications = this.getByMedicId(this.medico.getId(), limit, offset);

            return NotificationMapper.convertToListVo(notifications);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }

    }

    private List<Notification> getByMedicId(int medicId, int limit, int offset) throws Exception {
        GenericDao<Notification> dao = new GenericDao<>();

        return (List<Notification>) getSession()
                .createQuery("select n from Notification n where medic.id = :id order by date desc")
                .setInteger("id", medicId)
                .setMaxResults(limit)
                .setFirstResult(offset)
                .list();
    }

    public NotificationVo save(NotificationVo notificationVo) throws Exception {

        if (notificationVo == null) {
            throw new IllegalArgumentException("notification cannot be null");
        }
        if (notificationVo.getMedico() == null) {
            throw new IllegalArgumentException("notification's medic cannot be null");
        }

        Notification entity = NotificationMapper.convertToEntity(notificationVo);

        GenericDao<Notification> dao = new GenericDao<>();

        Session session = getSession();
        var transaction = session.beginTransaction();
        transaction.begin();
        session.saveOrUpdate(entity);
        transaction.commit();
        session.flush();

        notificationVo.setId(entity.getId());
        return notificationVo;
    }
    
    public NotificationVo updateStatus(NotificationVo vo) {

        if (vo == null && vo.getId() == null) {
            throw new IllegalArgumentException("Missing object.");
        }

        if (vo.getStatus() == null) {
            throw new IllegalArgumentException("Missing status.");
        }

        var notification = (Notification) getSession().createQuery("from Notification where id = :id")
                .setInteger("id", vo.getId()).uniqueResult();
        notification.setStatus(vo.getStatus());

        Session session = getSession();
        var transaction = session.beginTransaction();
        transaction.begin();
        session.saveOrUpdate(notification);
        transaction.commit();
        session.flush();

        return NotificationMapper.convertToVo(notification);
    }

    public List<NotificationVo> markAsExecutedRelateToDuty(Plantao plantao) {

        var notifications = (List<Notification>) getSession()
                .createQuery("select n from Notification n where plantao.id = :id")
                .setInteger("id", plantao.getId())
                .list();

        notifications.stream().forEach(n -> {
            n.setStatus(NotificationStatus.EXECUTED);
        });

        var notificationsApplicant = (List<Notification>) getSession()
                .createQuery("select n from Notification n join n.candidatoPlantao c where c.plantao.id = :id")
                .setInteger("id", plantao.getId())
                .list();

        notificationsApplicant.stream().forEach(n -> {
            n.setStatus(NotificationStatus.EXECUTED);
        });

        Session session = getSession();
        var transaction = session.beginTransaction();
        transaction.begin();
        notifications.forEach(n -> session.saveOrUpdate(n));
        notificationsApplicant.forEach(n -> session.saveOrUpdate(n));
        transaction.commit();
        session.flush();

        return NotificationMapper.convertToListVo(notifications);
    }

    public void markAsExecutedChangeDuty(TrocaVaga trocaVaga) {
        var notifications = (List<Notification>) getSession().createQuery("from Notification where trocaVaga.id = :id").setInteger("id", trocaVaga.getId()).list();
        notifications.stream().forEach(n -> {
            n.setStatus(NotificationStatus.EXECUTED);
        });

        Session session = getSession();
        var transaction = session.beginTransaction();
        transaction.begin();
        notifications.forEach(n -> session.saveOrUpdate(n));
        transaction.commit();
        session.flush();

    }

    public boolean checkIfReminderNotificationHasBeenSent(Integer medicId, Integer plantaoId) {
        @SuppressWarnings("unchecked")
        var notifications = (List<Notification>) getSession()
                .createQuery("select n from Notification n where n.medic.id = :medicId and n.plantao.id = :plantaoId and n.type = 'PUSH_TYPE_REMINDER'")
                .setInteger("medicId", medicId)
                .setInteger("plantaoId", plantaoId)
                .list();

        return notifications.size() > 0;
    }

    public void deleteAllEventRelatedNotifications(GenericDao dao, Integer eventId) throws Exception {
        @SuppressWarnings("unchecked")
        var notifications = (List<Notification>) getSession()
                .createQuery("from Notification n where n.event.id = :eventId")
                .setInteger("eventId", eventId)
                .list();

        for (Notification notification : notifications) {
            dao.deleteWithCurrentTransaction(notification);
        }
    }

    public void markAsExecutedDonationDeclined(Integer id) {
        var notifications = (List<Notification>) getSession()
                .createQuery("from Notification n where n.candidatoPlantao.id = :id")
                .setInteger("id", id).list();
        notifications.stream().forEach(n -> {
            n.setStatus(NotificationStatus.EXECUTED);
        });

        Session session = getSession();
        var transaction = session.beginTransaction();
        transaction.begin();
        notifications.forEach(n -> session.saveOrUpdate(n));
        transaction.commit();
        session.flush();
    }
}
