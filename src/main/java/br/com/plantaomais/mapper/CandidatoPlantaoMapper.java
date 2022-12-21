package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.CandidatoPlantao;
import br.com.plantaomais.vo.CandidatoPlantaoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Matheus Toledo
 */
public class CandidatoPlantaoMapper {

    /*
     **
     * Convert CandidatoPlantao para CandidatoPlantaoVo
     *
     * @param entity CandidatoPlantao
     * @return CandidatoPlantaoVo
     */
    public static CandidatoPlantaoVo convertToVo(CandidatoPlantao entity) {
        CandidatoPlantaoVo vo = null;
        if (entity != null) {
            vo = new CandidatoPlantaoVo();
            vo.setId(entity.getId());
            vo.setPlantao(PlantaoMapper.convertToVo(entity.getPlantao()));
            vo.setMedico(MedicoMapper.convertToVo(entity.getMedico()));
            vo.setDataCandidatura(entity.getDataCandidatura());
            vo.setAceito(entity.getAceito());
            vo.setDoacao(entity.getDoacao());
            vo.setCancelado(entity.getCancelado());

            AuditoriaMapper.preencheVo(vo, entity);
        }
        return vo;
    }

    /**
     * Converte uma lista de CandidatoPlantao para uma lista de VOs
     *
     * @param listEntity List<Contrato>
     * @return List<CandidatoPlantaoVo>
     */
    public static List<CandidatoPlantaoVo> convertToListVo(List<CandidatoPlantao> listEntity) {
        List<CandidatoPlantaoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (CandidatoPlantao entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }
        return listVo;
    }

    /**
     * Converte CandidatoPlantaoVo para CandidatoPlantao
     *
     * @param vo CandidatoPlantaoVo
     * @return CandidatoPlantao
     */
    public static CandidatoPlantao convertToEntity(CandidatoPlantaoVo vo) {
        CandidatoPlantao entity = null;
        if (vo != null) {
            entity = new CandidatoPlantao();
            entity.setId(vo.getId());
            entity.setPlantao(PlantaoMapper.convertToEntity(vo.getPlantao()));
            entity.setMedico(MedicoMapper.convertToEntity(vo.getMedico()));
            entity.setDataCandidatura(vo.getDataCandidatura());
            entity.setAceito(vo.getAceito());
            entity.setDoacao(vo.getDoacao());
            entity.setCancelado(vo.getCancelado());

            AuditoriaMapper.preencheEntity(entity, vo);
        }
        return entity;
    }

    /**
     * Converte uma lista de CandidatoPlantaoVo para uma lista de CandidatoPlantao
     *
     * @param listVo List<CandidatoPlantaoVo>
     * @return List<CandidatoPlantao>
     */
    public static List<CandidatoPlantao> convertToListEntity(List<CandidatoPlantaoVo> listVo) {
        List<CandidatoPlantao> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (CandidatoPlantaoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
