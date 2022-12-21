package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.TipoPermissao;
import br.com.plantaomais.vo.TipoPermissaoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 09/05/2019.
 */
public class TipoPermissaoMapper {

    /**
     * Convert an entity to TipoPermissaoVo
     *
     * @param entity TipoPermissao
     * @return TipoPermissaoVo
     */
    public static TipoPermissaoVo convertToVo(TipoPermissao entity) {
        TipoPermissaoVo vo = null;
        if (entity != null) {
            vo = new TipoPermissaoVo();
            vo.setId(entity.getId());
            vo.setDescricao(entity.getDescricao());

        }
        return vo;
    }

    /**
     * Converte uma lista de TipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<TipoPermissao>
     * @return List<TipoPermissaoVo>
     */
    public static List<TipoPermissaoVo> convertToListVo(List<TipoPermissao> listEntity) {
        List<TipoPermissaoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (TipoPermissao entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o TipoPermissaoVo para TipoPermissao
     *
     * @param vo TipoPermissaoVo
     * @return TipoPermissao
     */
    public static TipoPermissao convertToEntity(TipoPermissaoVo vo) {
        TipoPermissao entity = null;
        if (vo != null) {
            entity = new TipoPermissao();
            entity.setId(vo.getId());
            entity.setDescricao(vo.getDescricao());
        }
        return entity;
    }

    /**
     * Converte uma lista de TipoPermissaoVos para uma lista de TipoPermissaos
     *
     * @param listVo List<TipoPermissaoVo>
     * @return List<TipoPermissao>
     */
    public static List<TipoPermissao> convertToListEntity(List<TipoPermissaoVo> listVo) {
        List<TipoPermissao> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (TipoPermissaoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }

}
