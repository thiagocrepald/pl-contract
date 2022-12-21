package br.com.plantaomais.api.aplicativo;


import br.com.plantaomais.config.Secured;
import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.aplicativo.PlantaoAppController;
import br.com.plantaomais.filtro.FiltroCalendario;
import br.com.plantaomais.filtro.FiltroPlantao;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.BusinessException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.util.ResponseInfo;
import br.com.plantaomais.vo.CandidatoPlantaoVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.aplicativo.ContratoCalendarioVo;
import br.com.plantaomais.vo.aplicativo.PlantaoCalendarioVo;
import br.com.plantaomais.vo.aplicativo.PlantaoDiaVo;
import br.com.plantaomais.vo.aplicativo.PlantaoUrlVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

/**
 * @author Matheus Toledo
 */
@Path("plantaoApp")
public class PlantaoAppApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<PlantaoVo> listar(FiltroPlantao filtro) throws AuthenticationException {
        PlantaoAppController controller = new PlantaoAppController(context.getUserPrincipal());
        return controller.listar(filtro);
    }

    @POST
    @Path("candidatarMedico")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info candidatarMedico(CandidatoPlantaoVo candidatoPlantaoVo) throws AuthenticationException {
        PlantaoAppController controller = new PlantaoAppController(context.getUserPrincipal());
        return controller.candidatarMedico(candidatoPlantaoVo);
    }

    @POST
    @Path("aceitarRecusarDoacao")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info aceitarRecusarDoacao(CandidatoPlantaoVo candidatoPlantaoVo) throws AuthenticationException {
        PlantaoAppController controller = new PlantaoAppController(context.getUserPrincipal());
        return controller.aceitarRecusarDoacao(candidatoPlantaoVo);
    }

    @POST
    @Path("calendario")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<ContratoCalendarioVo> listarCalendarios(FiltroCalendario filtro) throws AuthenticationException {
        PlantaoAppController controller = new PlantaoAppController(context.getUserPrincipal());
        return controller.listarCalendario(filtro);
    }

    @GET
    @Path("calendario/workplace")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<PlantaoCalendarioVo> getCalendarioPorWorkplace(@QueryParam("workplaceId") Integer workplaceId) throws AuthenticationException {
        PlantaoAppController controller = new PlantaoAppController(context.getUserPrincipal());
        return controller.getPlantoesWorkplace(workplaceId);
    }

    @GET
    @Path("calendario/workplace/dia")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<PlantaoDiaVo> getPlantoesPorDia(@QueryParam("workplaceId") Integer workplaceId, @QueryParam("dia") String dia) throws AuthenticationException {
        PlantaoAppController controller = new PlantaoAppController(context.getUserPrincipal());
        return controller.getPlantoesDia(workplaceId, dia);
    }


    @GET
    @Path("plantao/gerarUrl")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ResponseInfo<PlantaoUrlVo> getUrlPlantao(@QueryParam("plantaoId") Integer plantaoId) throws AuthenticationException {
        try {
            PlantaoAppController controller = new PlantaoAppController(context.getUserPrincipal());
            var urlPlantao = controller.getUrlPlantao(plantaoId, false);
            return new ResponseInfo<PlantaoUrlVo>().success(urlPlantao);
        } catch (BusinessException e) {
            return new ResponseInfo<PlantaoUrlVo>().error(e.getMessage());
        }
    }

    @GET
    @Path("escala/gerarUrl")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ResponseInfo<PlantaoUrlVo> getUrlPlantaoEscala(@QueryParam("escalaId") Integer escalaId) throws AuthenticationException {
        try {
            PlantaoAppController controller = new PlantaoAppController(context.getUserPrincipal());
            var urlEscala = controller.getUrlPlantaoEscala(escalaId);
            return new ResponseInfo<PlantaoUrlVo>().success(urlEscala);
        } catch (BusinessException e) {
            return new ResponseInfo<PlantaoUrlVo>().error(e.getMessage());
        }
    }

    @GET
    @Path("plantao/escalista/gerarUrl")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ResponseInfo<PlantaoUrlVo> getUrlPlantaoEscalista(@QueryParam("plantaoId") Integer plantaoId) throws AuthenticationException {
        try {
            PlantaoAppController controller = new PlantaoAppController(context.getUserPrincipal());
            var urlPlantao = controller.getUrlPlantao(plantaoId, true);
            return new ResponseInfo<PlantaoUrlVo>().success(urlPlantao);
        } catch (BusinessException e) {
            return new ResponseInfo<PlantaoUrlVo>().error(e.getMessage());
        }
    }
}
