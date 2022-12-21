package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.PreferencesPeriodo;
import org.hibernate.Session;

public class PreferencesPeriodoController {

    public static void save(PreferencesPeriodo preferencesPeriodo, GenericDao dao) throws Exception {

        Session session = dao.getCurrentSession();
        session.saveOrUpdate(preferencesPeriodo);

    }
}
