package br.com.plantaomais.entitybean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.util.Arrays;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Entity
@Table(name = "ADDRESS")
public class Address {

    public static final String ALIAS_CLASSE = "address";

    public static final String ID = "id";
    public static final String STREET = "street";
    public static final String NUMBER = "number";
    public static final String ZIPCODE = "zipcode";
    public static final String DISTRICT = "district";
    public static final String COMPLEMENT = "complement";
    public static final String CITY = "city";

    public static List<String> getAllFields() {
        return Arrays.asList(
                ID,
                STREET,
                NUMBER,
                ZIPCODE,
                DISTRICT,
                COMPLEMENT,
                CITY
        );
    }

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_ADDRESS_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "STREET")
    private String street;

    @Column(name = "NUMBER")
    private String number;

    @Column(name = "ZIPCODE")
    private String zipcode;

    @Column(name = "DISTRICT")
    private String district;

    @Column(name = "COMPLEMENT")
    private String complement;

    @JoinColumn(name = "CITY_ID", referencedColumnName = "ID")
    @ManyToOne
    private City city;

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

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public String getLocale() {
        String locale = "";
        locale = this.street;

        if (isNotBlank(this.number)) {
            locale += ", " + this.number;
        }

        if (isNotBlank(this.complement)) {
            locale += " - " + this.complement;
        }

        if (isNotBlank(this.zipcode)) {
            locale += " " + this.zipcode;
        }
        return locale;
    }
}
