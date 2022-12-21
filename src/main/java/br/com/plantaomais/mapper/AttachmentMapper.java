package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Attachment;
import br.com.plantaomais.vo.AttachmentVo;

import java.time.Instant;
import java.util.Date;

import static br.com.plantaomais.config.AmazonS3Configuration.getBucket;
import static br.com.plantaomais.config.AmazonS3Configuration.getS3Instance;

public class AttachmentMapper {

    public static AttachmentVo convertToVo(Attachment entity) {
        AttachmentVo vo = null;
        if (entity != null) {
            vo = new AttachmentVo();
            vo.setId(entity.getId());
            vo.setName(entity.getName());
            vo.setContentType(entity.getContentType());
            vo.setFile(entity.getFile());
            vo.setFileName(entity.getFileName());
            vo.setKey(entity.getKey());
            vo.setProcessed(entity.getProcessed());

            if (entity.getKey() != null) {
                var url = getS3Instance().generatePresignedUrl(getBucket(), entity.getKey(), Date.from(Instant.now().plusSeconds(3600)));
                vo.setUrl(entity.getUrl());
            } else {
                vo.setUrl(entity.getUrl());
            }

        }
        return vo;
    }

    public static Attachment convertToEntity(AttachmentVo vo) {
        Attachment entity = null;
        if (vo != null) {
            entity = new Attachment();
            entity.setId(vo.getId());
            entity.setName(vo.getName());
            entity.setContentType(vo.getContentType());
            entity.setFileName(vo.getFileName());
            entity.setKey(vo.getKey());
            entity.setUrl(vo.getUrl());
            entity.setProcessed(vo.getProcessed());
        }
        return entity;
    }


}
