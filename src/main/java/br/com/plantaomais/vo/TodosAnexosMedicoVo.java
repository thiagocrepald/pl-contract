package br.com.plantaomais.vo;

import java.util.List;

/**
 * Created by nextage on 25/06/2019.
 */
public class TodosAnexosMedicoVo {
    private CampoAnexoVo campoAnexo;
    private List<MedicoAnexoVo> listMedicoAnexo;


    public CampoAnexoVo getCampoAnexo() {
        return campoAnexo;
    }

    public void setCampoAnexo(CampoAnexoVo campoAnexo) {
        this.campoAnexo = campoAnexo;
    }

    public List<MedicoAnexoVo> getListMedicoAnexo() {
        return listMedicoAnexo;
    }

    public void setListMedicoAnexo(List<MedicoAnexoVo> listMedicoAnexo) {
        this.listMedicoAnexo = listMedicoAnexo;
    }
}
