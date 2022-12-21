package br.com.plantaomais.filtro;

import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.MedicoVo;

import java.util.Date;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
public class FiltroPlantao {
    private Boolean disponivel;
    private EspecialidadeVo especialidade;
    private String estado;
    private String cidade;
    private String periodo;
    private Date dataInicio;
    private Date dataFim;

    private Date dataInicioIndicadorGestao;
    private Date dataFimIndicadorGestao;

    private MedicoVo medico;

    private List<EspecialidadeVo> listaEspecialidades;

    public Boolean getDisponivel() {
        return disponivel;
    }

    public void setDisponivel(Boolean disponivel) {
        this.disponivel = disponivel;
    }

    public EspecialidadeVo getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(EspecialidadeVo especialidade) {
        this.especialidade = especialidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public Date getDataFim() {
        return dataFim;
    }

    public void setDataFim(Date dataFim) {
        this.dataFim = dataFim;
    }

    public Date getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(Date dataInicio) {
        this.dataInicio = dataInicio;
    }

    public Date getDataInicioIndicadorGestao() {
        return dataInicioIndicadorGestao;
    }

    public void setDataInicioIndicadorGestao(Date dataInicioIndicadorGestao) {
        this.dataInicioIndicadorGestao = dataInicioIndicadorGestao;
    }

    public Date getDataFimIndicadorGestao() {
        return dataFimIndicadorGestao;
    }

    public void setDataFimIndicadorGestao(Date dataFimIndicadorGestao) {
        this.dataFimIndicadorGestao = dataFimIndicadorGestao;
    }

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public List<EspecialidadeVo> getListaEspecialidades() {
        return listaEspecialidades;
    }

    public void setListaEspecialidades(List<EspecialidadeVo> listaEspecialidades) {
        this.listaEspecialidades = listaEspecialidades;
    }
}
