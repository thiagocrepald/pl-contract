package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.EscalaPlantao;
import br.com.plantaomais.vo.EscalaPlantaoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 09/05/2019.
 */
public class EscalaPlantaoMapper {
    /**
     * Convert an entity to EscalaPlantaoVo
     *
     * @param entity EscalaPlantao
     * @return EscalaPlantaoVo
     */
    public static EscalaPlantaoVo convertToVo(EscalaPlantao entity) {
        EscalaPlantaoVo vo = null;
        if (entity != null) {
            vo = new EscalaPlantaoVo();
            vo.setId(entity.getId());
            vo.setEscala(EscalaMapper.convertToVo(entity.getEscala()));
            vo.setPlantao(PlantaoMapper.convertToVo(entity.getPlantao()));

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<EscalaPlantao>
     * @return List<EscalaPlantaoVo>
     */
    public static List<EscalaPlantaoVo> convertToListVo(List<EscalaPlantao> listEntity) {
        List<EscalaPlantaoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (EscalaPlantao entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o EscalaPlantaoVo para EscalaPlantao
     *
     * @param vo EscalaPlantaoVo
     * @return EscalaPlantao
     */
    public static EscalaPlantao convertToEntity(EscalaPlantaoVo vo) {
        EscalaPlantao entity = null;
        if (vo != null) {
            entity = new EscalaPlantao();
            entity.setId(vo.getId());
            entity.setEscala(EscalaMapper.convertToEntity(vo.getEscala()));
            entity.setPlantao(PlantaoMapper.convertToEntity(vo.getPlantao()));
        }
        return entity;
    }

    /**
     * Converte uma lista de EscalaPlantaoVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<EscalaPlantaoVo>
     * @return List<EscalaPlantao>
     */
    public static List<EscalaPlantao> convertToListEntity(List<EscalaPlantaoVo> listVo) {
        List<EscalaPlantao> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (EscalaPlantaoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }


}
