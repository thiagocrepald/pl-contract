package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.PreferencesSetor;
import org.hibernate.Session;

public class PreferencesSetorController {

    public static void save(PreferencesSetor preferencesSetor, GenericDao dao) throws Exception {
        Session session = dao.getCurrentSession();
        session.saveOrUpdate(preferencesSetor);
    }
}
