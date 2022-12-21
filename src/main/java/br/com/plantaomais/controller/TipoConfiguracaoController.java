package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.TipoConfiguracao;
import br.com.plantaomais.mapper.TipoConfiguracaoMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.TipoConfiguracaoVo;
import br.com.plantaomais.vo.UsuarioVo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by nextage on 17/06/2019.
 */
public class TipoConfiguracaoController extends Controller {
    private static final Logger logger = Logger.getLogger(TipoConfiguracaoController.class.getName());

    public TipoConfiguracaoController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }

    public List<TipoConfiguracaoVo> listarComboTipoConfiguracao() {
        List<TipoConfiguracaoVo> listVo = new ArrayList<>();
        try {
            GenericDao<TipoConfiguracao> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(TipoConfiguracao.ID));
            propriedades.add(new Propriedade(TipoConfiguracao.DESCRICAO));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(TipoConfiguracao.DESCRICAO, NxOrder.NX_ORDER.ASC));

            List<TipoConfiguracao> lista = dao.listarByFilter(propriedades, nxOrders, TipoConfiguracao.class, -1, null);

            listVo = TipoConfiguracaoMapper.convertToListVo(lista);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listVo;
    }
}
