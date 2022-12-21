package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.nextage.util.Info;
import br.com.plantaomais.entitybean.TipoServico;
import br.com.plantaomais.mapper.TipoServicoMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.TipoServicoVo;
import br.com.plantaomais.vo.UsuarioVo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by nextage on 10/05/2019.
 */
public class TipoServicoController extends Controller {
    private static final Logger logger = Logger.getLogger(TipoServicoController.class.getName());

    public TipoServicoController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }

    public List<TipoServicoVo> listarComboTipoServico() {
        List<TipoServicoVo> listVo = new ArrayList<>();
        try {
            GenericDao<TipoServico> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(TipoServico.ID));
            propriedades.add(new Propriedade(TipoServico.DESCRICAO));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(TipoServico.DESCRICAO, NxOrder.NX_ORDER.ASC));

            List<TipoServico> lista = dao.listarByFilter(propriedades, nxOrders, TipoServico.class, -1, null);

            listVo = TipoServicoMapper.convertToListVo(lista);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listVo;
    }

    public Info salvar(TipoServicoVo vo) {
        Info info;
        GenericDao<TipoServico> genericDao = new GenericDao<>();
        try {

            TipoServico tipoServico = TipoServicoMapper.convertToEntity(vo);
            if (vo.getId() != null) {

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(TipoServico.ID));
                propriedades.add(new Propriedade(TipoServico.DESCRICAO));
                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                AuditoriaUtil.alteracao(tipoServico);

                genericDao.update(tipoServico);

            } else {
                AuditoriaUtil.inclusao(tipoServico, null);
                genericDao.persist(tipoServico);
            }

            vo.setId(tipoServico.getId());
            info = Info.GetSuccess(vo);

        } catch (Exception e) {
            info = Info.GetError("Erro ao salvar o tipo de serviço.", vo);
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return info;
    }
}
