package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Address;
import br.com.plantaomais.mapper.AddressMapper;
import br.com.plantaomais.vo.AddressVo;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by gmribas on 04/05/20.
 */
public class AddressController {

    public AddressVo save(GenericDao dao, AddressVo vo) throws Exception {
        Address entity = AddressMapper.convertToEntity(vo);

        Integer id;

        if (entity.getId() == null) {
            id = dao.persistWithCurrentTransaction(entity);
        } else {
            List<Propriedade> props = Address.getAllFields()
                    .stream()
                    .map(Propriedade::new)
                    .collect(Collectors.toList());

            id = dao.updateWithCurrentTransaction(entity, props);
        }

        AddressVo result = AddressMapper.convertToVo(entity);
        result.setId(id);

        return result;
    }
}
