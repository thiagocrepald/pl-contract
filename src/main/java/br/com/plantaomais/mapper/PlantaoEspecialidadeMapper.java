package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.PlantaoEspecialidade;
import br.com.plantaomais.vo.PlantaoEspecialidadeVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class PlantaoEspecialidadeMapper {
    /**
     * Convert an entity to PlantaoEspecialidadeVo
     *
     * @param entity PlantaoEspecialidade
     * @return PlantaoEspecialidadeVo
     */
    public static PlantaoEspecialidadeVo convertToVo(PlantaoEspecialidade entity) {
        PlantaoEspecialidadeVo vo = null;
        if (entity != null) {
            vo = new PlantaoEspecialidadeVo();
            vo.setId(entity.getId());
            vo.setPlantao(PlantaoMapper.convertToVo(entity.getPlantao()));
            vo.setEspecialidade(EspecialidadeMapper.convertToVo(entity.getEspecialidade()));

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<PlantaoEspecialidade>
     * @return List<PlantaoEspecialidadeVo>
     */
    public static List<PlantaoEspecialidadeVo> convertToListVo(List<PlantaoEspecialidade> listEntity) {
        List<PlantaoEspecialidadeVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (PlantaoEspecialidade entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o PlantaoEspecialidadeVo para PlantaoEspecialidade
     *
     * @param vo PlantaoEspecialidadeVo
     * @return PlantaoEspecialidade
     */
    public static PlantaoEspecialidade convertToEntity(PlantaoEspecialidadeVo vo) {
        PlantaoEspecialidade entity = null;
        if (vo != null) {
            entity = new PlantaoEspecialidade();
            entity.setId(vo.getId());
            entity.setPlantao(PlantaoMapper.convertToEntity(vo.getPlantao()));
            entity.setEspecialidade(EspecialidadeMapper.convertToEntity(vo.getEspecialidade()));
        }
        return entity;
    }

    /**
     * Converte uma lista de PlantaoEspecialidadeVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<PlantaoEspecialidadeVo>
     * @return List<PlantaoEspecialidade>
     */
    public static List<PlantaoEspecialidade> convertToListEntity(List<PlantaoEspecialidadeVo> listVo) {
        List<PlantaoEspecialidade> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (PlantaoEspecialidadeVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
    
}
