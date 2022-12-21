package br.com.plantaomais.vo;

import br.com.plantaomais.entitybean.enums.PaymentType;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.io.Serializable;


public class PaymentDataVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String bank;
    private String agency;
    private String transaction;
    private String bankAccount;
    private String cpf;
    private String cnpj;
    private String accountOwnerName;
    private String pisNumber;
    private Boolean isCompanyAccount;
    private PaymentType type;
    private PixVo pix;


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

    public PixVo getPix() {
        return pix;
    }

    public void setPix(PixVo pix) {
        this.pix = pix;
    }

    @Enumerated(EnumType.STRING)
    public PaymentType getType() {
        return type;
    }

    public void setType(PaymentType type) {
        this.type = type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PaymentDataVo that = (PaymentDataVo) o;

        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
