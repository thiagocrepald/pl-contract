package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.GestaoEscalaController;
import br.com.plantaomais.filtro.FiltroGestaoEscala;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.*;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

/**
 * Created by nextage on 14/05/2019.
 */
@Path("gestaoEscala")
public class GestaoEscalaApi {

    @Context
    private SecurityContext context;

    @POST
    @Path("listaLayoutEscala")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info listaLayoutEscala(FiltroGestaoEscala filtroGestaoEscala) throws AuthenticationException {
        GestaoEscalaController controller = new GestaoEscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.listaLayoutEscala(filtroGestaoEscala);
    }

    @POST
    @Path("listaLayoutEscala/workplace/{id}")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info listaLayoutEscala(@PathParam("id") Integer id) throws AuthenticationException {
        GestaoEscalaController controller = new GestaoEscalaController(context.getUserPrincipal());
        return controller.listaLayoutEscalaByWorkplaceId(id);
    }

    @POST
    @Path("gerarExcel")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info gerarExcel(FiltroGestaoEscala filtro) throws AuthenticationException {
        GestaoEscalaController controller = new GestaoEscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.gerarExcel(filtro);
    }

    @POST
    @Path("listaCanditadosPlantao")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<CandidatoPlantaoVo> listaCanditadosPlantao(PlantaoVo plantao) throws AuthenticationException {
        GestaoEscalaController controller = new GestaoEscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.listaCanditadosPlantao(plantao);
    }

    @POST
    @Path("aceitaMedico")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info aceitaMedico(PlantaoVo plantao) throws AuthenticationException {
        GestaoEscalaController controller = new GestaoEscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.aceitaMedico(plantao);
    }

    @POST
    @Path("recusaMedico")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info recusaMedico(@QueryParam("candidatos") List<Integer> candidatesIds) throws AuthenticationException {
        GestaoEscalaController controller = new GestaoEscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.refuseCandidates(candidatesIds);
    }

}
