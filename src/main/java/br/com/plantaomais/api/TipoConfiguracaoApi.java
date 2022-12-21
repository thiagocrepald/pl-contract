package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.TipoConfiguracaoController;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.TipoConfiguracaoVo;
import br.com.plantaomais.vo.UsuarioVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

/**
 * Created by nextage on 17/06/2019.
 */
@Path("tipoConfiguracao")
public class TipoConfiguracaoApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listarComboTipoConfiguracao")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<TipoConfiguracaoVo> listarComboTipoConfiguracao() throws AuthenticationException {
        TipoConfiguracaoController controller = new TipoConfiguracaoController((UsuarioVo) context.getUserPrincipal());
        return controller.listarComboTipoConfiguracao();
    }
}
