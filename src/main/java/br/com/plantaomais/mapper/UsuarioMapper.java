package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.vo.UsuarioVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Jerry.
 */
public class UsuarioMapper {

    /**
     * Convert an entity to UsuarioVo
     *
     * @param entity Usuario
     * @return UsuarioVo
     */
    public static UsuarioVo convertToVo(Usuario entity) {
        UsuarioVo vo = null;
        if (entity != null) {
            vo = new UsuarioVo();
            vo.setId(entity.getId());
            vo.setDataAlteracaoSenha(entity.getDataAlteracaoSenha());
            vo.setSenha(entity.getSenha());
            vo.setRequisitadoNovaSenha(entity.getRequisitadoNovaSenha());
            vo.setNome(entity.getNome());
            vo.setToken(entity.getToken());
            vo.setLogin(entity.getLogin());
            vo.setDataExpiracaoToken(entity.getDataExpiracaoToken());
            vo.setTelefone(entity.getTelefone());
        }
        return vo;
    }

    /**
     * Converte uma lista de Usuarios para uma lista de VOs
     *
     * @param listEntity List<Usuario>
     * @return List<UsuarioVo>
     */
    public static List<UsuarioVo> convertToListVo(List<Usuario> listEntity) {
        List<UsuarioVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Usuario entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o UsuarioVo para Usuario
     *
     * @param vo UsuarioVo
     * @return Usuario
     */
    public static Usuario convertToEntity(UsuarioVo vo) {
        Usuario entity = null;
        if (vo != null) {
            entity = new Usuario();
            entity.setId(vo.getId());
            entity.setDataAlteracaoSenha(vo.getDataAlteracaoSenha());
            entity.setSenha(vo.getSenha());
            entity.setRequisitadoNovaSenha(vo.getRequisitadoNovaSenha());
            entity.setNome(vo.getNome());
            entity.setToken(vo.getToken());
            entity.setLogin(vo.getLogin());
            entity.setDataExpiracaoToken(vo.getDataExpiracaoToken());
            entity.setTelefone(vo.getTelefone());
            AuditoriaMapper.preencheEntity(entity, vo);
        }
        return entity;
    }

    /**
     * Converte uma lista de UsuarioVos para uma lista de Usuarios
     *
     * @param listVo List<UsuarioVo>
     * @return List<Usuario>
     */
    public static List<Usuario> convertToListEntity(List<UsuarioVo> listVo) {
        List<Usuario> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (UsuarioVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }


}
