package br.com.plantaomais.vo;

public class AddressVo {
    private Integer id;

    private String street;
    private String number;
    private String zipcode;
    private String district;
    private String complement;

    private CityVo city;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getComplement() {
        return complement;
    }

    public void setComplement(String complement) {
        this.complement = complement;
    }

    public CityVo getCity() {
        return city;
    }

    public void setCity(CityVo city) {
        this.city = city;
    }
}
