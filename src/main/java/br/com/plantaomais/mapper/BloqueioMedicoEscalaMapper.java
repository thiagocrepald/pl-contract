package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.BloqueioMedicoEscala;
import br.com.plantaomais.vo.BloqueioMedicoEscalaVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 17/07/2019.
 */
public class BloqueioMedicoEscalaMapper {
    /**
     * Convert an entity to BloqueioMedicoEscalaVo
     *
     * @param entity BloqueioMedicoEscala
     * @return BloqueioMedicoEscalaVo
     */
    public static BloqueioMedicoEscalaVo convertToVo(BloqueioMedicoEscala entity) {
        BloqueioMedicoEscalaVo vo = null;
        if (entity != null) {
            vo = new BloqueioMedicoEscalaVo();
            vo.setId(entity.getId());
            vo.setMedico(MedicoMapper.convertToVo(entity.getMedico()));
            vo.setEscala(EscalaMapper.convertToVo(entity.getEscala()));

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<BloqueioMedicoEscala>
     * @return List<BloqueioMedicoEscalaVo>
     */
    public static List<BloqueioMedicoEscalaVo> convertToListVo(List<BloqueioMedicoEscala> listEntity) {
        List<BloqueioMedicoEscalaVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (BloqueioMedicoEscala entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o BloqueioMedicoEscalaVo para BloqueioMedicoEscala
     *
     * @param vo BloqueioMedicoEscalaVo
     * @return BloqueioMedicoEscala
     */
    public static BloqueioMedicoEscala convertToEntity(BloqueioMedicoEscalaVo vo) {
        BloqueioMedicoEscala entity = null;
        if (vo != null) {
            entity = new BloqueioMedicoEscala();
            entity.setId(vo.getId());
            entity.setMedico(MedicoMapper.convertToEntity(vo.getMedico()));
            entity.setEscala(EscalaMapper.convertToEntity(vo.getEscala()));
        }
        return entity;
    }

    /**
     * Converte uma lista de UsuarioAppEspecialidadeVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<BloqueioMedicoEscalaVo>
     * @return List<BloqueioMedicoEscala>
     */
    public static List<BloqueioMedicoEscala> convertToListEntity(List<BloqueioMedicoEscalaVo> listVo) {
        List<BloqueioMedicoEscala> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (BloqueioMedicoEscalaVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
