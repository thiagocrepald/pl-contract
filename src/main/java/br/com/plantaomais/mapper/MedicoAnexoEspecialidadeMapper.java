package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.MedicoAnexoEspecialidade;
import br.com.plantaomais.vo.MedicoAnexoEspecialidadeVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 19/06/2019.
 */
public class MedicoAnexoEspecialidadeMapper {
    /**
     * Convert an entity to MedicoAnexoEspecialidadeVo
     *
     * @param entity MedicoAnexoEspecialidade
     * @return MedicoAnexoEspecialidadeVo
     */
    public static MedicoAnexoEspecialidadeVo convertToVo(MedicoAnexoEspecialidade entity) {
        MedicoAnexoEspecialidadeVo vo = null;
        if (entity != null) {
            vo = new MedicoAnexoEspecialidadeVo();
            vo.setId(entity.getId());
            vo.setMedicoAnexo(MedicoAnexoMapper.convertToVo(entity.getMedicoAnexo()));
            vo.setEspecialidade(EspecialidadeMapper.convertToVo(entity.getEspecialidade()));

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<MedicoAnexoEspecialidade>
     * @return List<MedicoAnexoEspecialidadeVo>
     */
    public static List<MedicoAnexoEspecialidadeVo> convertToListVo(List<MedicoAnexoEspecialidade> listEntity) {
        List<MedicoAnexoEspecialidadeVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (MedicoAnexoEspecialidade entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o MedicoAnexoEspecialidadeVo para MedicoAnexoEspecialidade
     *
     * @param vo MedicoAnexoEspecialidadeVo
     * @return MedicoAnexoEspecialidade
     */
    public static MedicoAnexoEspecialidade convertToEntity(MedicoAnexoEspecialidadeVo vo) {
        MedicoAnexoEspecialidade entity = null;
        if (vo != null) {
            entity = new MedicoAnexoEspecialidade();
            entity.setId(vo.getId());
            entity.setMedicoAnexo(MedicoAnexoMapper.convertToEntity(vo.getMedicoAnexo()));
            entity.setEspecialidade(EspecialidadeMapper.convertToEntity(vo.getEspecialidade()));

        }
        return entity;
    }

    /**
     * Converte uma lista de MedicoAnexoEspecialidadeVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<MedicoAnexoEspecialidadeVo>
     * @return List<MedicoAnexoEspecialidade>
     */
    public static List<MedicoAnexoEspecialidade> convertToListEntity(List<MedicoAnexoEspecialidadeVo> listVo) {
        List<MedicoAnexoEspecialidade> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (MedicoAnexoEspecialidadeVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
    
}
