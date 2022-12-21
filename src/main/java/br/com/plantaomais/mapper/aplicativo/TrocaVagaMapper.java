package br.com.plantaomais.mapper.aplicativo;

import br.com.plantaomais.entitybean.aplicativo.TrocaVaga;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.vo.aplicativo.TrocaVagaVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 28/06/2019.
 */
public class TrocaVagaMapper {
    /**
     * Converte o TrocaVaga para TrocaVagaVo
     *
     * @param entity TrocaVaga
     * @return TrocaVagaVo
     */
    public static TrocaVagaVo convertToVo(TrocaVaga entity) {
        TrocaVagaVo vo = null;
        if (entity != null) {
            vo = new TrocaVagaVo();
            vo.setId(entity.getId());
            vo.setMedicoRequisitante(MedicoMapper.convertToVo(entity.getMedicoRequisitante()));
            vo.setMedicoVaga(MedicoMapper.convertToVo(entity.getMedicoVaga()));
            vo.setPlantaoRequisitante(PlantaoMapper.convertToVo(entity.getPlantaoRequisitante()));
            vo.setPlantaoVaga(PlantaoMapper.convertToVo(entity.getPlantaoVaga()));
            vo.setTrocaEfetuada(entity.getTrocaEfetuada());
        }
        return vo;
    }

    /**
     * Converte uma lista de TrocaVaga para uma lista de TrocaVagaVos
     *
     * @param listEntity List<TrocaVaga>
     * @return List<TrocaVagaVo>
     */
    public static List<TrocaVagaVo> convertToListVo(List<TrocaVaga> listEntity) {
        List<TrocaVagaVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (TrocaVaga entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o TrocaVagaVo para TrocaVaga
     *
     * @param vo TrocaVagaVo
     * @return TrocaVaga
     */
    public static TrocaVaga convertToEntity(TrocaVagaVo vo) {
        TrocaVaga entity = null;
        if (vo != null) {
            entity = new TrocaVaga();
            entity.setId(vo.getId());
            entity.setMedicoRequisitante(MedicoMapper.convertToEntity(vo.getMedicoRequisitante()));
            entity.setMedicoVaga(MedicoMapper.convertToEntity(vo.getMedicoVaga()));
            entity.setPlantaoRequisitante(PlantaoMapper.convertToEntity(vo.getPlantaoRequisitante()));
            entity.setPlantaoVaga(PlantaoMapper.convertToEntity(vo.getPlantaoVaga()));
            entity.setTrocaEfetuada(vo.getTrocaEfetuada());
        }
        return entity;
    }

    /**
     * Converte uma lista de TrocaVagaVos para uma lista de TrocaVaga
     *
     * @param listVo List<TrocaVagaVo>
     * @return List<TrocaVaga>
     */
    public static List<TrocaVaga> convertToListEntity(List<TrocaVagaVo> listVo) {
        List<TrocaVaga> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (TrocaVagaVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
