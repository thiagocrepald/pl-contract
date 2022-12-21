package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.MedicoAnexo;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.MedicAttachmentSimpleVO;
import br.com.plantaomais.vo.MedicoAnexoExtraVo;
import br.com.plantaomais.vo.MedicoAnexoVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 19/06/2019.
 */
public class MedicoAnexoMapper {

    public static List<MedicAttachmentSimpleVO> convertToSimpleVo(List<MedicoAnexo> entities) {
        if (entities != null) {
            ArrayList<MedicAttachmentSimpleVO> vos = new ArrayList<>();
            for (MedicoAnexo ma : entities) {
                vos.add(convertToSimpleVo(ma));
            }
            return vos;
        }
        return new ArrayList<>();
    }

    public static MedicAttachmentSimpleVO convertToSimpleVo(MedicoAnexo entity) {
        MedicAttachmentSimpleVO vo = null;
        if (entity != null) {
            vo = new MedicAttachmentSimpleVO();
            vo.setId(entity.getId());
            vo.setCampoAnexo(CampoAnexoMapper.convertToVo(entity.getCampoAnexo()));
            vo.setNomeAnexo(entity.getNomeAnexo());
            vo.setTipoAnexo(entity.getTipoAnexo());
            vo.setObservacaoValidacao(entity.getObservacaoValidacao());
            vo.setEhVerso(entity.getEhVerso());
            vo.setVisualizado(entity.getVisualizado());
            vo.setExtra(entity.getExtra());

            vo.setAttachment(AttachmentMapper.convertToVo(entity.getAttachment()));

            boolean validado = entity.getValidado() != null ? entity.getValidado() : false;
            vo.setValidado(validado);

            AuditoriaMapper.preencheVo(vo, entity);
        }
        return vo;
    }

    /**
     * Convert an entity to MedicoAnexoVo
     *
     * @param entity MedicoAnexo
     * @return MedicoAnexoVo
     */
    public static MedicoAnexoVo convertToVo(MedicoAnexo entity) {
        MedicoAnexoVo vo = null;
        if (entity != null) {
            vo = new MedicoAnexoVo();
            vo.setId(entity.getId());
            vo.setMedico(MedicoMapper.convertToVo(entity.getMedico()));
            vo.setCampoAnexo(CampoAnexoMapper.convertToVo(entity.getCampoAnexo()));
            vo.setNomeAnexo(entity.getNomeAnexo());
            if (!Util.isNullOrEmpty(entity.getBase64Anexo())) {
                vo.setBase64Anexo(Util.byteToBase64String(entity.getBase64Anexo()));
            }
            vo.setEspecialidade(EspecialidadeMapper.convertToVo(entity.getEspecialidade()));
            vo.setTipoAnexo(entity.getTipoAnexo());
            vo.setEhHistorico(entity.getEhHistorico());
            vo.setObservacaoValidacao(entity.getObservacaoValidacao());
            vo.setEhVerso(entity.getEhVerso());
            vo.setHash(entity.getHash());
            vo.setMedicoCurso(MedicoCursoMapper.convertToSimpleVo(entity.getMedicoCurso()));
            vo.setVisualizado(entity.getVisualizado());
            if (entity.getAttachment() != null) {
                vo.setAttachment(AttachmentMapper.convertToVo(entity.getAttachment()));
            }

            if (entity.getExtra() != null) {
                vo.setExtra(Util.convertJsonStringToObject(entity.getExtra(), MedicoAnexoExtraVo.class));
            }

//            boolean validado = entity.getValidado() != null ? entity.getValidado() : false;
            vo.setValidado(entity.getValidado());

            AuditoriaMapper.preencheVo(vo, entity);

        }
        return vo;
    }

    /**
     * Converte uma lista de usuarioTipoPermissaos para uma lista de VOs
     *
     * @param listEntity List<MedicoAnexo>
     * @return List<MedicoAnexoVo>
     */
    public static List<MedicoAnexoVo> convertToListVo(List<MedicoAnexo> listEntity) {
        List<MedicoAnexoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (MedicoAnexo entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o MedicoAnexoVo para MedicoAnexo
     *
     * @param vo MedicoAnexoVo
     * @return MedicoAnexo
     */
    public static MedicoAnexo convertToEntity(MedicoAnexoVo vo) {
        MedicoAnexo entity = null;
        if (vo != null) {
            entity = new MedicoAnexo();
            entity.setId(vo.getId());
            entity.setMedico(MedicoMapper.convertToEntity(vo.getMedico()));
            entity.setCampoAnexo(CampoAnexoMapper.convertToEntity(vo.getCampoAnexo()));
            entity.setNomeAnexo(vo.getNomeAnexo());
            entity.setEspecialidade(EspecialidadeMapper.convertToEntity(vo.getEspecialidade()));
            if (!Util.isNullOrEmpty(vo.getBase64Anexo())) {
                entity.setBase64Anexo(Util.base64StringToByte(vo.getBase64Anexo()));
            }
            entity.setTipoAnexo(vo.getTipoAnexo());
            entity.setEhHistorico(vo.getEhHistorico());
            entity.setValidado(vo.getValidado());
            entity.setObservacaoValidacao(vo.getObservacaoValidacao());
            entity.setEhVerso(vo.getEhVerso());
            entity.setHash(vo.getHash());
            entity.setVisualizado(vo.getVisualizado() != null ? vo.getVisualizado() : false);
            entity.setMedicoCurso(MedicoCursoMapper.convertToEntity(vo.getMedicoCurso()));
            if (vo.getAttachment() != null) {
                entity.setAttachment(AttachmentMapper.convertToEntity(vo.getAttachment()));
            }
            if (vo.getExtra() != null) {
                entity.setExtra(Util.getStringJsonFor(vo.getExtra()));
            }
            AuditoriaMapper.preencheEntity(entity, vo);
        }
        return entity;
    }

    /**
     * Converte uma lista de MedicoAnexoVos para uma lista de usuarioTipoPermissaos
     *
     * @param listVo List<MedicoAnexoVo>
     * @return List<MedicoAnexo>
     */
    public static List<MedicoAnexo> convertToListEntity(List<MedicoAnexoVo> listVo) {
        List<MedicoAnexo> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (MedicoAnexoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
