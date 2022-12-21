package br.com.plantaomais.entitybean;

import br.com.plantaomais.entitybean.enums.PaymentType;
import br.com.plantaomais.entitybean.enums.PixKeyType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "PIX")
public class Pix implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String ALIAS_CLASSE = "paymentData";

    public static final String ID = "id";
    public static final String PIX_KEY = "pixKey";
    public static final String PIX_KEY_TYPE = "pixKeyType";

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "PIX_KEY", length = 50)
    private String pixKey;

    @Column(name = "PIX_KEY_TYPE")
    @Enumerated(EnumType.STRING)
    private PixKeyType pixKeyType;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPixKey() {
        return pixKey;
    }

    public void setPixKey(String pixKey) {
        this.pixKey = pixKey;
    }

    public PixKeyType getPixKeyType() {
        return pixKeyType;
    }

    public void setPixKeyType(PixKeyType pixKeyType) {
        this.pixKeyType = pixKeyType;
    }
}
