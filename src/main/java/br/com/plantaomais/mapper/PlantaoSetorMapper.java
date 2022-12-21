package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.PlantaoSetor;
import br.com.plantaomais.vo.PlantaoSetorVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class PlantaoSetorMapper {
    /**
     * Convert an entity to PlantaoSetorVo
     *
     * @param entity PlantaoSetor
     * @return PlantaoSetorVo
     */
    public static PlantaoSetorVo convertToVo(PlantaoSetor entity) {
        PlantaoSetorVo vo = null;
        if (entity != null) {
            vo = new PlantaoSetorVo();
            vo.setId(entity.getId());
            vo.setPlantao(PlantaoMapper.convertToVo(entity.getPlantao()));
            vo.setSetor(SetorMapper.convertToVo(entity.getSetor()));

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<PlantaoSetor>
     * @return List<PlantaoSetorVo>
     */
    public static List<PlantaoSetorVo> convertToListVo(List<PlantaoSetor> listEntity) {
        List<PlantaoSetorVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (PlantaoSetor entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o PlantaoSetorVo para PlantaoSetor
     *
     * @param vo PlantaoSetorVo
     * @return PlantaoSetor
     */
    public static PlantaoSetor convertToEntity(PlantaoSetorVo vo) {
        PlantaoSetor entity = null;
        if (vo != null) {
            entity = new PlantaoSetor();
            entity.setId(vo.getId());
            entity.setPlantao(PlantaoMapper.convertToEntity(vo.getPlantao()));
            entity.setSetor(SetorMapper.convertToEntity(vo.getSetor()));
        }
        return entity;
    }

    /**
     * Converte uma lista de PlantaoSetorVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<PlantaoSetorVo>
     * @return List<PlantaoSetor>
     */
    public static List<PlantaoSetor> convertToListEntity(List<PlantaoSetorVo> listVo) {
        List<PlantaoSetor> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (PlantaoSetorVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
    
}
