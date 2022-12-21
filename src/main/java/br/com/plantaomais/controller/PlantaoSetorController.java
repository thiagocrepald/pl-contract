package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.PlantaoSetor;
import br.com.plantaomais.entitybean.Setor;
import br.com.plantaomais.mapper.SetorMapper;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.SetorVo;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * Created by gmribas on 13/04/20.
 */
public class PlantaoSetorController {

    private static final Logger logger = Logger.getLogger(PlantaoSetorController.class.getName());

    public List<SetorVo> getSetoresDoPlantao(Integer plantaoId) throws Exception {
        try {
            GenericDao<PlantaoSetor> dao = new GenericDao<>();

            List<Propriedade> props = new ArrayList<>();
            props.add(new Propriedade(PlantaoSetor.ID));

            String aliasSetor = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.SETOR);
            props.add(new Propriedade(Setor.ID, Setor.class, aliasSetor));
            props.add(new Propriedade(Setor.DESCRICAO, Setor.class, aliasSetor));

            String aliasPlantao = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO);
            props.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));


            NxCriterion nxCriterionSetor = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantaoId, Filtro.EQUAL, aliasPlantao));

            List<PlantaoSetor> plantaoSetores = dao.listarByFilter(props, null, PlantaoSetor.class, Constants.NO_LIMIT, nxCriterionSetor);

            List<Setor> setores = plantaoSetores.stream()
                    .map(PlantaoSetor::getSetor)
                    .collect(Collectors.toList());

            return SetorMapper.convertToListVo(setores);
        } catch (Exception e) {
            logger.severe(e.getMessage());
            throw e;
        }

    }
}
