package br.com.plantaomais.entitybean;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "workplace_item")
public class WorkplaceItem implements Serializable {

    public static final String ALIAS_CLASSE = "workplaceItem";

    public static final String ID = "id";
    public static final String ITEM = "item";
    public static final String OBJECT = "object";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item")
    private Integer item;

    @Column(name = "object")
    private String object;

    @Column(name = "quantity", precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(name = "receivable_amount", precision = 10, scale = 2)
    private BigDecimal receivableAmount;

    @Column(name = "payable_partner_amount", precision = 10, scale = 2)
    private BigDecimal payablePartnerAmount;

    @Column(name = "payment_pj_amount", precision = 10, scale = 2)
    private BigDecimal paymentPjAmount;

    @Column(name = "payment_rpa_amount", precision = 10, scale = 2)
    private BigDecimal paymentRpaAmount;

    @JoinColumn(name = "workplace_id", referencedColumnName = "ID")
    @ManyToOne
    private Workplace workplace;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getItem() {
        return item;
    }

    public void setItem(Integer item) {
        this.item = item;
    }

    public String getObject() {
        return object;
    }

    public void setObject(String object) {
        this.object = object;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getReceivableAmount() {
        return receivableAmount;
    }

    public void setReceivableAmount(BigDecimal receivableAmount) {
        this.receivableAmount = receivableAmount;
    }

    public BigDecimal getPayablePartnerAmount() {
        return payablePartnerAmount;
    }

    public void setPayablePartnerAmount(BigDecimal payablePartnerAmount) {
        this.payablePartnerAmount = payablePartnerAmount;
    }

    public BigDecimal getPaymentPjAmount() {
        return paymentPjAmount;
    }

    public void setPaymentPjAmount(BigDecimal paymentPjAmount) {
        this.paymentPjAmount = paymentPjAmount;
    }

    public BigDecimal getPaymentRpaAmount() {
        return paymentRpaAmount;
    }

    public void setPaymentRpaAmount(BigDecimal paymentRpaAmount) {
        this.paymentRpaAmount = paymentRpaAmount;
    }

    public Workplace getWorkplace() {
        return workplace;
    }

    public void setWorkplace(Workplace workplace) {
        this.workplace = workplace;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof WorkplaceItem)) {
            return false;
        }
        WorkplaceItem other = (WorkplaceItem) object;
        return !((this.id == null && other.id != null) || (this.id != null && !this.id
                .equals(other.id)));
    }

    @Override
    public String toString() {
        return "WorkplaceItem{" +
                "id=" + id +
                '}';
    }
}
