package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.EventController;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.EventVO;
import br.com.plantaomais.vo.UsuarioVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

/**
 * Created by gmribas on 27/04/20.
 */
@Path("evento")
public class EventApi {

    @Context
    private SecurityContext context;

    @GET
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info find(@QueryParam("id") Integer id, @QueryParam("active") Boolean active, @QueryParam("order") String orderBy) {
        try {
            EventController controller = new EventController(context.getUserPrincipal());
            return Info.GetSuccess(controller.find(id, active, orderBy));
        } catch (Exception e) {
            return Info.GetError("find()", e.getMessage());
        }
    }

    @GET
    @Path("mobile")
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info findMobile(@QueryParam("id") Integer id, @QueryParam("active") Boolean active, @QueryParam("order") String orderBy) {
        try {
            EventController controller = new EventController(context.getUserPrincipal());
            return Info.GetSuccess(controller.find(id, active, orderBy));
        } catch (Exception e) {
            return Info.GetError("findMobile()", e.getMessage());
        }
    }

    @POST
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info save(EventVO event) {
        try {
            return Info.GetSuccess(doSave(event));
        } catch (Exception e) {
            return Info.GetError("save", e.getMessage());
        }
    }

    @PUT
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info update(EventVO event) {
        try {
            return Info.GetSuccess(doSave(event));
        } catch (Exception e) {
            return Info.GetError("update", e.getMessage());
        }
    }

    @DELETE
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info delete(@QueryParam("id") Integer eventId) {
        try {
            EventController controller = new EventController((UsuarioVo) context.getUserPrincipal());
            return Info.GetSuccess(controller.delete(eventId));
        } catch (Exception e) {
            return Info.GetError("delete", e.getMessage());
        }
    }

    private EventVO doSave(EventVO event) throws Exception {
        EventController controller = new EventController((UsuarioVo) context.getUserPrincipal());
        return controller.save(event);
    }
}
