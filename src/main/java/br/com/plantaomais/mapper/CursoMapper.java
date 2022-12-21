package br.com.plantaomais.mapper;


import br.com.plantaomais.entitybean.Curso;
import br.com.plantaomais.vo.CursoVo;

import java.util.ArrayList;
import java.util.List;

public class CursoMapper {

    public static CursoVo convertToVo(Curso entity) {
        CursoVo vo = null;

        if (entity != null) {
            vo = new CursoVo();
            vo.setId(entity.getId());
            vo.setNome(entity.getNome());

        }
        return vo;
    }

    public static List<CursoVo> convertToListVo(List<Curso> listEntity) {
        List<CursoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Curso entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    public static Curso convertToEntity(CursoVo vo) {
        Curso entity = null;
        if (vo != null) {
            entity = new Curso();
            entity.setId(vo.getId());
            entity.setNome(vo.getNome());
        }
        return entity;
    }

    public static List<Curso> convertToListEntity(List<CursoVo> listVo) {
        List<Curso> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (CursoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
