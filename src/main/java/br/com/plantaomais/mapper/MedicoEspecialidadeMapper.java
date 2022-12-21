package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.MedicoEspecialidade;
import br.com.plantaomais.vo.MedicoEspecialidadeVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class MedicoEspecialidadeMapper {
    /**
     * Convert an entity to MedicoEspecialidadeVo
     *
     * @param entity MedicoEspecialidade
     * @return MedicoEspecialidadeVo
     */
    public static MedicoEspecialidadeVo convertToVo(MedicoEspecialidade entity) {
        MedicoEspecialidadeVo vo = null;
        if (entity != null) {
            vo = new MedicoEspecialidadeVo();
            vo.setId(entity.getId());
            vo.setMedico(MedicoMapper.convertToVo(entity.getMedico()));
            vo.setEspecialidade(EspecialidadeMapper.convertToVo(entity.getEspecialidade()));

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<MedicoEspecialidade>
     * @return List<MedicoEspecialidadeVo>
     */
    public static List<MedicoEspecialidadeVo> convertToListVo(List<MedicoEspecialidade> listEntity) {
        List<MedicoEspecialidadeVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (MedicoEspecialidade entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o MedicoEspecialidadeVo para MedicoEspecialidade
     *
     * @param vo MedicoEspecialidadeVo
     * @return MedicoEspecialidade
     */
    public static MedicoEspecialidade convertToEntity(MedicoEspecialidadeVo vo) {
        MedicoEspecialidade entity = null;
        if (vo != null) {
            entity = new MedicoEspecialidade();
            entity.setId(vo.getId());
            entity.setMedico(MedicoMapper.convertToEntity(vo.getMedico()));
            entity.setEspecialidade(EspecialidadeMapper.convertToEntity(vo.getEspecialidade()));
        }
        return entity;
    }

    /**
     * Converte uma lista de UsuarioAppEspecialidadeVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<MedicoEspecialidadeVo>
     * @return List<MedicoEspecialidade>
     */
    public static List<MedicoEspecialidade> convertToListEntity(List<MedicoEspecialidadeVo> listVo) {
        List<MedicoEspecialidade> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (MedicoEspecialidadeVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
    
}
