package br.com.plantaomais.vo;

import br.com.plantaomais.entitybean.Workplace;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class EscalaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String nomeEscala;
    private UsuarioVo coordenador;
    private ContratoVo contrato;
    private Workplace workplace;
    private Date periodoInicio;
    private Date periodoFim;
    private Date previsaoPagamento;
    private Boolean replicaFixo;
    private Boolean notificarMedicos;
    private Integer numeroCandidatos;
    private Boolean ativo;
    private Boolean isDraft;

    private List<PlantaoVo> listaPlantao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomeEscala() {
        return nomeEscala;
    }

    public void setNomeEscala(String nomeEscala) {
        this.nomeEscala = nomeEscala;
    }

    public UsuarioVo getCoordenador() {
        return coordenador;
    }

    public void setCoordenador(UsuarioVo coordenador) {
        this.coordenador = coordenador;
    }

    public ContratoVo getContrato() {
        return contrato;
    }

    public void setContrato(ContratoVo contrato) {
        this.contrato = contrato;
    }

    public Date getPeriodoInicio() {
        return periodoInicio;
    }

    public void setPeriodoInicio(Date periodoInicio) {
        this.periodoInicio = periodoInicio;
    }

    public Date getPeriodoFim() {
        return periodoFim;
    }

    public void setPeriodoFim(Date periodoFim) {
        this.periodoFim = periodoFim;
    }

    public Date getPrevisaoPagamento() {
        return previsaoPagamento;
    }

    public void setPrevisaoPagamento(Date previsaoPagamento) {
        this.previsaoPagamento = previsaoPagamento;
    }

    public List<PlantaoVo> getListaPlantao() {
        return listaPlantao;
    }

    public void setListaPlantao(List<PlantaoVo> listaPlantao) {
        this.listaPlantao = listaPlantao;
    }

    public Boolean getReplicaFixo() {
        return replicaFixo;
    }

    public void setReplicaFixo(Boolean replicaFixo) {
        this.replicaFixo = replicaFixo;
    }

    public Boolean getNotificarMedicos() {
        return notificarMedicos;
    }

    public void setNotificarMedicos(Boolean notificarMedicos) {
        this.notificarMedicos = notificarMedicos;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Integer getNumeroCandidatos() {
        return numeroCandidatos;
    }

    public void setNumeroCandidatos(Integer numeroCandidatos) {
        this.numeroCandidatos = numeroCandidatos;
    }

    public Boolean getIsDraft() {
        return isDraft;
    }

    public void setIsDraft(Boolean draft) {
        isDraft = draft;
    }

    public Workplace getWorkplace() {
        return workplace;
    }

    public void setWorkplace(Workplace workplace) {
        this.workplace = workplace;
    }
}
