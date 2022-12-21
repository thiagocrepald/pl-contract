package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.FechamentoController;
import br.com.plantaomais.filtro.FiltroFechamento;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.ArquivoVo;
import br.com.plantaomais.vo.FechamentoVo;
import br.com.plantaomais.vo.UsuarioVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

/**
 * Created by nextage on 04/07/2019.
 */
@Path("fechamento")
public class FechamentoApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public FechamentoVo listar(FiltroFechamento filtro) throws AuthenticationException {
        FechamentoController controller = new FechamentoController((UsuarioVo) context.getUserPrincipal());
        return controller.listar(filtro);
    }

    @POST
    @Secured
    @Path("gerarExcel")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ArquivoVo gerarExcel(FiltroFechamento filtro) throws AuthenticationException {
        FechamentoController controller = new FechamentoController((UsuarioVo) context.getUserPrincipal());
        return controller.gerarExcel(filtro);
    }

}
