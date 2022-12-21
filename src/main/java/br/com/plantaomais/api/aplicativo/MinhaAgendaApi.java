package br.com.plantaomais.api.aplicativo;

import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.aplicativo.MinhaAgendaController;
import br.com.plantaomais.filtro.aplicativo.FiltroMinhaAgenda;
import br.com.plantaomais.filtro.aplicativo.FiltroTrocaVaga;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.aplicativo.TrocaVagaVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

/**
 * @author Vitor Hoffmann
 */
@Path("minhaAgenda")
public class MinhaAgendaApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listarPlantoes")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info listarPlantoes(FiltroMinhaAgenda filtro) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.listarPlantoesMinhaAgenda(filtro, false);
    }

    @POST
    @Path("doarVaga")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info doarVaga(PlantaoVo plantaoVo) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.doarVaga(plantaoVo);
    }

    @POST
    @Path("listaTrocaVaga")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info listaTrocaVaga(FiltroTrocaVaga filtro) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.listaTrocaVaga(filtro);
    }

    @POST
    @Path("solicitarTrocaDePlantao")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info solicitarTrocaDePlantao(TrocaVagaVo trocaVagaVo) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.solicitarTrocaDePlantao(trocaVagaVo);
    }

    @POST
    @Path("trocaVaga")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info trocaVaga(TrocaVagaVo trocaVagaVo) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.trocaVaga(trocaVagaVo);
    }

    @POST
    @Path("colocarPlantaoEmTroca")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info colocarPlantaoEmTroca(PlantaoVo plantaoVo) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.colocarPlantaoEmTroca(plantaoVo);
    }

    @POST
    @Path("desistirTrocaPlantao")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info desistirTrocaPlantao(PlantaoVo plantaoVo) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.desistirTrocaPlantao(plantaoVo);
    }

    @POST
    @Path("obterCandidatoPlantao")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info obterCandidatoPlantao(PlantaoVo plantaoVo) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.obterCandidatoPlantao(plantaoVo);
    }

    @POST
    @Path("cancelarCandidaturaPlantao")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info cancelarCandidaturaPlantao(PlantaoVo plantaoVo) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.cancelarCandidaturaPlantao(plantaoVo);
    }

    @POST
    @Path("desistirDoacao")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info desistirDoacao(PlantaoVo plantaoVo) throws AuthenticationException {
        MinhaAgendaController controller = new MinhaAgendaController(context.getUserPrincipal());
        return controller.desistirDoacao(plantaoVo);
    }

}

