package br.com.plantaomais.entitybean;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 * Created by nextage on 19/06/2019.
 */
@Entity
@Table(name = "CAMPO_ANEXO")
public class CampoAnexo {
    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "campoAnexo";

    public static final String ID = "id";
    public static final String DESCRICAO = "descricao";
    public static final String ORDEM = "ordem";

    public enum Campos {
        CRM(1,"CRM"),
        PROTOCOLO(2,"Protocolo"),
        DIPLOMA(3,"Diploma médico/declaraçãodeconclusão"),
        RG(4,"RG"),
        CPF(5,"CPF"),
        COMPROVANTE_ENDERECO(6,"Comprovante de endereço"),
        TITULO_ESPECIALIDADE(7,"Título de especialidade"),
        QRE(8,"Certidão RQE"),
        CASAMENTO(9,"Certidão de casamento"),
        CARTEIRINHA_CURSOS(10,"Carteirinha de cursos ATLS/ACLS/SAVE/PALS, etc."),
        CONTRATO_SOCIAL(11,"Contrato social consolidado"),
        CARTAO_CNPJ(12,"Cartão CNPJ da empresa"),
        JUNTA_COMERCIAL(13,"Certidão simplificada da junta comercial"),
        CNH(14,"CNH"),
        DOCUMENTOS_ADICIONAIS(15, "Documentos adicionais"),
        CRM_ADICIONAL(17, "Crm Adicional"),
        PROTOCOLO_ADICIONAL(18, "Protocolo Adicional");

        private int id;
        private String descricao;

        Campos(int id, String descricao) {
            this.id = id;
            this.descricao = descricao;
        }

        public int getId() {
            return id;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_CAMPO_ANEXO_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "DESCRICAO")
    private String descricao;

    @Column(name = "ORDEM")
    private Integer ordem;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getOrdem() {
        return ordem;
    }

    public void setOrdem(Integer ordem) {
        this.ordem = ordem;
    }
}
