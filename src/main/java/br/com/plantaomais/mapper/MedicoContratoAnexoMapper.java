package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.MedicoContratoAnexo;
import br.com.plantaomais.vo.MedicoContratoAnexoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 19/06/2019.
 */
public class MedicoContratoAnexoMapper {
    /**
     * Convert an entity to MedicoContratoAnexoVo
     *
     * @param entity MedicoContratoAnexo
     * @return MedicoContratoAnexoVo
     */
    public static MedicoContratoAnexoVo convertToVo(MedicoContratoAnexo entity) {
        MedicoContratoAnexoVo vo = null;
        if (entity != null) {
            vo = new MedicoContratoAnexoVo();
            vo.setId(entity.getId());
            vo.setMedico(MedicoMapper.convertToVo(entity.getMedico()));
//            vo.setContratoAnexo(ContratoAnexoMapper.convertToVo(entity.getContratoAnexo()));

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<MedicoContratoAnexo>
     * @return List<MedicoContratoAnexoVo>
     */
    public static List<MedicoContratoAnexoVo> convertToListVo(List<MedicoContratoAnexo> listEntity) {
        List<MedicoContratoAnexoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (MedicoContratoAnexo entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o MedicoContratoAnexoVo para MedicoContratoAnexo
     *
     * @param vo MedicoContratoAnexoVo
     * @return MedicoContratoAnexo
     */
    public static MedicoContratoAnexo convertToEntity(MedicoContratoAnexoVo vo) {
        MedicoContratoAnexo entity = null;
        if (vo != null) {
            entity = new MedicoContratoAnexo();
            entity.setId(vo.getId());
            entity.setMedico(MedicoMapper.convertToEntity(vo.getMedico()));
//            entity.setContratoAnexo(ContratoAnexoMapper.convertToEntity(vo.getContratoAnexo()));

        }
        return entity;
    }

    /**
     * Converte uma lista de MedicoContratoAnexoVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<MedicoContratoAnexoVo>
     * @return List<MedicoContratoAnexo>
     */
    public static List<MedicoContratoAnexo> convertToListEntity(List<MedicoContratoAnexoVo> listVo) {
        List<MedicoContratoAnexo> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (MedicoContratoAnexoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
    
}
