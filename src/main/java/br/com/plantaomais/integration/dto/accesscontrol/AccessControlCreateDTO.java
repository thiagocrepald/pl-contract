package br.com.plantaomais.integration.dto.accesscontrol;

import br.com.plantaomais.integration.dto.oncall.OnCallIdDTO;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.io.Serializable;

public class AccessControlCreateDTO implements Serializable {

    @Null
    private Long id;

    @Valid
    @NotNull
    private OnCallIdDTO onCall;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OnCallIdDTO getOnCall() {
        return onCall;
    }

    public void setOnCall(OnCallIdDTO onCall) {
        this.onCall = onCall;
    }

}
