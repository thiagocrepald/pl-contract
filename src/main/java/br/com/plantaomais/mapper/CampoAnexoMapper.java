package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.CampoAnexo;
import br.com.plantaomais.vo.CampoAnexoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 19/06/2019.
 */
public class CampoAnexoMapper {
    /**
     * Convert an entity to CampoAnexoVo
     *
     * @param entity CampoAnexo
     * @return CampoAnexoVo
     */
    public static CampoAnexoVo convertToVo(CampoAnexo entity) {
        CampoAnexoVo vo = null;
        if (entity != null) {
            vo = new CampoAnexoVo();
            vo.setId(entity.getId());
            vo.setDescricao(entity.getDescricao());
            vo.setOrdem(entity.getOrdem());

        }
        return vo;
    }

    /**
     * Converte uma lista de CampoAnexos para uma lista de VOs
     *
     * @param listEntity List<CampoAnexo>
     * @return List<CampoAnexoVo>
     */
    public static List<CampoAnexoVo> convertToListVo(List<CampoAnexo> listEntity) {
        List<CampoAnexoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (CampoAnexo entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o CampoAnexoVo para CampoAnexo
     *
     * @param vo CampoAnexoVo
     * @return CampoAnexo
     */
    public static CampoAnexo convertToEntity(CampoAnexoVo vo) {
        CampoAnexo entity = null;
        if (vo != null) {
            entity = new CampoAnexo();
            entity.setId(vo.getId());
            entity.setDescricao(vo.getDescricao());
            entity.setOrdem(vo.getOrdem());
        }
        return entity;
    }

    /**
     * Converte uma lista de CampoAnexoVos para uma lista de CampoAnexos
     *
     * @param listVo List<CampoAnexoVo>
     * @return List<CampoAnexo>
     */
    public static List<CampoAnexo> convertToListEntity(List<CampoAnexoVo> listVo) {
        List<CampoAnexo> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (CampoAnexoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
