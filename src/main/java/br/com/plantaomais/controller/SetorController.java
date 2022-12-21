package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.nextage.util.Info;
import br.com.plantaomais.entitybean.Setor;
import br.com.plantaomais.mapper.SetorMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.SetorVo;
import br.com.plantaomais.vo.UsuarioVo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by nextage on 14/05/2019.
 */
public class SetorController extends Controller {
    private static final Logger logger = Logger.getLogger(SetorController.class.getName());

    public SetorController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }

    public List<SetorVo> listarComboSetor() {
        List<SetorVo> listVo = new ArrayList<>();
        try {
            GenericDao<Setor> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Setor.ID));
            propriedades.add(new Propriedade(Setor.DESCRICAO));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Setor.DESCRICAO, NxOrder.NX_ORDER.ASC));

            List<Setor> lista = dao.listarByFilter(propriedades, nxOrders, Setor.class, -1, null);

            listVo = SetorMapper.convertToListVo(lista);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listVo;
    }

    public Info salvar(SetorVo vo) {
        Info info;
        GenericDao<Setor> genericDao = new GenericDao<>();
        try {

            Setor setor = SetorMapper.convertToEntity(vo);
            if (vo.getId() != null) {

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Setor.ID));
                propriedades.add(new Propriedade(Setor.DESCRICAO));
                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                AuditoriaUtil.alteracao(setor);

                genericDao.update(setor);

            } else {
                AuditoriaUtil.inclusao(setor, null);
                genericDao.persist(setor);
            }

            vo.setId(setor.getId());
            info = Info.GetSuccess(vo);

        } catch (Exception e) {
            info = Info.GetError("Erro ao salvar o setor.", vo);
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return info;
    }
}
