package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.City;
import br.com.plantaomais.vo.CityVo;

import java.util.List;
import java.util.stream.Collectors;

public class CityMapper {

    public static CityVo convertToVo(City entity) {

        if (entity == null) {
            return null;
        }

        CityVo cityVo = new CityVo();

        cityVo.setId(entity.getId());
        cityVo.setName(entity.getName());
        cityVo.setCapital(entity.getCapital());
        cityVo.setCostal(entity.getCoastal());
        cityVo.setState(StateMapper.convertToVo(entity.getState()));

        return cityVo;
    }

    public static List<CityVo> convertToListVo(List<City> listEntity) {

        if (listEntity == null) {
            return null;
        }

        return listEntity.stream()
                .map(CityMapper::convertToVo)
                .collect(Collectors.toList());
    }


    public static City convertToEntity(CityVo vo) {

        if (vo == null) {
            return null;
        }

        City city = new City();

        city.setId(vo.getId());
        city.setName(vo.getName());
        city.setCapital(vo.getCapital());
        city.setCoastal(vo.getCoastal());
        city.setState(StateMapper.convertToEntity(vo.getState()));

        return city;
    }

    public static List<City> convertToListEntity(List<CityVo> listEntity) {

        if (listEntity == null) {
            return null;
        }

        return listEntity.stream()
                .map(CityMapper::convertToEntity)
                .collect(Collectors.toList());
    }
}
