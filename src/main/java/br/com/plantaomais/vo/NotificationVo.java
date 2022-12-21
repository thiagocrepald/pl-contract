package br.com.plantaomais.vo;

import br.com.plantaomais.entitybean.enums.NotificationStatus;
import br.com.plantaomais.vo.aplicativo.TrocaVagaVo;

import java.io.Serializable;
import java.util.Date;

public class NotificationVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private MedicoVo medico;
    private String message;
    private Date date;
    private String type;
    private NotificationStatus status;
    private EscalaVo escala;
    private PlantaoVo plantao;
    private CandidatoPlantaoVo candidatoPlantao;
    private EventVO event;
    private TrocaVagaVo trocaVaga;

    public NotificationVo() {
    }

    private NotificationVo(Integer id, MedicoVo medico, String message, Date date, String type, NotificationStatus status, EscalaVo escala, PlantaoVo plantao, CandidatoPlantaoVo candidatoPlantaoVo, EventVO event, TrocaVagaVo trocaVaga) {
        this.id = id;
        this.medico = medico;
        this.message = message;
        this.date = date;
        this.type = type;
        this.status = status;
        this.escala = escala;
        this.plantao = plantao;
        this.candidatoPlantao = candidatoPlantaoVo;
        this.event = event;
        this.trocaVaga = trocaVaga;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public MedicoVo getMedico() {
        return medico;
    }

    public void setMedico(MedicoVo medico) {
        this.medico = medico;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public NotificationStatus getStatus() {
        return status;
    }

    public void setStatus(NotificationStatus status) {
        this.status = status;
    }

    public EscalaVo getEscala() {
        return escala;
    }

    public void setEscala(EscalaVo escala) {
        this.escala = escala;
    }

    public PlantaoVo getPlantao() {
        return plantao;
    }

    public void setPlantao(PlantaoVo plantao) {
        this.plantao = plantao;
    }

    public CandidatoPlantaoVo getCandidatoPlantao() {
        return candidatoPlantao;
    }

    public void setCandidatoPlantao(CandidatoPlantaoVo candidatoPlantao) {
        this.candidatoPlantao = candidatoPlantao;
    }

    public EventVO getEvent() {
        return event;
    }

    public void setEvent(EventVO event) {
        this.event = event;
    }

    public TrocaVagaVo getTrocaVaga() { return trocaVaga; }

    public void setTrocaVaga(TrocaVagaVo trocaVaga) { this.trocaVaga = trocaVaga; }

    public NotificationVo copy() {
        return new NotificationVo(
                this.id,
                this.medico,
                this.message,
                this.date,
                this.type,
                this.status,
                this.escala,
                this.plantao,
                this.candidatoPlantao,
                this.event,
                this.trocaVaga);
    }

    public static class Builder {
        private Integer id;
        private MedicoVo medico;
        private String message;
        private Date date;
        private String type;
        private NotificationStatus status;
        private EscalaVo escala;
        private PlantaoVo plantao;
        private EventVO event;
        private TrocaVagaVo trocaVagaVo;
        private CandidatoPlantaoVo candidatoPlantao;

        public Builder setId(Integer id) {
            this.id = id;
            return this;
        }

        public Builder setMedico(MedicoVo medico) {
            this.medico = medico;
            return this;
        }

        public Builder setMessage(String message) {
            this.message = message;
            return this;
        }

        public Builder setDate(Date date) {
            this.date = date;
            return this;
        }

        public Builder setType(String type) {
            this.type = type;
            return this;
        }

        public Builder setStatus(NotificationStatus status) {
            this.status = status;
            return this;
        }

        public Builder setEscala(EscalaVo escala) {
            this.escala = escala;
            return this;
        }

        public Builder setPlantao(PlantaoVo plantao) {
            this.plantao = plantao;
            return this;
        }


        public Builder setCandidatoPlantao(CandidatoPlantaoVo candidatoPlantao) {
            this.candidatoPlantao = candidatoPlantao;
            return this;
        }

        public Builder setEvent(EventVO event) {
            this.event = event;
            return this;
        }

        public Builder setTrocaVaga(TrocaVagaVo trocaVaga) {
            this.trocaVagaVo = trocaVaga;
            return this;
        }

        public NotificationVo create() {
            if (date == null) {
                date = new Date();
            }

            if (status == null) {
                status = NotificationStatus.PENDING;
            }
            return new NotificationVo(id, medico, message, date, type, status, escala, plantao, candidatoPlantao, event, trocaVagaVo);
        }
    }
}