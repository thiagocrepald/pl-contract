package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Workplace;
import br.com.plantaomais.vo.WorkplaceSimpleVo;

public class WorkPlaceMapper {

    public static WorkplaceSimpleVo convertToSimpleVo(Workplace entity) {
        WorkplaceSimpleVo vo = null;
        if (entity != null) {
            vo = new WorkplaceSimpleVo();
            vo.setId(entity.getId().intValue());
            vo.setUnitName(entity.getUnitName());
        }
        return vo;
    }

    public static Workplace convertToEntity(WorkplaceSimpleVo vo) {
        Workplace entity = null;
        if (vo != null) {
            entity = new Workplace();
            entity.setId(vo.getId().longValue());
            entity.setUnitName(vo.getUnitName());
        }
        return entity;
    }


}
