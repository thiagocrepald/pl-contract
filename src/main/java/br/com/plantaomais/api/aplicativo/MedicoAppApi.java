package br.com.plantaomais.api.aplicativo;

import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.MedicoController;
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
@Path("medicoApp")
public class MedicoAppApi {

    @Context
    private SecurityContext context;

    @POST
    @Path("getById")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @SecuredApp
    public Info getById(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.getMedicoById(vo);
    }

    @POST
    @Path("atualizarTokenPushNotificationMedico")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @SecuredApp
    public Info atualizarTokenPushNotificationMedico(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.atualizarTokenPushNotificationMedico(vo);
    }


    @POST
    @Path("obterAvatarMedico")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @SecuredApp
    public Info obterAvatarMedico(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.obterAvatarMedico(vo);
    }
}
