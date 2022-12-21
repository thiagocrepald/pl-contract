package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Setor;
import br.com.plantaomais.vo.SetorVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class SetorMapper {
    /**
     * Convert an entity to SetorVo
     *
     * @param entity Setor
     * @return SetorVo
     */
    public static SetorVo convertToVo(Setor entity) {
        SetorVo vo = null;
        if (entity != null) {
            vo = new SetorVo();
            vo.setId(entity.getId());
            vo.setDescricao(entity.getDescricao());

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<Setor>
     * @return List<SetorVo>
     */
    public static List<SetorVo> convertToListVo(List<Setor> listEntity) {
        List<SetorVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Setor entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o SetorVo para Setor
     *
     * @param vo SetorVo
     * @return Setor
     */
    public static Setor convertToEntity(SetorVo vo) {
        Setor entity = null;
        if (vo != null) {
            entity = new Setor();
            entity.setId(vo.getId());
            entity.setDescricao(vo.getDescricao());
        }
        return entity;
    }

    /**
     * Converte uma lista de SetorVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<SetorVo>
     * @return List<Setor>
     */
    public static List<Setor> convertToListEntity(List<SetorVo> listVo) {
        List<Setor> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (SetorVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
