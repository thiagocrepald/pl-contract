package br.com.plantaomais.entitybean;

import br.com.plantaomais.entitybean.enums.PaymentType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "PAYMENT_DATA")
public class PaymentData implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "paymentData";

    public static final String ID = "id";
    public static final String BANK = "bank";
    public static final String AGENCY = "agency";
    public static final String TRANSACTION = "transaction";
    public static final String BANK_ACCOUNT = "bankAccount";
    public static final String CPF = "cpf";
    public static final String CNPJ = "cnpj";
    public static final String ACCOUNT_OWNER_NAME = "accountOwnerName";
    public static final String PIS_NUMBER = "pisNumber";
    public static final String IS_COMPANY_ACCOUNT = "isCompanyAccount";
    public static final String PAYMENT_TYPE = "paymentType";
    public static final String MEDICO = "medico";
    public static final String PIX = "pix";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "BANK", length = 50)
    private String bank;

    @Column(name = "AGENCY", length = 50)
    private String agency;

    @Column(name = "TRANSACTION", length = 50)
    private String transaction;

    @Column(name = "BANK_ACCOUNT", length = 50)
    private String bankAccount;

    @Column(name = "CPF", length = 50)
    private String cpf;

    @Column(name = "CNPJ", length = 50)
    private String cnpj;

    @Column(name = "ACCOUNT_OWNER_NAME", length = 50)
    private String accountOwnerName;

    @Column(name = "PIS_NUMBER", length = 50)
    private String pisNumber;

    @Column(name = "IS_COMPANY_ACCOUNT")
    private Boolean isCompanyAccount;

    @Column(name = "PAYMENT_TYPE")
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    @JoinColumn(name = "MEDIC_ID", referencedColumnName = "ID")
    @ManyToOne
    private Medico medico;

    @JoinColumn(name = "PIX_ID", referencedColumnName = "ID")
    @ManyToOne
    private Pix pix;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public String getAgency() {
        return agency;
    }

    public void setAgency(String agency) {
        this.agency = agency;
    }

    public String getTransaction() {
        return transaction;
    }

    public void setTransaction(String transaction) {
        this.transaction = transaction;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getAccountOwnerName() {
        return accountOwnerName;
    }

    public void setAccountOwnerName(String accountOwnerName) {
        this.accountOwnerName = accountOwnerName;
    }

    public String getPisNumber() {
        return pisNumber;
    }

    public void setPisNumber(String pisNumber) {
        this.pisNumber = pisNumber;
    }

    public Boolean getIsCompanyAccount() {
        return isCompanyAccount;
    }

    public void setIsCompanyAccount(Boolean isCompanyAccount) {
        this.isCompanyAccount = isCompanyAccount;
    }

    @Enumerated(EnumType.STRING)
    public PaymentType getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Pix getPix() {
        return pix;
    }

    public void setPix(Pix pix) {
        this.pix = pix;
    }
}
