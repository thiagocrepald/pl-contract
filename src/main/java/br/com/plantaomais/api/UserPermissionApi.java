package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.UserPermissionController;
import br.com.plantaomais.entitybean.TipoPermissao;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.UsuarioVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

/**
 * Created by gmribas on 28/04/20.
 */
@Path("permissao")
public class UserPermissionApi {

    @Context
    private SecurityContext context;

    @GET
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("usuario")
    public Info userContainPermission(@QueryParam("tipo") TipoPermissao.Tipos type) {
        try {
            UserPermissionController controller = new UserPermissionController((UsuarioVo) context.getUserPrincipal());
            boolean userContainPermission = controller.userContainPermission(type);
            return Info.GetSuccess(userContainPermission);
        } catch (AuthenticationException e) {
            return Info.GetError("userContainPermission()", e.getMessage());
        }
    }
}
