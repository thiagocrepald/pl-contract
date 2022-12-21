package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.PreferencesMedic;
import br.com.plantaomais.vo.PreferencesMedicVo;

public class PreferencesMedicMapper {

    public static PreferencesMedic convertToEntity(PreferencesMedicVo vo) {

        if (vo == null) return null;

        PreferencesMedic entity = new PreferencesMedic();
        entity.setId(vo.getId());

        entity.setPreferencesPeriodo(
            PreferencesPeriodoMapper.convertToEntity(
                vo.getPreferencesPeriodo()));

        entity.setPreferencesSetor(
            PreferencesSetorMapper.convertToEntity(
                vo.getPreferencesSetor()));

        entity.setPreferencesWeekday(
            PreferencesWeekdayMapper.convertToEntity(
                vo.getPreferencesWeekday()));

        return entity;
    }

    public static PreferencesMedicVo convertToVo(PreferencesMedic entity) {

        if (entity == null) return null;

        PreferencesMedicVo vo = new PreferencesMedicVo();
        vo.setId(entity.getId());

        vo.setPreferencesPeriodo(
            PreferencesPeriodoMapper.convertToVo(
                entity.getPreferencesPeriodo()));

        vo.setPreferencesSetor(
            PreferencesSetorMapper.convertToVo(
                entity.getPreferencesSetor()));

        vo.setPreferencesWeekday(
            PreferencesWeekdayMapper.convertToVo(
                entity.getPreferencesWeekday()));

        return vo;
    }

}
