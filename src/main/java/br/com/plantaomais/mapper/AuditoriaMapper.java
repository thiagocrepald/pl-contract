package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Auditoria;
import br.com.plantaomais.vo.AuditoriaVo;

/**
 * Created by Alyson
 * on 19/08/2016.
 */
public class AuditoriaMapper {

    public static void preencheVo(AuditoriaVo vo, Auditoria entity) {
        if (entity != null) {
            if (vo == null) {
                vo = new AuditoriaVo();
            }
            vo.setDataUsuarioAlt(entity.getDataUsuarioAlt());
            vo.setDataUsuarioDel(entity.getDataUsuarioDel());
            vo.setDataUsuarioInc(entity.getDataUsuarioInc());
            vo.setExcluido(entity.getExcluido());
            vo.setUsuarioAlt(entity.getUsuarioAlt());
            vo.setUsuarioDel(entity.getUsuarioDel());
            vo.setUsuarioInc(entity.getUsuarioInc());
        }
    }

    public static void preencheEntity(Auditoria entity, AuditoriaVo vo) {
        if (vo != null) {
            if (entity == null) {
                entity = new Auditoria();
            }
            entity.setDataUsuarioAlt(vo.getDataUsuarioAlt());
            entity.setDataUsuarioDel(vo.getDataUsuarioDel());
            entity.setDataUsuarioInc(vo.getDataUsuarioInc());
            entity.setExcluido(vo.isExcluido());
            entity.setUsuarioAlt(vo.getUsuarioAlt());
            entity.setUsuarioDel(vo.getUsuarioDel());
            entity.setUsuarioInc(vo.getUsuarioInc());
        }
    }
}
