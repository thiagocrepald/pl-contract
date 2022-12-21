package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.City;
import br.com.plantaomais.entitybean.State;
import br.com.plantaomais.mapper.CityMapper;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.CityVo;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CityController {

    private static final Logger logger = Logger.getLogger(CityController.class.getName());

    public List<CityVo> findOne(Integer id) throws Exception {

        return CityMapper.convertToListVo(doFind(id, null));
    }

    public List<CityVo> findByState(Integer stateId) throws Exception {

        return CityMapper.convertToListVo(doFind(null, stateId));
    }

    public List<CityVo> findAll() throws Exception {

        return CityMapper.convertToListVo(doFind(null, null));
    }

    private List<City> doFind(Integer id, Integer stateId) throws Exception {

        GenericDao<City> dao = new GenericDao<>();
        NxCriterion criterion = null;

        try {
            List<Propriedade> props = new ArrayList<>();

            props.add(new Propriedade(City.ID));
            props.add(new Propriedade(City.NAME));
            props.add(new Propriedade(City.STATE));

            if (id != null) {

                criterion = NxCriterion.montaRestriction(new Filtro(City.ID, id, Filtro.EQUAL));
            }
            else if(stateId != null) {

                String alias = NxCriterion.montaAlias(City.ALIAS_CLASSE, City.STATE);
                props.add(new Propriedade(State.ID, State.class, alias));
                criterion = NxCriterion.montaRestriction(new Filtro(State.ID, stateId, Filtro.EQUAL, alias));
            }

            return dao.listarByFilter(props, null, City.class, Constants.NO_LIMIT, criterion);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }
}
