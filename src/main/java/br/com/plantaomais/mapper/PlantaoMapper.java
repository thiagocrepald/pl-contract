package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.WorkplaceItem;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.aplicativo.PlantaoDiaVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class PlantaoMapper {
    /**
     * Convert an entity to PlantaoVo
     *
     * @param entity Plantao
     * @return PlantaoVo
     */
    public static PlantaoVo convertToVo(Plantao entity) {
        PlantaoVo vo = null;
        if (entity != null) {
            vo = new PlantaoVo();
            vo.setId(entity.getId());
            vo.setHoraInicio(Util.converterDataTimeZone(entity.getHoraInicio()));
            vo.setHoraFim(Util.converterDataTimeZone(entity.getHoraFim()));
            vo.setDia(entity.getDia());
            vo.setData(entity.getData());
            vo.setTurno(entity.getTurno());
            vo.setValor(entity.getValor());
            vo.setEscala(EscalaMapper.convertToVo(entity.getEscala()));
            vo.setNumeroVaga(entity.getNumeroVaga());
            vo.setBloqueado(entity.getBloqueado());
            vo.setStatus(entity.getStatus());
            vo.setMedico(MedicoMapper.convertToVo(entity.getMedico()));
            vo.setVaga(entity.getVaga());
            vo.setDisponivel(entity.getDisponivel());
            vo.setEmTroca(entity.getEmTroca());
            vo.setWorkplaceItem(WorkplaceItemMapper.convertToVo(entity.getWorkplaceItem()));
        }
        return vo;
    }

    public static PlantaoVo convertToVoOnlyId(Plantao entity) {
        PlantaoVo vo = null;
        if (entity != null) {
            vo = new PlantaoVo();
            vo.setId(entity.getId());
        }
        return vo;
    }

    public static PlantaoDiaVo convertToDiaVo(Plantao entity) {
        PlantaoDiaVo vo = null;
        if (entity != null) {
            vo = new PlantaoDiaVo();
            vo.setId(entity.getId());
            vo.setTurno(entity.getTurno());
            vo.setHoraInicio(Util.converterDataTimeZone(entity.getHoraInicio()));
            vo.setHoraFim(Util.converterDataTimeZone(entity.getHoraFim()));
            vo.setMedico(MedicoMapper.convertToMedicoPlantaoSimpleVo(entity.getMedico()));
            vo.setDisponivel(entity.getDisponivel());
        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<Plantao>
     * @return List<PlantaoVo>
     */
    public static List<PlantaoVo> convertToListVo(List<Plantao> listEntity) {
        List<PlantaoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Plantao entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    public static List<PlantaoVo> convertToListVoOnlyId(List<Plantao> listEntity) {
        List<PlantaoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Plantao entity : listEntity) {
                listVo.add(convertToVoOnlyId(entity));
            }
        }
        return listVo;
    }

    /**
     * Converte o PlantaoVo para Plantao
     *
     * @param vo PlantaoVo
     * @return Plantao
     */
    public static Plantao convertToEntity(PlantaoVo vo) {
        Plantao entity = null;
        if (vo != null) {
            entity = new Plantao();
            entity.setId(vo.getId());
            entity.setHoraInicio(vo.getHoraInicio());
            entity.setHoraFim(vo.getHoraFim());
            entity.setDia(vo.getDia());
            entity.setData(vo.getData());
            entity.setTurno(vo.getTurno());
            entity.setValor(vo.getValor());
            entity.setEscala(EscalaMapper.convertToEntity(vo.getEscala()));
            entity.setNumeroVaga(vo.getNumeroVaga());
            entity.setBloqueado(vo.getBloqueado());
            entity.setStatus(vo.getStatus());
            entity.setMedico(MedicoMapper.convertToEntity(vo.getMedico()));
            entity.setWorkplaceItem(WorkplaceItemMapper.convertToEntity(vo.getWorkplaceItem()));
            entity.setVaga(vo.getVaga());
            entity.setDisponivel(vo.getDisponivel());
            entity.setEmTroca(vo.getEmTroca());
            entity.setWorkplaceItem(WorkplaceItemMapper.convertToEntity(vo.getWorkplaceItem()));
        }
        return entity;
    }

    /**
     * Converte uma lista de PlantaoVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<PlantaoVo>
     * @return List<Plantao>
     */
    public static List<Plantao> convertToListEntity(List<PlantaoVo> listVo) {
        List<Plantao> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (PlantaoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
