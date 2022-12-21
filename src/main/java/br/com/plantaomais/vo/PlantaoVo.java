package br.com.plantaomais.vo;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by nextage on 14/05/2019.
 */
public class PlantaoVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private Date horaInicio;
    private Date horaFim;
    private String dia; //dia semana (segunda, terça ...)
    private Date data; //data mes (20/05, 21/05 ...)
    private String turno;
    private Double valor;
    private EscalaVo escala;
    private Integer numeroVaga;
    private Boolean bloqueado;
    private MedicoVo medico;
    private WorkplaceItemVo workplaceItem;
    private String status;
    private Boolean vaga;
    private Boolean disponivel;
    private String especialidades;
    private String local;
    private String blockedReason;
    private Boolean emTroca;
    private Boolean temCandidatos;

    private List<SetorVo> listaSetorSelecionado;
    private List<PlantaoSetorVo> listaSetores;
    private List<EspecialidadeVo> listaEspecialidadeSelecionado;
    private List<EspecialidadeVo> listaEspecialidades;
    private List<CandidatoPlantaoVo> listaCandidatosPlantao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(Date horaInicio) {
        this.horaInicio = horaInicio;
    }

    public Date getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(Date horaFim) {
        this.horaFim = horaFim;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public List<SetorVo> getListaSetorSelecionado() {
        return listaSetorSelecionado;
    }

    public void setListaSetorSelecionado(List<SetorVo> listaSetorSelecionado) {
        this.listaSetorSelecionado = listaSetorSelecionado;
    }

    public List<EspecialidadeVo> getListaEspecialidadeSelecionado() {
        return listaEspecialidadeSelecionado;
    }

    public void setListaEspecialidadeSelecionado(List<EspecialidadeVo> listaEspecialidadeSelecionado) {
        this.listaEspecialidadeSelecionado = listaEspecialidadeSelecionado;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public EscalaVo getEscala() {
        return escala;
    }

    public void setEscala(EscalaVo escala) {
        this.escala = escala;
    }

    public String getEspecialidades() { return especialidades; }

    public void setEspecialidades(String especialidades) { this.especialidades = especialidades; }

    public Integer getNumeroVaga() {
        return numeroVaga;
    }

    public void setNumeroVaga(Integer numeroVaga) {
        this.numeroVaga = numeroVaga;
    }

    public Boolean getBloqueado() {
        return bloqueado;
    }

    public void setBloqueado(Boolean bloqueado) {
        this.bloqueado = bloqueado;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public Boolean getVaga() {
        return vaga;
    }

    public void setVaga(Boolean vaga) {
        this.vaga = vaga;
    }

    public Boolean getDisponivel() {
        return disponivel;
    }

    public void setDisponivel(Boolean disponivel) {
        this.disponivel = disponivel;
    }

    public List<EspecialidadeVo> getListaEspecialidades() {
        return listaEspecialidades;
    }

    public void setListaEspecialidades(List<EspecialidadeVo> listaEspecialidades) {
        this.listaEspecialidades = listaEspecialidades;
    }

    public List<CandidatoPlantaoVo> getListaCandidatosPlantao() {
        return listaCandidatosPlantao;
    }

    public void setListaCandidatosPlantao(List<CandidatoPlantaoVo> listaCandidatosPlantao) {
        this.listaCandidatosPlantao = listaCandidatosPlantao;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public Boolean getEmTroca() {
        return emTroca;
    }

    public void setEmTroca(Boolean emTroca) {
        this.emTroca = emTroca;
    }

    public Boolean getTemCandidatos() {
        return temCandidatos;
    }

    public void setTemCandidatos(Boolean temCandidatos) {
        this.temCandidatos = temCandidatos;
    }

    public List<PlantaoSetorVo> getListaSetores() {
        return listaSetores;
    }

    public void setListaSetores(List<PlantaoSetorVo> listaSetores) {
        this.listaSetores = listaSetores;
    }

    public WorkplaceItemVo getWorkplaceItem() {
        return workplaceItem;
    }

    public void setWorkplaceItem(WorkplaceItemVo workplaceItem) {
        this.workplaceItem = workplaceItem;
    }

    public String getBlockedReason() {
        return blockedReason;
    }

    public void setBlockedReason(String blockedReason) {
        this.blockedReason = blockedReason;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlantaoVo plantaoVo = (PlantaoVo) o;
        return Objects.equals(id, plantaoVo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
