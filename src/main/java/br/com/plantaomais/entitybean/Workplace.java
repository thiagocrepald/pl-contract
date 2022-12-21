package br.com.plantaomais.entitybean;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "workplace")
public class Workplace implements Serializable {

    public static final String ALIAS_CLASSE = "workplace";
    public static final String CONTRACT = "contract";
    public static final String UNIT_NAME = "unitName";
    public static final String ID = "id";

    public static final String ADDRESS = "address";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "unit_name")
    private String unitName;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "reference")
    private String reference;

    @Column(name = "administrative_process")
    private String administrativeProcess;

    @NotNull
    @Column(name = "time_control_on_app")
    private Boolean timeControlOnApp;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("workplaces")
    private Contract contract;

    @OneToOne
    @JoinColumn(unique = true)
    private Address address;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getAdministrativeProcess() {
        return administrativeProcess;
    }

    public void setAdministrativeProcess(String administrativeProcess) {
        this.administrativeProcess = administrativeProcess;
    }

    public Boolean getTimeControlOnApp() {
        return timeControlOnApp;
    }

    public void setTimeControlOnApp(Boolean timeControlOnApp) {
        this.timeControlOnApp = timeControlOnApp;
    }

    public Contract getContract() {
        return contract;
    }

    public void setContract(Contract contract) {
        this.contract = contract;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof Workplace)) {
            return false;
        }
        Workplace other = (Workplace) object;
        return !((this.id == null && other.id != null) || (this.id != null && !this.id
                .equals(other.id)));
    }

    @Override
    public String toString() {
        return "Workplace{" +
                "id=" + id +
                ", unitName='" + unitName + '\'' +
                ", discountAmount=" + discountAmount +
                '}';
    }
}
