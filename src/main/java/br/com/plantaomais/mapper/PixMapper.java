package br.com.plantaomais.mapper;


import br.com.plantaomais.entitybean.Pix;
import br.com.plantaomais.vo.PixVo;

import java.util.ArrayList;
import java.util.List;

public class PixMapper {

    public static PixVo convertToVo(Pix entity) {
        PixVo vo = null;
        if (entity != null) {
            vo = new PixVo();
            vo.setId(entity.getId());
            vo.setPixKey(entity.getPixKey());
            vo.setPixKeyType(entity.getPixKeyType());
        }
        return vo;
    }

    public static List<PixVo> convertToListVo(List<Pix> listEntity) {
        List<PixVo> listVo = new ArrayList<>();
        if (listEntity != null) {
            for (Pix entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    public static Pix convertToEntity(PixVo vo) {
        Pix entity = null;
        if (vo != null) {
            entity = new Pix();
            entity.setId(vo.getId());
            entity.setPixKey(vo.getPixKey());
            entity.setPixKeyType(vo.getPixKeyType());
        }
        return entity;
    }

    public static List<Pix> convertToListEntity(List<PixVo> listVo) {
        List<Pix> listEntity = new ArrayList<>();
        if (listVo != null) {
            for (PixVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
