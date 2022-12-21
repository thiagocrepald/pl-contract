package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Contract;
import br.com.plantaomais.vo.ContratoVo;
import br.com.plantaomais.vo.aplicativo.ContratoCalendarioVo;

import java.util.Optional;
import java.util.stream.Collectors;

public class ContratoMapper {

    public static ContratoCalendarioVo convertToCalendarioVo(Contract entity) {
        ContratoCalendarioVo vo = null;
        if (entity != null) {
            vo = new ContratoCalendarioVo();
            vo.setId(entity.getId().intValue());
            vo.setLocal(entity.getContractingParty() != null ? entity.getContractingParty().getName() : entity.getResultsCenter());
            vo.setWorkplaces(
                    entity.getWorkplaces()
                            .stream()
                            .map(WorkPlaceMapper::convertToSimpleVo)
                            .collect(Collectors.toList())
            );

            // TODO
//            AuditoriaMapper.preencheVo(vo, entity);
        }
        return vo;
    }

    public static ContratoVo convertToVo(Contract entity) {
        ContratoVo vo = null;
        if (entity != null) {
            vo = new ContratoVo();
            vo.setId(entity.getId());
            vo.setSankhyaCode(entity.getSankhyaCode());
            ContratoVo finalVo = vo;
            Optional.ofNullable(entity.getResultsCenter()).ifPresentOrElse(it -> {
                finalVo.setCodigo(entity.getResultsCenter() + " / " + entity.getSankhyaCode().toString());
            }, () -> {
                finalVo.setCodigo(entity.getSankhyaCode().toString());
            });
            finalVo.setNotes(entity.getNotes());

            // TODO
//            AuditoriaMapper.preencheVo(vo, entity);
        }
        return vo;
    }

    public static Contract convertToEntity(ContratoVo vo) {
        Contract entity = null;
        if (vo != null) {
            entity = new Contract();
            entity.setId(vo.getId());
        }
        return entity;
    }

}
