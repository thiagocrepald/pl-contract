package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.MedicoCurso;
import br.com.plantaomais.vo.MedicoCursoVo;

import java.util.ArrayList;
import java.util.List;

public class MedicoCursoMapper {

    public static MedicoCursoVo convertToSimpleVo(MedicoCurso entity) {
        MedicoCursoVo vo = null;
        if (entity != null) {
            vo = new MedicoCursoVo();
            vo.setId(entity.getId());
            vo.setCurso(CursoMapper.convertToVo(entity.getCurso()));
            vo.setDataVencimento(entity.getDataVencimento());

        }
        return vo;
    }

    public static MedicoCursoVo convertToVo(MedicoCurso entity) {
        MedicoCursoVo vo = null;
        if (entity != null) {
            vo = new MedicoCursoVo();
            vo.setId(entity.getId());
            // vo.setMedico(MedicoMapper.convertToSimpleVo(entity.getMedico()));
            vo.setCurso(CursoMapper.convertToVo(entity.getCurso()));
            vo.setDataVencimento(entity.getDataVencimento());

        }
        return vo;
    }

    public static List<MedicoCursoVo> convertToListVo(List<MedicoCurso> listEntity) {
        List<MedicoCursoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (MedicoCurso entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    public static MedicoCurso convertToEntity(MedicoCursoVo vo) {
        MedicoCurso entity = null;
        if (vo != null) {
            entity = new MedicoCurso();
            entity.setId(vo.getId());
            entity.setMedico(MedicoMapper.convertToEntity(vo.getMedico()));
            entity.setCurso(CursoMapper.convertToEntity(vo.getCurso()));
            entity.setDataVencimento(vo.getDataVencimento());
        }
        return entity;
    }

    public static List<MedicoCurso> convertToListEntity(List<MedicoCursoVo> listVo) {
        List<MedicoCurso> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (MedicoCursoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
    
}
