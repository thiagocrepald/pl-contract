package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.State;
import br.com.plantaomais.vo.StateVo;

import java.util.List;
import java.util.stream.Collectors;

public class StateMapper {

    public static StateVo convertToVo(State entity) {
        if (entity == null) return null;

        StateVo stateVo = new StateVo();

        stateVo.setId(entity.getId());
        stateVo.setAcronym(entity.getAcronym());
        stateVo.setName(entity.getName());

        return stateVo;
    }

    public static List<StateVo> convertToListVo(List<State> listEntity) {
        if (listEntity == null) return null;

        return listEntity.stream()
                .map(StateMapper::convertToVo)
                .collect(Collectors.toList());
    }


    public static State convertToEntity(StateVo vo) {
        if (vo == null) return null;

        State state = new State();

        state.setId(vo.getId());
        state.setAcronym(vo.getAcronym());
        state.setName(vo.getName());

        return state;
    }

    public static List<State> convertToListEntity(List<StateVo> listEntity) {
        if (listEntity == null) return null;

        return listEntity.stream()
                .map(StateMapper::convertToEntity)
                .collect(Collectors.toList());
    }

}
