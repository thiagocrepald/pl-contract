package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.CameToUs;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.PaymentData;
import br.com.plantaomais.mapper.CameToUsMapper;
import br.com.plantaomais.mapper.PaymentDataMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.CameToUsVo;
import br.com.plantaomais.vo.PaymentDataVo;
import org.hibernate.Session;

import java.security.Principal;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;


public class CameToUsController extends Controller {
    private static final Logger logger = Logger.getLogger(CameToUsController.class.getName());

    public <T extends Principal> CameToUsController(T vo) throws AuthenticationException {
        super(vo);
    }

    public CameToUsVo findByMedic(Medico medico) throws Exception {

        if (medico == null || medico.getId() == null) return null;

        try {
            var cameToUs = (CameToUs) getSession().createQuery(
                    "select ctu from CameToUs ctu " +
                    "join ctu.medico m " +
                    "where m.id = :id")
            .setInteger("id", medico.getId())
            .uniqueResult();
            return CameToUsMapper.convertToVo(cameToUs);
        }
        catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

    public CameToUs save(CameToUs cameToUs, GenericDao dao) {
        Session session = dao.getCurrentSession();
        session.saveOrUpdate(cameToUs);
        return cameToUs;
    }

    public void delete(CameToUs cameToUs, GenericDao dao) {
        Session session = dao.getCurrentSession();
        session.delete(cameToUs);
    }
}
