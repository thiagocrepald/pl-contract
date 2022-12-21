package br.com.plantaomais.vo;

import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.PlantaoSetor;
import br.com.plantaomais.util.DateUtils;
import org.joda.time.DateTime;
import org.joda.time.Weeks;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class EscalaReportVo {

    private Integer semana;
    private String diaDaSemana;
    private String periodo;
    private String dia;
    private String hora;
    private String setor;
    private String status;
    private String medico;

    public EscalaReportVo(PlantaoSetor plantaoSetor) {
        var plantao = plantaoSetor.getPlantao();
        var date = new DateTime(plantao.getData());

        var horaInicio = DateUtils.formatHour(plantao.getHoraInicio());
        var horaFim = DateUtils.formatHour(plantao.getHoraFim());
        var strDate = DateUtils.formatDate(plantao.getData());

        this.semana = Weeks.weeksBetween(date.withDayOfMonth(1), date).getWeeks() + 1;
        this.diaDaSemana = plantao.getDia();
        this.periodo = plantao.getTurno();
        this.dia = strDate;
        this.hora = horaInicio + " / " + horaFim;
        this.setor = plantaoSetor.getSetor().getDescricao();
        this.status = plantao.getLabelOfStatus();
        this.medico = Optional.ofNullable(plantao.getMedico()).map(Medico::getNome).orElse("");
    }


    public static List<String> getHeaders() {
        return Arrays.asList(
                "SEMANA",
                "DIA DA SEMANA",
                "TURNO",
                "DIA",
                "HORA",
                "SETOR",
                "STATUS",
                "MEDICO"
        );
    }

    public Integer getDiaSemanaValor() {
        switch (this.diaDaSemana){
            case "segunda":
                return 0;
            case "terça":
                return 1;
            case "quarta":
                return 2;
            case "quinta":
                return 3;
            case "sexta":
                return 4;
            case "sabado":
                return 5;
            case "domingo":
                return 6;
            default:
                return 0;
        }
    }

    public Integer getTurnoValor() {
        switch (this.periodo){
            case "manhã":
                return 0;
            case "tarde":
                return 1;
            case "noite":
                return 2;
            case "cinderela":
                return 3;
            default:
                return 0;
        }
    }


    public List<String> toWorkbookSheetRow() {
        return Arrays.asList(
                this.semana.toString(),
                this.diaDaSemana,
                this.periodo,
                this.dia,
                this.hora,
                this.setor,
                this.status,
                this.medico
        );
    }

    public Integer getSemana() {
        return semana;
    }

    public void setSemana(Integer semana) {
        this.semana = semana;
    }

    public String getDiaDaSemana() {
        return diaDaSemana;
    }

    public void setDiaDaSemana(String diaDaSemana) {
        this.diaDaSemana = diaDaSemana;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }

    public String getMedico() {
        return medico;
    }

    public void setMedico(String medico) {
        this.medico = medico;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
