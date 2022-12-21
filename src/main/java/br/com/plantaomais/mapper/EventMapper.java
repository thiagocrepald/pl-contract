package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Event;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.EventVO;

import java.sql.Time;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by gmribas on 27/04/20.
 */
public class EventMapper {
    private static final SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm:ss");

    public static Event toEntity(EventVO vo) {
        if (vo == null) {
            return null;
        }

        Event entity = new Event();
        entity.setActive(vo.getActive());
        entity.setAddress(AddressMapper.convertToEntity(vo.getAddress()));
        entity.setDescription(vo.getDescription());
        entity.setEndDate(vo.getEndDate());
        entity.setEndTime(vo.getEndTime());
        entity.setId(vo.getId());
        entity.setAttachment(AttachmentMapper.convertToEntity(vo.getAttachment()));
        entity.setLink(vo.getLink());
        entity.setStartDate(vo.getStartDate());
        entity.setStartTime(vo.getStartTime());
        entity.setTitle(vo.getTitle());

        return entity;
    }


    public static EventVO toVO(Event entity) {
        if (entity == null) {
            return null;
        }

        EventVO vo = new EventVO();
        vo.setActive(entity.getActive());
        vo.setAddress(AddressMapper.convertToVo(entity.getAddress()));
        vo.setDescription(entity.getDescription());
        vo.setEndDate(entity.getEndDate());
        vo.setEndTime(Time.valueOf(sdfHour.format(Util.converterDataTimeZone(entity.getEndTime()))));
        vo.setId(entity.getId());
        vo.setAttachment(AttachmentMapper.convertToVo(entity.getAttachment()));
        vo.setLink(entity.getLink());
        vo.setStartDate(entity.getStartDate());
        vo.setStartTime(Time.valueOf(sdfHour.format(Util.converterDataTimeZone(entity.getStartTime()))));
        vo.setTitle(entity.getTitle());

        return vo;
    }

    public static List<EventVO> toVO(List<Event> entities) {
        return entities.stream().map(EventMapper::toVO).collect(Collectors.toList());
    }
}
