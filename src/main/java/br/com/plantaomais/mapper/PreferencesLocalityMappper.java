package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.PreferencesLocality;
import br.com.plantaomais.vo.PreferencesLocalityVo;

import java.util.List;
import java.util.stream.Collectors;

public class PreferencesLocalityMappper {


    public static PreferencesLocality convertToEntity(PreferencesLocalityVo vo) {

        if (vo == null) return null;

        PreferencesLocality entity = new PreferencesLocality();

        entity.setId(vo.getId());
        entity.setCapital(vo.getCapital());
        entity.setCoastal(vo.getCoastal());
        entity.setCountryside(vo.getCountryside());
        entity.setState(StateMapper.convertToEntity(vo.getState()));

        return entity;
    }


    public static PreferencesLocalityVo convertToVo(PreferencesLocality entity) {

        if (entity == null) return null;

        PreferencesLocalityVo vo = new PreferencesLocalityVo();

        vo.setId(entity.getId());
        vo.setCapital(entity.getCapital());
        vo.setCoastal(entity.getCoastal());
        vo.setCountryside(entity.getCountryside());
        vo.setState(StateMapper.convertToVo(entity.getState()));

        return vo;
    }


    public static List<PreferencesLocality> convertToListEntity(List<PreferencesLocalityVo> listVo) {

        if (listVo == null) return null;

        return listVo.stream()
                .map(PreferencesLocalityMappper::convertToEntity)
                .collect(Collectors.toList());
    }


    public static List<PreferencesLocalityVo> convertToListVo(List<PreferencesLocality> entities) {

        if (entities == null) return null;

        return entities.stream()
                .map(PreferencesLocalityMappper::convertToVo)
                .collect(Collectors.toList());
    }
}
