package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.PaymentData;
import br.com.plantaomais.entitybean.Pix;
import br.com.plantaomais.mapper.PixMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.PixVo;
import org.hibernate.Session;

import java.security.Principal;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;


public class PixController extends Controller {
    private static final Logger logger = Logger.getLogger(PixController.class.getName());

    public <T extends Principal> PixController(T vo) throws AuthenticationException {
        super(vo);
    }

    public Pix save(Pix pix, GenericDao dao) {
        Session session = dao.getCurrentSession();
        session.saveOrUpdate(pix);
        return pix;
    }

    public void delete(Pix pix, GenericDao dao) {
        Session session = dao.getCurrentSession();
        session.delete(pix);
    }
}
