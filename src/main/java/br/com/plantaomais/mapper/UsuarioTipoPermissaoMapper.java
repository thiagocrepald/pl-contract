package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.UsuarioTipoPermissao;
import br.com.plantaomais.vo.UsuarioTipoPermissaoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 09/05/2019.
 */
public class UsuarioTipoPermissaoMapper {
    /**
     * Convert an entity to UsuarioTipoPermissaoVo
     *
     * @param entity UsuarioTipoPermissao
     * @return UsuarioTipoPermissaoVo
     */
    public static UsuarioTipoPermissaoVo convertToVo(UsuarioTipoPermissao entity) {
        UsuarioTipoPermissaoVo vo = null;
        if (entity != null) {
            vo = new UsuarioTipoPermissaoVo();
            vo.setId(entity.getId());
            vo.setTipoPermissao(TipoPermissaoMapper.convertToVo(entity.getTipoPermissao()));
            vo.setUsuario(UsuarioMapper.convertToVo(entity.getUsuario()));

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<UsuarioTipoPermissao>
     * @return List<UsuarioTipoPermissaoVo>
     */
    public static List<UsuarioTipoPermissaoVo> convertToListVo(List<UsuarioTipoPermissao> listEntity) {
        List<UsuarioTipoPermissaoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (UsuarioTipoPermissao entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o UsuarioTipoPermissaoVo para UsuarioTipoPermissao
     *
     * @param vo UsuarioTipoPermissaoVo
     * @return UsuarioTipoPermissao
     */
    public static UsuarioTipoPermissao convertToEntity(UsuarioTipoPermissaoVo vo) {
        UsuarioTipoPermissao entity = null;
        if (vo != null) {
            entity = new UsuarioTipoPermissao();
            entity.setId(vo.getId());
            entity.setTipoPermissao(TipoPermissaoMapper.convertToEntity(vo.getTipoPermissao()));
            entity.setUsuario(UsuarioMapper.convertToEntity(vo.getUsuario()));
        }
        return entity;
    }

    /**
     * Converte uma lista de UsuarioTipoPermissaoVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<UsuarioTipoPermissaoVo>
     * @return List<UsuarioTipoPermissao>
     */
    public static List<UsuarioTipoPermissao> convertToListEntity(List<UsuarioTipoPermissaoVo> listVo) {
        List<UsuarioTipoPermissao> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (UsuarioTipoPermissaoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }


}
