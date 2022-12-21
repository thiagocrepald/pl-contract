package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Configuracao;
import br.com.plantaomais.vo.ConfiguracaoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 17/06/2019.
 */
public class ConfiguracaoMapper {
    /**
     * Convert an entity to ConfiguracaoVo
     *
     * @param entity Configuracao
     * @return ConfiguracaoVo
     */
    public static ConfiguracaoVo convertToVo(Configuracao entity) {
        ConfiguracaoVo vo = null;
        if (entity != null) {
            vo = new ConfiguracaoVo();
            vo.setId(entity.getId());
            vo.setTipoConfiguracao(TipoConfiguracaoMapper.convertToVo(entity.getTipoConfiguracao()));
            vo.setUsuario(UsuarioMapper.convertToVo(entity.getUsuario()));

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<Configuracao>
     * @return List<ConfiguracaoVo>
     */
    public static List<ConfiguracaoVo> convertToListVo(List<Configuracao> listEntity) {
        List<ConfiguracaoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Configuracao entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o ConfiguracaoVo para Configuracao
     *
     * @param vo ConfiguracaoVo
     * @return Configuracao
     */
    public static Configuracao convertToEntity(ConfiguracaoVo vo) {
        Configuracao entity = null;
        if (vo != null) {
            entity = new Configuracao();
            entity.setId(vo.getId());
            entity.setTipoConfiguracao(TipoConfiguracaoMapper.convertToEntity(vo.getTipoConfiguracao()));
            entity.setUsuario(UsuarioMapper.convertToEntity(vo.getUsuario()));
        }
        return entity;
    }

    /**
     * Converte uma lista de ConfiguracaoVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<ConfiguracaoVo>
     * @return List<Configuracao>
     */
    public static List<Configuracao> convertToListEntity(List<ConfiguracaoVo> listVo) {
        List<Configuracao> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (ConfiguracaoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
