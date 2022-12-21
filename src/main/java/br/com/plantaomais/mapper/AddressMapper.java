package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Address;
import br.com.plantaomais.vo.AddressVo;

public class AddressMapper {

    public static Address convertToEntity(AddressVo vo) {
        if (vo == null) return null;

        Address address = new Address();
        address.setId(vo.getId());
        address.setStreet(vo.getStreet());
        address.setDistrict(vo.getDistrict());
        address.setZipcode(vo.getZipcode());
        address.setNumber(vo.getNumber());
        address.setComplement(vo.getComplement());

        address.setCity(CityMapper.convertToEntity(vo.getCity()));

        return address;
    }

    public static AddressVo convertToVo(Address address) {
        if(address == null) return null;

        AddressVo vo = new AddressVo();
        vo.setId(address.getId());
        vo.setStreet(address.getStreet());
        vo.setZipcode(address.getZipcode());
        vo.setNumber(address.getNumber());
        vo.setDistrict(address.getDistrict());
        vo.setComplement(address.getComplement());

        vo.setCity(CityMapper.convertToVo(address.getCity()));

        return vo;
    }
}
