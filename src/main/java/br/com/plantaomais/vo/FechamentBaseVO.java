package br.com.plantaomais.vo;

/**
 * Created by gmribas on 30/04/20.
 */
public class FechamentBaseVO {

    protected Double valorBruto;

    protected String turno;

    protected String setor;

    protected String horaInicio;

    protected String horaFim;

    public FechamentBaseVO() {
    }

    public FechamentBaseVO(FechamentBaseVO baseVO) {
        this.valorBruto = baseVO.valorBruto;
        this.turno = baseVO.turno;
        this.setor = baseVO.setor;
        this.horaInicio = baseVO.horaInicio;
        this.horaFim = baseVO.horaFim;
    }

    public Double getValorBruto() {
        return valorBruto;
    }

    public void setValorBruto(Double valorBruto) {
        this.valorBruto = valorBruto;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(String horaFim) {
        this.horaFim = horaFim;
    }
}