package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.CursoController;
import br.com.plantaomais.controller.aplicativo.CursoUnsecuredController;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.CursoVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

@Path("cursos")
public class CursoApi {

    @Context
    private SecurityContext context;

    @GET
    @Path("listar")
    @Produces(MediaType.APPLICATION_JSON)
    public Info listarComboCurso() throws AuthenticationException {
        CursoUnsecuredController controller = new CursoUnsecuredController();
        try {
            return Info.GetSuccess(controller.listarComboCurso());
        } catch (Exception e) {
            return Info.GetError("listar", e.getMessage());
        }
    }

    @POST
    @Path("salvar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info salvar(CursoVo vo) throws AuthenticationException {
        CursoController controller = new CursoController(context.getUserPrincipal());
        try {
            return Info.GetSuccess(controller.salvar(vo));
        } catch (Exception e){
            return Info.GetError("save", e.getMessage());
        }
    }


}
