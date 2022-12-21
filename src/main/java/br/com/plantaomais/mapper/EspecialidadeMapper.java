package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.vo.EspecialidadeVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class EspecialidadeMapper {
    /**
     * Convert an entity to EspecialidadeVo
     *
     * @param entity EspecialidadeApi
     * @return EspecialidadeVo
     */
    public static EspecialidadeVo convertToVo(Especialidade entity) {
        EspecialidadeVo vo = null;
        if (entity != null) {
            vo = new EspecialidadeVo();
            vo.setId(entity.getId());
            vo.setDescricao(entity.getDescricao());

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<EspecialidadeApi>
     * @return List<EspecialidadeVo>
     */
    public static List<EspecialidadeVo> convertToListVo(List<Especialidade> listEntity) {
        List<EspecialidadeVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Especialidade entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o EspecialidadeVo para EspecialidadeApi
     *
     * @param vo EspecialidadeVo
     * @return EspecialidadeApi
     */
    public static Especialidade convertToEntity(EspecialidadeVo vo) {
        Especialidade entity = null;
        if (vo != null) {
            entity = new Especialidade();
            entity.setId(vo.getId());
            entity.setDescricao(vo.getDescricao());
        }
        return entity;
    }

    /**
     * Converte uma lista de EspecialidadeVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<EspecialidadeVo>
     * @return List<EspecialidadeApi>
     */
    public static List<Especialidade> convertToListEntity(List<EspecialidadeVo> listVo) {
        List<Especialidade> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (EspecialidadeVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
