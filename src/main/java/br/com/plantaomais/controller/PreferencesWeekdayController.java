package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.PreferencesWeekday;
import org.hibernate.Session;

public class PreferencesWeekdayController {

    public static void save(PreferencesWeekday preferencesWeekday, GenericDao dao) throws Exception {

        Session session = dao.getCurrentSession();
        session.saveOrUpdate(preferencesWeekday);

    }
}
