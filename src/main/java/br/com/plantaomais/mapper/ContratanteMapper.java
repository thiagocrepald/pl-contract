package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Contratante;
import br.com.plantaomais.vo.ContratanteVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 09/05/2019.
 */
public class ContratanteMapper {
    /**
     * Convert an entity to ContratanteVo
     *
     * @param entity Contratante
     * @return ContratanteVo
     */
    public static ContratanteVo convertToVo(Contratante entity) {
        ContratanteVo vo = null;
        if (entity != null) {
            vo = new ContratanteVo();
            vo.setId(entity.getId());
            vo.setNomeContratante(entity.getNomeContratante());
            vo.setCidade(entity.getCidade());
            vo.setUf(entity.getUf());
            vo.setCnpj(entity.getCnpj());

            AuditoriaMapper.preencheVo(vo,entity);
        }
        return vo;
    }

    /**
     * Converte uma lista de Contratantes para uma lista de VOs
     *
     * @param listEntity List<Contratante>
     * @return List<ContratanteVo>
     */
    public static List<ContratanteVo> convertToListVo(List<Contratante> listEntity) {
        List<ContratanteVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Contratante entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o ContratanteVo para Contratante
     *
     * @param vo ContratanteVo
     * @return Contratante
     */
    public static Contratante convertToEntity(ContratanteVo vo) {
        Contratante entity = null;
        if (vo != null) {
            entity = new Contratante();
            entity.setId(vo.getId());
            entity.setNomeContratante(vo.getNomeContratante());
            entity.setCidade(vo.getCidade());
            entity.setUf(vo.getUf());
            entity.setCnpj(vo.getCnpj());

            AuditoriaMapper.preencheEntity(entity,vo);
        }
        return entity;
    }

    /**
     * Converte uma lista de ContratanteVos para uma lista de Contratantes
     *
     * @param listVo List<ContratanteVo>
     * @return List<Contratante>
     */
    public static List<Contratante> convertToListEntity(List<ContratanteVo> listVo) {
        List<Contratante> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (ContratanteVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
