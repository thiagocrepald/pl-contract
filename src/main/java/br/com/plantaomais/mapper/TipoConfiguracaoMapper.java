package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.TipoConfiguracao;
import br.com.plantaomais.vo.TipoConfiguracaoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 17/06/2019.
 */
public class TipoConfiguracaoMapper {
    /**
     * Convert an entity to TipoConfiguracaoVo
     *
     * @param entity TipoConfiguracaoApi
     * @return TipoConfiguracaoVo
     */
    public static TipoConfiguracaoVo convertToVo(TipoConfiguracao entity) {
        TipoConfiguracaoVo vo = null;
        if (entity != null) {
            vo = new TipoConfiguracaoVo();
            vo.setId(entity.getId());
            vo.setDescricao(entity.getDescricao());

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<TipoConfiguracaoApi>
     * @return List<TipoConfiguracaoVo>
     */
    public static List<TipoConfiguracaoVo> convertToListVo(List<TipoConfiguracao> listEntity) {
        List<TipoConfiguracaoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (TipoConfiguracao entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o TipoConfiguracaoVo para TipoConfiguracaoApi
     *
     * @param vo TipoConfiguracaoVo
     * @return TipoConfiguracaoApi
     */
    public static TipoConfiguracao convertToEntity(TipoConfiguracaoVo vo) {
        TipoConfiguracao entity = null;
        if (vo != null) {
            entity = new TipoConfiguracao();
            entity.setId(vo.getId());
            entity.setDescricao(vo.getDescricao());
        }
        return entity;
    }

    /**
     * Converte uma lista de TipoConfiguracaoVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<TipoConfiguracaoVo>
     * @return List<TipoConfiguracaoApi>
     */
    public static List<TipoConfiguracao> convertToListEntity(List<TipoConfiguracaoVo> listVo) {
        List<TipoConfiguracao> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (TipoConfiguracaoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
