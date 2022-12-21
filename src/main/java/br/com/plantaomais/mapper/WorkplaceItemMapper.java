package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.WorkplaceItem;
import br.com.plantaomais.vo.WorkplaceItemVo;

/**
 * Created by nextage on 04/06/2019.
 */
public class WorkplaceItemMapper {

    public static WorkplaceItem convertToEntity(WorkplaceItemVo vo) {
        WorkplaceItem entity = null;
        if (vo != null) {
            entity = new WorkplaceItem();
            entity.setId(vo.getId());
            entity.setItem(vo.getItem());
        }
        return entity;
    }

    public static WorkplaceItemVo convertToVo(WorkplaceItem entity) {
        WorkplaceItemVo vo = null;
        if (entity != null) {
            vo = new WorkplaceItemVo();
            vo.setId(entity.getId());
            vo.setItem(entity.getItem());
        }
        return vo;
    }

}
