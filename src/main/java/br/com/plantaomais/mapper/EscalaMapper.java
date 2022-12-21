package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Address;
import br.com.plantaomais.entitybean.Contract;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.Workplace;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.EscalaVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class EscalaMapper {
    /*
     **
     * Convert an entity to EscalaVo
     *
     * @param entity Escala
     * @return EscalaVo
     */
    public static EscalaVo convertToVo(Escala entity) {
        EscalaVo vo = null;
        if (entity != null) {
            vo = new EscalaVo();
            vo.setId(entity.getId());
            vo.setNomeEscala(entity.getNomeEscala());
            vo.setPeriodoInicio(Util.converterDataTimeZone(entity.getPeriodoInicio()));
            vo.setPeriodoFim(Util.converterDataTimeZone(entity.getPeriodoFim()));
            vo.setPrevisaoPagamento(Util.converterDataTimeZone(entity.getPrevisaoPagamento()));
            // TODO
            vo.setContrato(ContratoMapper.convertToVo(entity.getContrato()));
            if(entity.getWorkplace() != null) {
                Workplace workplace = new Workplace();
                workplace.setId(entity.getWorkplace().getId());
                workplace.setUnitName(entity.getWorkplace().getUnitName());
                workplace.setAddress(entity.getWorkplace().getAddress());
                vo.setWorkplace(workplace);
            }
            if (vo.getContrato() != null && entity.getWorkplace() != null && entity.getWorkplace().getAddress() != null) {
                System.out.printf("teste " + entity.getWorkplace().getAddress().getStreet());
                vo.getContrato().setLocal(entity.getWorkplace().getAddress().getStreet());
            }
            vo.setCoordenador(UsuarioMapper.convertToVo(entity.getCoordenador()));
            vo.setAtivo(entity.getAtivo());
            vo.setIsDraft(entity.getIsDraft());
        }
        return vo;
    }

    /**
     * Converte uma lista de Escalas para uma lista de VOs
     *
     * @param listEntity List<Escala>
     * @return List<EscalaVo>
     */
    public static List<EscalaVo> convertToListVo(List<Escala> listEntity) {
        List<EscalaVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Escala entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o EscalaVo para Escala
     *
     * @param vo EscalaVo
     * @return Escala
     */
    public static Escala convertToEntity(EscalaVo vo) {
        Escala entity = null;
        if (vo != null) {
            entity = new Escala();
            entity.setId(vo.getId());
            entity.setNomeEscala(vo.getNomeEscala());
            entity.setPeriodoInicio(vo.getPeriodoInicio());
            entity.setPeriodoFim(vo.getPeriodoFim());
            entity.setPrevisaoPagamento(vo.getPrevisaoPagamento());
            entity.setContrato(ContratoMapper.convertToEntity(vo.getContrato()));
            if(vo.getWorkplace() != null) {
                Workplace workplace = new Workplace();
                workplace.setId(vo.getWorkplace().getId());
                workplace.setUnitName(vo.getWorkplace().getUnitName());
                entity.setWorkplace(workplace);
            }
            if (vo.getContrato() != null) {
                Contract contract = new Contract();
                contract.setId(vo.getContrato().getId());
                contract.setSankhyaCode(vo.getContrato().getSankhyaCode());
                entity.setContrato(contract);
            }
            entity.setCoordenador(UsuarioMapper.convertToEntity(vo.getCoordenador()));
            entity.setAtivo(vo.getAtivo());
            entity.setIsDraft(vo.getIsDraft());
        }
        return entity;
    }

    /**
     * Converte uma lista de EscalaVos para uma lista de Escalas
     *
     * @param listVo List<EscalaVo>
     * @return List<Escala>
     */
    public static List<Escala> convertToListEntity(List<EscalaVo> listVo) {
        List<Escala> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (EscalaVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
