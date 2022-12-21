package br.com.plantaomais.vo;

import br.com.plantaomais.util.Util;

import java.io.Serializable;

/**
 * Created by nextage on 04/06/2019.
 */
public class MedicoAnexoExtraVo extends AuditoriaVo implements Serializable {

    public MedicoAnexoExtraVo() {
    }

    public MedicoAnexoExtraVo(String json) {
        MedicoAnexoExtraVo incoming = Util.convertJsonStringToObject(json, MedicoAnexoExtraVo.class);
        rgPossuiCpf = incoming.getRgPossuiCpf();
        appIgnoreStatus = incoming.getAppIgnoreStatus();
    }

    private Boolean rgPossuiCpf;
    private Boolean appIgnoreStatus;

    public Boolean getRgPossuiCpf() {
        return rgPossuiCpf;
    }

    public void setRgPossuiCpf(Boolean rgPossuiCpf) {
        this.rgPossuiCpf = rgPossuiCpf;
    }

    public Boolean getAppIgnoreStatus() { return appIgnoreStatus; }

    public void setAppIgnoreStatus(Boolean appIgnoreStatus) { this.appIgnoreStatus = appIgnoreStatus; }
}
