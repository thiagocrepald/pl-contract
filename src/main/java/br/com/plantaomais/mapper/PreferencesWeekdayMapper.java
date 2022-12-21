package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.PreferencesWeekday;
import br.com.plantaomais.vo.PreferencesWeekdayVo;

public class PreferencesWeekdayMapper {

    public static PreferencesWeekday convertToEntity(PreferencesWeekdayVo vo) {

        if (vo == null) return null;

        PreferencesWeekday entity = new PreferencesWeekday();

        entity.setId(vo.getId());
        entity.setMonday(vo.getMonday());
        entity.setTuesday(vo.getTuesday());
        entity.setWednesday(vo.getWednesday());
        entity.setThursday(vo.getThursday());
        entity.setFriday(vo.getFriday());
        entity.setSaturday(vo.getSaturday());
        entity.setSunday(vo.getSunday());

        return entity;
    }

    public static PreferencesWeekdayVo convertToVo(PreferencesWeekday entity) {

        if (entity == null) return null;

        PreferencesWeekdayVo vo = new PreferencesWeekdayVo();

        vo.setId(entity.getId());
        vo.setMonday(entity.getMonday());
        vo.setTuesday(entity.getTuesday());
        vo.setWednesday(entity.getWednesday());
        vo.setThursday(entity.getThursday());
        vo.setFriday(entity.getFriday());
        vo.setSaturday(entity.getSaturday());
        vo.setSunday(entity.getSunday());

        return vo;
    }
}
