package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.IndicadoresController;
import br.com.plantaomais.filtro.FiltroPlantao;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.UsuarioVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

@Path("indicadores")
public class IndicadoresApi {

    @Context
    private SecurityContext context;


    @POST
    @Path("criarIndicadores")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info criarIndicadores(FiltroPlantao filtro) throws AuthenticationException {
        IndicadoresController controller = new IndicadoresController((UsuarioVo) context.getUserPrincipal());
        return controller.criarIndicadores(filtro);
    }

    @POST
    @Path("profissionaisMaisAtivos")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info profissionaisMaisAtivos(FiltroPlantao filtro) throws AuthenticationException {
        IndicadoresController controller = new IndicadoresController(context.getUserPrincipal());
        return controller.profissionaisMaisAtivos(filtro);
    }

    @POST
    @Path("criarIndicadoGestaoEscala")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info criarIndicadoGestaoEscala(FiltroPlantao filtro) throws AuthenticationException {
        IndicadoresController controller = new IndicadoresController(context.getUserPrincipal());
        return controller.criarIndicadoGestaoEscala(filtro);
    }

    @POST
    @Path("criarIndicadorPoporcaoSexo")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info criarIndicadorPoporcaoSexo(FiltroPlantao filtro) throws AuthenticationException {
        IndicadoresController controller = new IndicadoresController(context.getUserPrincipal());
        return controller.criarIndicadorPoporcaoSexo(filtro);
    }
}
