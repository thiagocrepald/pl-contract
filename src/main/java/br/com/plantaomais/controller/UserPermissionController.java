package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.TipoPermissao;
import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.entitybean.UsuarioTipoPermissao;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.UsuarioVo;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by gmribas on 25/03/20.
 */
public class UserPermissionController extends Controller {

    private static final Logger logger = Logger.getLogger(UserPermissionController.class.getName());

    public UserPermissionController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }

    public boolean userContainPermission(TipoPermissao.Tipos type) {
        if (type == null) {
            return false;
        }

        try {
            GenericDao<UsuarioTipoPermissao> dao = new GenericDao<>();

            List<Propriedade> props = new ArrayList<>();
            props.add(new Propriedade(UsuarioTipoPermissao.ID));
            props.add(new Propriedade(UsuarioTipoPermissao.TIPO_PERMISSAO));
            props.add(new Propriedade(UsuarioTipoPermissao.USUARIO));

            String aliasUser = NxCriterion.montaAlias(UsuarioTipoPermissao.ALIAS_CLASSE, UsuarioTipoPermissao.USUARIO);
            props.add(new Propriedade(Usuario.ID, Usuario.class, aliasUser));
            NxCriterion nxCriterionUser = NxCriterion.montaRestriction(new Filtro(Usuario.ID, super.usuario.getId(), Filtro.EQUAL, aliasUser));

            String aliasType = NxCriterion.montaAlias(UsuarioTipoPermissao.ALIAS_CLASSE, UsuarioTipoPermissao.TIPO_PERMISSAO);
            props.add(new Propriedade(TipoPermissao.ID, TipoPermissao.class, aliasType));
            NxCriterion nxCriterionType = NxCriterion.montaRestriction(new Filtro(TipoPermissao.ID, type.getId(), Filtro.EQUAL, aliasType));

            NxCriterion nxCriterion = NxCriterion.and(nxCriterionUser, nxCriterionType);

            List<UsuarioTipoPermissao> result = dao.listarByFilter(props, null, UsuarioTipoPermissao.class, Constants.NO_LIMIT, nxCriterion);
            return result.size() > 0 ;

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            return false;
        }
    }
}