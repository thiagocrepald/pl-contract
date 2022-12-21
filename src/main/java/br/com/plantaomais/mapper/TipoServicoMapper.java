package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.TipoServico;
import br.com.plantaomais.vo.TipoServicoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 10/05/2019.
 */
public class TipoServicoMapper {
/*
    **
            * Convert an entity to TipoServicoVo
    *
            * @param entity TipoServico
    * @return TipoServicoVo
    */
    public static TipoServicoVo convertToVo(TipoServico entity) {
        TipoServicoVo vo = null;
        if (entity != null) {
            vo = new TipoServicoVo();
            vo.setId(entity.getId());
            vo.setDescricao(entity.getDescricao());

        }
        return vo;
    }

    /**
     * Converte uma lista de TipoServicos para uma lista de VOs
     *
     * @param listEntity List<TipoServico>
     * @return List<TipoServicoVo>
     */
    public static List<TipoServicoVo> convertToListVo(List<TipoServico> listEntity) {
        List<TipoServicoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (TipoServico entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o TipoServicoVo para TipoServico
     *
     * @param vo TipoServicoVo
     * @return TipoServico
     */
    public static TipoServico convertToEntity(TipoServicoVo vo) {
        TipoServico entity = null;
        if (vo != null) {
            entity = new TipoServico();
            entity.setId(vo.getId());
            entity.setDescricao(vo.getDescricao());

            //AuditoriaMapper.preencheEntity(entity, vo);
        }
        return entity;
    }

    /**
     * Converte uma lista de TipoServicoVos para uma lista de TipoServicos
     *
     * @param listVo List<TipoServicoVo>
     * @return List<TipoServico>
     */
    public static List<TipoServico> convertToListEntity(List<TipoServicoVo> listVo) {
        List<TipoServico> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (TipoServicoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
