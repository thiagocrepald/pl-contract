package br.com.plantaomais.api.aplicativo;

import br.com.plantaomais.controller.CampoAnexoController;
import br.com.plantaomais.util.Info;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

@Path("anexo")
public class AnexoApi {

    @Context
    private SecurityContext context;

    @GET
    @Path("tiposAnexo")
    @Produces(MediaType.APPLICATION_JSON)
    public Info ListarCamposAnexo() throws Exception {
        CampoAnexoController controller = new CampoAnexoController();
        return controller.listar();
    }

}
