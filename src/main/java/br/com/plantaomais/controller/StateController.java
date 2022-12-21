package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.State;
import br.com.plantaomais.mapper.StateMapper;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.StateVo;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class StateController {

    private static final Logger logger = Logger.getLogger(StateController.class.getName());

    public StateController() {
    }

    public List<StateVo> findAllVo() throws Exception {

        return StateMapper.convertToListVo(this.doFind(null));
    }

    public List<State> findAll() throws Exception {

        return this.doFind(null);
    }

    public List<StateVo> findOne(Integer id) throws Exception {

        return StateMapper.convertToListVo(this.doFind(id));
    }

    private List<State> doFind(Integer id) throws Exception {

        GenericDao<State> dao = new GenericDao<>();
        List<Propriedade> props = new ArrayList<>();
        NxCriterion nxCriterion = null;

        props.add(new Propriedade(State.ID));
        props.add(new Propriedade(State.NAME));
        props.add(new Propriedade(State.ACRONYM));
        props.add(new Propriedade(State.COASTAL));

        if (id != null) {
            nxCriterion = NxCriterion.montaRestriction(new Filtro(State.ID, id, Filtro.EQUAL));
        }

        try {

            return dao.listarByFilter(props, null, State.class, Constants.NO_LIMIT, nxCriterion);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }
}
