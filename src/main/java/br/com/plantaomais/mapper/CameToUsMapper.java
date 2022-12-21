package br.com.plantaomais.mapper;


import br.com.plantaomais.entitybean.CameToUs;
import br.com.plantaomais.entitybean.PaymentData;
import br.com.plantaomais.vo.CameToUsVo;
import br.com.plantaomais.vo.PaymentDataVo;

import java.util.ArrayList;
import java.util.List;

public class CameToUsMapper {

    public static CameToUsVo convertToVo(CameToUs entity) {
        CameToUsVo vo = null;
        if (entity != null) {
            vo = new CameToUsVo();
            vo.setId(entity.getId());
            vo.setGoogleOrSite(setFalseIfNull(entity.getGoogleOrSite()));
            vo.setRecruitment(setFalseIfNull(entity.getRecruitment()));
            vo.setColleagueIndication(setFalseIfNull(entity.getColleagueIndication()));
            vo.setProvideServiceAtWork(setFalseIfNull(entity.getProvideServiceAtWork()));
            vo.setSocialMedia(setFalseIfNull(entity.getSocialMedia()));
            vo.setOther(setFalseIfNull(entity.getOther()));
            vo.setRecruiterName(entity.getRecruiterName());
            vo.setOtherDescription(entity.getOtherDescription());
        }
        return vo;
    }

    public static List<CameToUsVo> convertToListVo(List<CameToUs> listEntity) {
        List<CameToUsVo> listVo = new ArrayList<>();
        if (listEntity != null) {
            for (CameToUs entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    public static CameToUs convertToEntity(CameToUsVo vo) {
        CameToUs entity = null;
        if (vo != null) {
            entity = new CameToUs();
            entity.setId(vo.getId());
            entity.setGoogleOrSite(setFalseIfNull(vo.getGoogleOrSite()));
            entity.setRecruitment(setFalseIfNull(vo.getRecruitment()));
            entity.setColleagueIndication(setFalseIfNull(vo.getColleagueIndication()));
            entity.setProvideServiceAtWork(setFalseIfNull(vo.getProvideServiceAtWork()));
            entity.setSocialMedia(setFalseIfNull(vo.getSocialMedia()));
            entity.setOther(setFalseIfNull(vo.getOther()));
            entity.setRecruiterName(vo.getRecruiterName());
            entity.setOtherDescription(vo.getOtherDescription());
        }
        return entity;
    }

    public static List<CameToUs> convertToListEntity(List<CameToUsVo> listVo) {
        List<CameToUs> listEntity = new ArrayList<>();
        if (listVo != null) {
            for (CameToUsVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }

    private static Boolean setFalseIfNull(Boolean bool) {
        if (bool == null) {
            return false;
        }
        return bool;
    }
}
