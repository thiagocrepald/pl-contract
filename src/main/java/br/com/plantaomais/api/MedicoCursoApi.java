package br.com.plantaomais.api;

import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.MedicoCursoController;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.MedicoCursoVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

@Path("medico/cursos")
public class MedicoCursoApi {

    @Context
    private SecurityContext context;

    @GET
    @Path("listar")
    @SecuredApp
    @Produces(MediaType.APPLICATION_JSON)
    public Info listar() throws AuthenticationException {
        MedicoCursoController controller = new MedicoCursoController(context.getUserPrincipal());
        try {
            return Info.GetSuccess(controller.listarMedicoCursosComAnexo());
        } catch (Exception e) {
            return Info.GetError("listar", e.getMessage());
        }
    }

    @POST
    @Path("salvar")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info salvar(MedicoCursoVo vo) throws AuthenticationException {
        MedicoCursoController controller = new MedicoCursoController(context.getUserPrincipal());
        try {
            return Info.GetSuccess(controller.salvar(vo));
        } catch (Exception e){
            return Info.GetError("save", e.getMessage());
        }
    }


}
