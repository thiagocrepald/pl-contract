package br.com.plantaomais.controller.aplicativo;

import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.mapper.EspecialidadeMapper;
import br.com.plantaomais.vo.EspecialidadeVo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class EspecialidadeController {
    private static final Logger logger = Logger.getLogger(br.com.plantaomais.controller.EspecialidadeController.class.getName());

    public List<EspecialidadeVo> listarComboEspecialidade() {
        List<EspecialidadeVo> listVo = new ArrayList<>();
        try {
            GenericDao<Especialidade> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Especialidade.ID));
            propriedades.add(new Propriedade(Especialidade.DESCRICAO));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Especialidade.DESCRICAO, NxOrder.NX_ORDER.ASC));

            List<Especialidade> lista = dao.listarByFilter(propriedades, nxOrders, Especialidade.class, -1, null);

            listVo = EspecialidadeMapper.convertToListVo(lista);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listVo;
    }
}
