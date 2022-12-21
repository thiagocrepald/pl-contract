package br.com.plantaomais.mapper;


import br.com.plantaomais.entitybean.PaymentData;
import br.com.plantaomais.vo.PaymentDataVo;

import java.util.ArrayList;
import java.util.List;

public class PaymentDataMapper {

    public static PaymentDataVo convertToVo(PaymentData entity) {
        PaymentDataVo vo = null;
        if (entity != null) {
            vo = new PaymentDataVo();
            vo.setId(entity.getId());
            vo.setBank(entity.getBank());
            vo.setAgency(entity.getAgency());
            vo.setType(entity.getPaymentType());
            vo.setCnpj(entity.getCnpj());
            vo.setAccountOwnerName(entity.getAccountOwnerName());
            vo.setBankAccount(entity.getBankAccount());
            vo.setIsCompanyAccount(entity.getIsCompanyAccount());
            vo.setPisNumber(entity.getPisNumber());
            vo.setTransaction(entity.getTransaction());
            vo.setCpf(entity.getCpf());
            vo.setPix(PixMapper.convertToVo(entity.getPix()));
        }
        return vo;
    }

    public static List<PaymentDataVo> convertToListVo(List<PaymentData> listEntity) {
        List<PaymentDataVo> listVo = new ArrayList<>();
        if (listEntity != null) {
            for (PaymentData entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    public static PaymentData convertToEntity(PaymentDataVo vo) {
        PaymentData entity = null;
        if (vo != null) {
            entity = new PaymentData();
            entity.setId(vo.getId());
            entity.setBank(vo.getBank());
            entity.setAgency(vo.getAgency());
            entity.setPaymentType(vo.getType());
            entity.setCnpj(vo.getCnpj());
            entity.setAccountOwnerName(vo.getAccountOwnerName());
            entity.setBankAccount(vo.getBankAccount());
            entity.setIsCompanyAccount(vo.getIsCompanyAccount());
            entity.setPisNumber(vo.getPisNumber());
            entity.setTransaction(vo.getTransaction());
            entity.setCpf(vo.getCpf());
            entity.setPix(PixMapper.convertToEntity(vo.getPix()));
        }
        return entity;
    }

    public static List<PaymentData> convertToListEntity(List<PaymentDataVo> listVo) {
        List<PaymentData> listEntity = new ArrayList<>();
        if (listVo != null) {
            for (PaymentDataVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
