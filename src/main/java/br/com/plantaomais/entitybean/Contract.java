package br.com.plantaomais.entitybean;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "contract")
@Getter
@Setter
public class Contract implements Serializable {

    public static final String ALIAS_CLASSE = "contrato";

    public static final String ID = "id";
    public static final String RESULTS_CENTER = "resultsCenter";
    public static final String SANKHYA_CODE = "sankhyaCode";
    public static final String NOTES = "notes";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "contract_number")
    private String contractNumber;

    @NotBlank
    @Column(name = "results_center", nullable = false)
    private String resultsCenter;

    @NotNull
    @Column(name = "sankhya_code", nullable = false)
    private Integer sankhyaCode;

    @Column(name = "date_payment_payroll")
    private String datePaymentPayroll;

    @Column(name = "notes")
    private String notes;

    @OneToMany(mappedBy = "contract")
    private Set<Workplace> workplaces = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "contracting_party_id", referencedColumnName = "id")
    private ContractingParty contractingParty;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContractNumber() {
        return contractNumber;
    }

    public void setContractNumber(String contractNumber) {
        this.contractNumber = contractNumber;
    }

    public String getResultsCenter() {
        return resultsCenter;
    }

    public void setResultsCenter(String resultsCenter) {
        this.resultsCenter = resultsCenter;
    }

    public Integer getSankhyaCode() {
        return sankhyaCode;
    }

    public void setSankhyaCode(Integer sankhyaCode) {
        this.sankhyaCode = sankhyaCode;
    }

    public String getDatePaymentPayroll() {
        return datePaymentPayroll;
    }

    public void setDatePaymentPayroll(String datePaymentPayroll) {
        this.datePaymentPayroll = datePaymentPayroll;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Set<Workplace> getWorkplaces() {
        return workplaces;
    }

    public void setWorkplaces(Set<Workplace> workplaces) {
        this.workplaces = workplaces;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    //    public Set<Workplace> getWorkplaces() {
//        return workplaces;
//    }
//
//    public void setWorkplaces(Set<Workplace> workplaces) {
//        this.workplaces = workplaces;
//    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Contract contract = (Contract) o;
        return Objects.equals(id, contract.id) && Objects.equals(contractNumber, contract.contractNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, contractNumber);
    }

    @Override
    public String toString() {
        return "Contract{" +
                "id=" + id +
                ", contractNumber='" + contractNumber + '\'' +
                ", resultsCenter='" + resultsCenter + '\'' +
                ", sankhyaCode=" + sankhyaCode +
                ", datePaymentPayroll='" + datePaymentPayroll + '\'' +
                ", notes='" + notes + '\'' +
//                ", workplaces=" + workplaces +
                '}';
    }
}
