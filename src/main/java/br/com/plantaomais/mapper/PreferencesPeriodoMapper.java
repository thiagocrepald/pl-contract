package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.PreferencesPeriodo;
import br.com.plantaomais.vo.PreferencesPeriodoVo;

public class PreferencesPeriodoMapper {

    public static PreferencesPeriodo convertToEntity(PreferencesPeriodoVo vo) {

        if (vo == null) return null;

        PreferencesPeriodo entity = new PreferencesPeriodo();

        entity.setId(vo.getId());
        entity.setManha(vo.getManha());
        entity.setTarde(vo.getTarde());
        entity.setNoite(vo.getNoite());
        entity.setCinderela(vo.getCinderela());

        return entity;
    }

    public static PreferencesPeriodoVo convertToVo(PreferencesPeriodo entity) {

        if (entity == null) return null;

        PreferencesPeriodoVo vo = new PreferencesPeriodoVo();

        vo.setId(entity.getId());
        vo.setManha(entity.getManha());
        vo.setTarde(entity.getTarde());
        vo.setNoite(entity.getNoite());
        vo.setCinderela(entity.getCinderela());

        return vo;
    }
}
