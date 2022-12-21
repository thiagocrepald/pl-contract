package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.EscalaController;
import br.com.plantaomais.filtro.FiltroEscala;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.EscalaVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.UsuarioVo;

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

/**
 * Created by nextage on 14/05/2019.
 */
@Path("escala")
public class EscalaApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<EscalaVo> listar(@QueryParam("ativo") String ativo, @QueryParam("dataInicio") String dataInicio, @QueryParam("dataFim") String dataFim, @QueryParam("contractId") Long contractId) throws AuthenticationException {
        EscalaController controller = new EscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.listar(ativo, dataInicio, dataFim, contractId);
    }

    @POST
    @Path("salvar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info salvar(EscalaVo vo) throws AuthenticationException {
        EscalaController controller = new EscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.salvar(vo);
    }

    @POST
    @Path("getById")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info getById(EscalaVo vo) throws AuthenticationException {
        EscalaController controller = new EscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.getEscalaById(vo);
    }

    @POST
    @Path("excluir")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info excluir(EscalaVo vo) throws AuthenticationException {
        EscalaController controller = new EscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.excluir(vo);
    }

    @POST
    @Path("listarEscalaPlantao")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<PlantaoVo> listarEscalaPlantao(FiltroEscala filtro) throws AuthenticationException {
        EscalaController controller = new EscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.listarEscalaPlantao(filtro);
    }

    @POST
    @Path("listarComboEscala")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<EscalaVo> listarComboEscala() throws AuthenticationException {
        EscalaController controller = new EscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.listarComboEscala();
    }

    @POST
    @Path("replicarEscala")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info replicarEscala(EscalaVo vo) throws AuthenticationException {
        EscalaController controller = new EscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.replicarEscala(vo);
    }

    @POST
    @Path("divulgarPlantoesEscala")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info divulgarPlantoesEscala(EscalaVo vo) throws AuthenticationException {
        EscalaController controller = new EscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.divulgarPlantoesEscala(vo);
    }

    @POST
    @Path("/{id}/notify-medics")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info notify(@PathParam("id") Integer id) throws AuthenticationException {
        EscalaController controller = new EscalaController((UsuarioVo) context.getUserPrincipal());
        return controller.notificarMedicosPlantoesDisponiveis(id);
    }

}
