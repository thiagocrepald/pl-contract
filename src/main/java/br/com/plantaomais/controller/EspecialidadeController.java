package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.nextage.util.Info;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.mapper.EspecialidadeMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.UsuarioVo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by nextage on 14/05/2019.
 */
public class EspecialidadeController extends Controller {
    private static final Logger logger = Logger.getLogger(EspecialidadeController.class.getName());

    public EspecialidadeController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }

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

    public Info salvar(EspecialidadeVo vo) {
        Info info;
        GenericDao<Especialidade> genericDao = new GenericDao<>();
        try {

            Especialidade especialidade = EspecialidadeMapper.convertToEntity(vo);
            if (vo.getId() != null) {

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Especialidade.ID));
                propriedades.add(new Propriedade(Especialidade.DESCRICAO));
                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                AuditoriaUtil.alteracao(especialidade);

                genericDao.update(especialidade);

            } else {
                AuditoriaUtil.inclusao(especialidade, null);
                genericDao.persist(especialidade);
            }

            vo.setId(especialidade.getId());
            info = Info.GetSuccess(vo);

        } catch (Exception e) {
            info = Info.GetError("Erro ao salvar o especialidade.", vo);
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return info;
    }
}
