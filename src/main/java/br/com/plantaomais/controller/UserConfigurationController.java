package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Configuracao;
import br.com.plantaomais.entitybean.TipoConfiguracao;
import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.mapper.ConfiguracaoMapper;
import br.com.plantaomais.vo.ConfiguracaoVo;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

/**
 * Created by gmribas on 02/04/20.
 */
public class UserConfigurationController {

    private static final Logger logger = Logger.getLogger(UserConfigurationController.class.getName());

    public List<Configuracao> findAllByConfigurationType(Integer configurationTypeId) {
        GenericDao<Configuracao> dao = new GenericDao<>();
        List<Propriedade> props = new ArrayList<>();

        props.add(new Propriedade(Configuracao.ID));
        props.add(new Propriedade(Configuracao.USUARIO));
        props.add(new Propriedade(Configuracao.TIPO_CONFIGURACAO));

        String aliasUser = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.USUARIO);
        props.add(new Propriedade(Usuario.ID, Usuario.class, aliasUser));
        props.add(new Propriedade(Usuario.NOME, Usuario.class, aliasUser));
        props.add(new Propriedade(Usuario.LOGIN, Usuario.class, aliasUser));
        props.add(new Propriedade(Usuario.EXCLUIDO, Usuario.class, aliasUser));

        String aliasTypes = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.TIPO_CONFIGURACAO);
        props.add(new Propriedade(TipoConfiguracao.ID, TipoConfiguracao.class, aliasTypes));
        props.add(new Propriedade(TipoConfiguracao.DESCRICAO, TipoConfiguracao.class, aliasTypes));


        NxCriterion criterionUser = NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, false, Filtro.EQUAL, aliasUser));
        NxCriterion criterionType = NxCriterion.montaRestriction(new Filtro(TipoConfiguracao.ID, configurationTypeId, Filtro.EQUAL, aliasTypes));

        try {
            return dao.listarByFilter(props, null, Configuracao.class, -1, NxCriterion.and(criterionUser, criterionType));
        } catch (Exception e) {
            logger.severe("finding all user's configurations");
            e.printStackTrace();
        }

        return new ArrayList<>();
    }

    public List<ConfiguracaoVo> findAllForUserVO(Integer userId) {
        return ConfiguracaoMapper.convertToListVo(findAllForUser(userId));
    }

    public List<Configuracao> findAllForUser(Integer userId) {
        List<Configuracao> result = doFindAllForUser(userId);
        result.forEach(it -> it.setUsuario(null));
        return result;
    }

    private List<Configuracao> doFindAllForUser(Integer userId) {
        GenericDao<Configuracao> dao = new GenericDao<>();
        List<Propriedade> props = new ArrayList<>();

        props.add(new Propriedade(Configuracao.ID));
        props.add(new Propriedade(Configuracao.USUARIO));
        props.add(new Propriedade(Configuracao.TIPO_CONFIGURACAO));

        String aliasUser = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.USUARIO);
        props.add(new Propriedade(Usuario.ID, Usuario.class, aliasUser));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Usuario.ID, userId, Filtro.EQUAL, aliasUser));

        try {
            return dao.listarByFilter(props, null, Configuracao.class, -1, nxCriterion);
        } catch (Exception e) {
            logger.severe("finding all user's configurations");
            e.printStackTrace();
        }

        return new ArrayList<>();
    }
}