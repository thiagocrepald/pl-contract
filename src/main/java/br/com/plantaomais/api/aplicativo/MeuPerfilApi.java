package br.com.plantaomais.api.aplicativo;

import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.aplicativo.MeuPerfilController;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.MedicoVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

/**
 * @author Matheus Toledo
 */
@Path("meuPerfilApp")
public class MeuPerfilApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("obterInfosCadastro")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info obterInfosCadastro(MedicoVo medicoVo) throws AuthenticationException {
        MeuPerfilController controller = new MeuPerfilController(context.getUserPrincipal());
        return controller.obterInfosCadastro(medicoVo);
    }
}
