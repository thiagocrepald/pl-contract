package br.com.plantaomais.vo.aplicativo;

import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.SetorVo;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class PlantaoDiaVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private Boolean disponivel;
    private Boolean emTroca;
    private Boolean candidato;
    private MedicoPlantaoSimpleVo medico;
    private List<EspecialidadeVo> listaEspecialidades;
    private List<SetorVo> setores;
    private String turno;
    private Date horaInicio;
    private Date horaFim;

    /*Campos detalhes*/
    private Date data;
    private String cidade;
    private String estado;
    private String local;
    private Double valor;
    private String status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getDisponivel() {
        return disponivel;
    }

    public void setDisponivel(Boolean disponivel) {
        this.disponivel = disponivel;
    }

    public Boolean getCandidato() {
        return candidato;
    }

    public void setCandidato(Boolean candidato) {
        this.candidato = candidato;
    }

    public MedicoPlantaoSimpleVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoPlantaoSimpleVo medico) {
        this.medico = medico;
    }

    public List<EspecialidadeVo> getListaEspecialidades() {
        return listaEspecialidades;
    }

    public void setListaEspecialidades(List<EspecialidadeVo> listaEspecialidades) {
        this.listaEspecialidades = listaEspecialidades;
    }

    public List<SetorVo> getSetores() {
        return setores;
    }

    public void setSetores(List<SetorVo> setores) {
        this.setores = setores;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
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

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getEmTroca() {
        return emTroca;
    }

    public void setEmTroca(Boolean emTroca) {
        this.emTroca = emTroca;
    }
}
