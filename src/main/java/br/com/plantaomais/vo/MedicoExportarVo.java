package br.com.plantaomais.vo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by nextage on 04/07/2019.
 */
public class MedicoExportarVo {

    public static final String ID = "id";
    public static final String NOME = "nome";
    public static final String PONTUACAO = "pontuacao";
    public static final String EMAIL = "email";
    public static final String CRM = "crm";
    public static final String ESTADO = "estado";
    public static final String BANCO = "banco";
    public static final String AGENCIA = "agencia";
    public static final String OPERACAO = "operacao";
    public static final String CONTA = "conta";
    public static final String NUMERO_PIS = "numeroPis";
    public static final String CRM_ADICIONAL = "crmAdicional";
    public static final String ESTADO_ADICIONAL = "estadoAdicional";
    public static final String SEXO = "sexo";
    public static final String TIPO_RECEBIMENTO = "tipoRecebimento";

    public static final String ESPECIALIDADE = "especialidade";

    public static final String DIA_SEMANA = "diaSemana";
    public static final String PERIODO = "periodo";
    public static final String SETOR = "setor";
    public static final String LOCALIDADE = "localidade";

    public static final String DIPLOMA_DECLARACAO = "diplomaDeclaracao";
    public static final String CRM_DEFINITIVO = "crmDefinitivo";
    public static final String PROTOCOLO_CRM = "protocoloCrm";
    public static final String CRM_ADICIONAL_ANEXO = "crmAdicional";
    public static final String PROTOCOLO_CRM_ADICIONAL = "protocoloCrmAdicional";
    public static final String RG = "rg";
    public static final String CPF = "cpf";
    public static final String CNH = "cnh";
    public static final String COMPROVANTE_ENDERECO = "comprovanteEndereco";
    public static final String CERTIDAO_RQE = "certidaoRqe";
    public static final String CERTIDAO_CASAMENTO = "certidaoCasamento";
    public static final String CARTEIRINHA_CURSOS = "carteirinhaCursos";
    public static final String DOCUMENTOS_ADICIONAIS = "documentosAdicionais";
    public static final String ANEXO_CRM_ADICIONAL = "anexoCrmAdicional";
    public static final String ANEXO_PROTOCOLO_ADICIONAL = "anexoProtocoloAdicional";
    public static final String ANEXO_ESPECIALIDADE = "anexoEspecialidade";

    public static final String TELEFONE = "telefone";
    public static final String ATIVO = "ativo";
    public static final String ADDRESS = "address";
    public static final String BIRTH_DATE = "birthDate";
    public static final String CRM_ISSUE_DATE = "crmIssueDate";
    public static final String CRM_ADICIONAL_ISSUE_DATE = "crmAdicionalIssueDate";
    public static final String COMO_CHEGOU_ATE_NOS = "comoChegouAteNos";

    private Integer id;
    private String nome;
    private String pontuacao;
    private String email;
    private String crm;
    private String estado;
    private String crmAdicional;
    private String estadoAdicional;
    private String sexo;
    private String banco;
    private String agencia;
    private String operacao;
    private String conta;
    private String numeroPis;
    private String tipoRecebimento;

    private String especialidade;

    private String diaSemana;
    private String periodo;
    private String setor;
    private String localidade;

    private String diplomaDeclaracao;
    private String crmDefinitivo;
    private String protocoloCrm;
    private String crmAdicionalAnexo;
    private String protocoloCrmAdicional;
    private String rg;
    private String cpf;
    private String cnh;
    private String comprovanteEndereco;
    private String certidaoRqe;
    private String certidaoCasamento;
    private String carteirinhaCursos;
    private String documentosAdicionais;

    private String anexoCrmAdicional;
    private String anexoProtocoloAdicional;
    private String anexoEspecialidade;

    private String telefone;
    private String birthDate;
    private String ativo;
    private String crmIssueDate;
    private String crmAdicionalIssueDate;
    private String address;

    private String comoChegouAteNos;

    private List<String> especialidades = new ArrayList<>();

    private Map<String, String> mapLocality = new HashMap<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPontuacao() {
        return pontuacao;
    }

    public void setPontuacao(String pontuacao) {
        this.pontuacao = pontuacao;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCrm() {
        return crm;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCrmAdicional() {
        return crmAdicional;
    }

    public void setCrmAdicional(String crmAdicional) {
        this.crmAdicional = crmAdicional;
    }

    public String getEstadoAdicional() {
        return estadoAdicional;
    }

    public void setEstadoAdicional(String estadoAdicional) {
        this.estadoAdicional = estadoAdicional;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getBanco() {
        return banco;
    }

    public void setBanco(String banco) {
        this.banco = banco;
    }

    public String getAgencia() {
        return agencia;
    }

    public void setAgencia(String agencia) {
        this.agencia = agencia;
    }

    public String getOperacao() {
        return operacao;
    }

    public void setOperacao(String operacao) {
        this.operacao = operacao;
    }

    public String getConta() {
        return conta;
    }

    public void setConta(String conta) {
        this.conta = conta;
    }

    public String getNumeroPis() {
        return numeroPis;
    }

    public void setNumeroPis(String numeroPis) {
        this.numeroPis = numeroPis;
    }

    public String getTipoRecebimento() {
        return tipoRecebimento;
    }

    public void setTipoRecebimento(String tipoRecebimento) {
        this.tipoRecebimento = tipoRecebimento;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }

    public String getLocalidade() {
        return localidade;
    }

    public void setLocalidade(String localidade) {
        this.localidade = localidade;
    }

    public String getDiplomaDeclaracao() {
        return diplomaDeclaracao;
    }

    public void setDiplomaDeclaracao(String diplomaDeclaracao) {
        this.diplomaDeclaracao = diplomaDeclaracao;
    }

    public String getCrmDefinitivo() {
        return crmDefinitivo;
    }

    public void setCrmDefinitivo(String crmDefinitivo) {
        this.crmDefinitivo = crmDefinitivo;
    }

    public String getProtocoloCrm() {
        return protocoloCrm;
    }

    public void setProtocoloCrm(String protocoloCrm) {
        this.protocoloCrm = protocoloCrm;
    }

    public String getCrmAdicionalAnexo() {
        return crmAdicionalAnexo;
    }

    public void setCrmAdicionalAnexo(String crmAdicionalAnexo) {
        this.crmAdicionalAnexo = crmAdicionalAnexo;
    }

    public String getProtocoloCrmAdicional() {
        return protocoloCrmAdicional;
    }

    public void setProtocoloCrmAdicional(String protocoloCrmAdicional) {
        this.protocoloCrmAdicional = protocoloCrmAdicional;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCnh() {
        return cnh;
    }

    public void setCnh(String cnh) {
        this.cnh = cnh;
    }

    public String getComprovanteEndereco() {
        return comprovanteEndereco;
    }

    public void setComprovanteEndereco(String comprovanteEndereco) {
        this.comprovanteEndereco = comprovanteEndereco;
    }

    public String getCertidaoRqe() {
        return certidaoRqe;
    }

    public void setCertidaoRqe(String certidaoRqe) {
        this.certidaoRqe = certidaoRqe;
    }

    public String getCertidaoCasamento() {
        return certidaoCasamento;
    }

    public void setCertidaoCasamento(String certidaoCasamento) {
        this.certidaoCasamento = certidaoCasamento;
    }

    public String getCarteirinhaCursos() {
        return carteirinhaCursos;
    }

    public void setCarteirinhaCursos(String carteirinhaCursos) {
        this.carteirinhaCursos = carteirinhaCursos;
    }

    public String getDocumentosAdicionais() {
        return documentosAdicionais;
    }

    public void setDocumentosAdicionais(String documentosAdicionais) {
        this.documentosAdicionais = documentosAdicionais;
    }

    public String getTelefone() {
        return telefone;
    }

    public MedicoExportarVo setTelefone(String telefone) {
        this.telefone = telefone;
        return this;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public MedicoExportarVo setBirthDate(String birthDate) {
        this.birthDate = birthDate;
        return this;
    }

    public String getAtivo() {
        return ativo;
    }

    public MedicoExportarVo setAtivo(String ativo) {
        this.ativo = ativo;
        return this;
    }

    public String getCrmIssueDate() {
        return crmIssueDate;
    }

    public MedicoExportarVo setCrmIssueDate(String crmIssueDate) {
        this.crmIssueDate = crmIssueDate;
        return this;
    }

    public String getCrmAdicionalIssueDate() {
        return crmAdicionalIssueDate;
    }

    public MedicoExportarVo setCrmAdicionalIssueDate(String crmAdicionalIssueDate) {
        this.crmAdicionalIssueDate = crmAdicionalIssueDate;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public MedicoExportarVo setAddress(String address) {
        this.address = address;
        return this;
    }

    public String getAnexoCrmAdicional() {
        return anexoCrmAdicional;
    }

    public MedicoExportarVo setAnexoCrmAdicional(String anexoCrmAdicional) {
        this.anexoCrmAdicional = anexoCrmAdicional;
        return this;
    }

    public String getAnexoProtocoloAdicional() {
        return anexoProtocoloAdicional;
    }

    public MedicoExportarVo setAnexoProtocoloAdicional(String anexoProtocoloAdicional) {
        this.anexoProtocoloAdicional = anexoProtocoloAdicional;
        return this;
    }

    public String getAnexoEspecialidade() {
        return anexoEspecialidade;
    }

    public MedicoExportarVo setAnexoEspecialidade(String anexoEspecialidade) {
        this.anexoEspecialidade = anexoEspecialidade;
        return this;
    }

    public Map<String, String> getMapLocality() {
        return mapLocality;
    }

    public List<String> getEspecialidades() {
        return especialidades;
    }

    public String getComoChegouAteNos() {
        return comoChegouAteNos;
    }

    public void setComoChegouAteNos(String comoChegouAteNos) {
        this.comoChegouAteNos = comoChegouAteNos;
    }
}
