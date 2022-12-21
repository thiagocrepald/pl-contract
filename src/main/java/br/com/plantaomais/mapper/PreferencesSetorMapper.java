package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.PreferencesSetor;
import br.com.plantaomais.vo.PreferencesSetorVo;

public class PreferencesSetorMapper {

    public static PreferencesSetor convertToEntity(PreferencesSetorVo vo) {

        if (vo == null) return null;

        PreferencesSetor entity = new PreferencesSetor();

        entity.setId(vo.getId());
        entity.setConsultorio(vo.getConsultorio());
        entity.setEmergencia(vo.getEmergencia());
        entity.setObservacao(vo.getObservacao());
        entity.setPediatria(vo.getPediatria());

        return entity;
    }

    public static PreferencesSetorVo convertToVo(PreferencesSetor entity) {

        if (entity == null) return null;

        PreferencesSetorVo vo = new PreferencesSetorVo();

        vo.setId(entity.getId());
        vo.setConsultorio(entity.getConsultorio());
        vo.setEmergencia(entity.getEmergencia());
        vo.setObservacao(entity.getObservacao());
        vo.setPediatria(entity.getPediatria());

        return vo;
    }
}
