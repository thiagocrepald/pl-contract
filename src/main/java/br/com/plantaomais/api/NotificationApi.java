package br.com.plantaomais.api;

import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.NotificationController;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.NotificationVo;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

@Path("notification")
public class NotificationApi {

    @Context
    private SecurityContext context;

    @GET
    @SecuredApp
    @Produces(MediaType.APPLICATION_JSON)
    public Info getByMedic(@QueryParam("limit") int limit, @QueryParam("offset") int offset) throws AuthenticationException {
        NotificationController controller = new NotificationController((MedicoVo) context.getUserPrincipal());
        try {
            return Info.GetSuccess(controller.get(limit, offset));
        } catch (Exception e) {
            return Info.GetError("get notification to medic", e.getMessage());
        }
    }

    @PUT
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info updateStatus(NotificationVo notificationVo) throws AuthenticationException {
        NotificationController controller = new NotificationController((MedicoVo) context.getUserPrincipal());
        try {
            return Info.GetSuccess(controller.updateStatus(notificationVo));
        } catch (Exception e) {
            return Info.GetError("fail to update status.", e.getMessage());
        }
    }


}
