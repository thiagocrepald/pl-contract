package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Curso;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.PaymentData;

import br.com.plantaomais.mapper.PaymentDataMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.PaymentDataVo;
import org.hibernate.Session;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;


public class PaymentDataController extends Controller {
    private static final Logger logger = Logger.getLogger(PaymentDataController.class.getName());

    public <T extends Principal> PaymentDataController(T vo) throws AuthenticationException {
        super(vo);
    }

    public List<PaymentDataVo> findByMedic(Medico medico) throws Exception {

        if (medico == null || medico.getId() == null) return null;

        try {
            var listPaymentData = (List<PaymentData>) getSession().createQuery(
                    "select pd from PaymentData pd " +
                    "join pd.medico m " +
                    "where m.id = :id")
            .setInteger("id", medico.getId())
            .list();
            return PaymentDataMapper.convertToListVo(listPaymentData);
        }
        catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

    public PaymentData save(PaymentData paymentData, GenericDao dao) {
        Session session = dao.getCurrentSession();
        session.saveOrUpdate(paymentData);
        return paymentData;
    }

    public void delete(PaymentData paymentData, GenericDao dao) {
        Session session = dao.getCurrentSession();
        session.delete(paymentData);
    }
}
