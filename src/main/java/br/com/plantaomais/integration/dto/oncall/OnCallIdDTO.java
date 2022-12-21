package br.com.plantaomais.integration.dto.oncall;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

public class OnCallIdDTO implements Serializable {

    @NotNull
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
