package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.TipoPermissao;
import br.com.plantaomais.mapper.TipoPermissaoMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.TipoPermissaoVo;
import br.com.plantaomais.vo.UsuarioVo;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TipoPermissaoController extends Controller {

    private static final Logger logger = Logger.getLogger(UsuarioController.class.getName());

    public TipoPermissaoController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }

    public List<TipoPermissaoVo> listar() {
        List<TipoPermissaoVo> listVo = new ArrayList<>();
        try {

            GenericDao<TipoPermissao> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(TipoPermissao.ID));
            propriedades.add(new Propriedade(TipoPermissao.DESCRICAO));

            List<TipoPermissao> list = genericDao.listarByFilter(propriedades, null, TipoPermissao.class, Constants.NO_LIMIT, null);

            listVo = TipoPermissaoMapper.convertToListVo(list);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return listVo;
    }
}
