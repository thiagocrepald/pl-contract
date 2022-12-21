package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.MobileVersion;
import br.com.plantaomais.vo.MobileVersionVo;

import java.util.List;
import java.util.stream.Collectors;

public class MobileVersionMapper {

    public static MobileVersionVo convertToVo(MobileVersion entity) {

        if (entity == null) {
            return null;
        }

        MobileVersionVo vo = new MobileVersionVo();

        vo.setId(entity.getId());
        vo.setIosVersion(entity.getIosVersion());
        vo.setAndroidVersion(entity.getAndroidVersion());

        return vo;
    }

    public static List<MobileVersionVo> convertToListVo(List<MobileVersion> listEntity) {

        if (listEntity == null) {
            return null;
        }

        return listEntity.stream()
                .map(MobileVersionMapper::convertToVo)
                .collect(Collectors.toList());
    }


    public static MobileVersion convertToEntity(MobileVersionVo vo) {

        if (vo == null) {
            return null;
        }

        MobileVersion entity = new MobileVersion();

        entity.setId(vo.getId());
        entity.setIosVersion(vo.getIosVersion());
        entity.setAndroidVersion(vo.getAndroidVersion());

        return entity;
    }

    public static List<MobileVersion> convertToListEntity(List<MobileVersionVo> listEntity) {

        if (listEntity == null) {
            return null;
        }

        return listEntity.stream()
                .map(MobileVersionMapper::convertToEntity)
                .collect(Collectors.toList());
    }
}
