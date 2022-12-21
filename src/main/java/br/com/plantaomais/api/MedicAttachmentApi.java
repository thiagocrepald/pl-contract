package br.com.plantaomais.api;

import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.MedicAttachmentController;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.MedicoAnexoVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

/**
 * Created by gmribas on 23/03/20.
 */
@Path("medicoAnexo")
public class MedicAttachmentApi {

    @Context
    private SecurityContext context;

    @GET
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info find(@QueryParam("id") Integer id, @QueryParam("campoAnexoId") Integer attachmentId, @QueryParam("ordem") String orderBy) {
        try {
            MedicAttachmentController controller = new MedicAttachmentController(context.getUserPrincipal());
            return Info.GetSuccess(controller.findForCurrentMedic(id, attachmentId, null, orderBy));
        } catch (Exception e) {
            return Info.GetError("find()", e.getMessage());
        }
    }

    @GET
    @SecuredApp
    @Path("simple")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info findSimpleVO(@QueryParam("id") Integer id, @QueryParam("campoAnexoId") Integer attachmentId, @QueryParam("ordem") String orderBy) {
        try {
            MedicAttachmentController controller = new MedicAttachmentController(context.getUserPrincipal());
            return Info.GetSuccess(controller.findSimpleVOForCurrentMedic(id, attachmentId, null, orderBy));
        } catch (Exception e) {
            return Info.GetError("findSimpleVO", e.getMessage());
        }
    }

    @POST
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info save(MedicoAnexoVo attachment) {
        try {
            return Info.GetSuccess(doSave(attachment));
        } catch (Exception e) {
            return Info.GetError("save", e.getMessage());
        }
    }

    private MedicoAnexoVo doSave(MedicoAnexoVo attachment) throws Exception {
        MedicAttachmentController controller = new MedicAttachmentController(context.getUserPrincipal());
        return controller.save(attachment);
    }

    @POST
    @SecuredApp
    @Path("all")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info saveAll(List<MedicoAnexoVo> attachments) {
        try {
            MedicAttachmentController controller = new MedicAttachmentController(context.getUserPrincipal());
            controller.saveAll(attachments);
            return Info.GetSuccess();
        } catch (Exception e) {
            return Info.GetError("save", e.getMessage());
        }
    }

    @PUT
    @SecuredApp
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info update(MedicoAnexoVo attachment) {
        try {
            return Info.GetSuccess(doSave(attachment));
        } catch (Exception e) {
            return Info.GetError("update", e.getMessage());
        }
    }

    @POST
    @SecuredApp
    @Path("markAsSeen")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info markAsSeen(@QueryParam("id") Integer id) {
        try {
            MedicAttachmentController controller = new MedicAttachmentController(context.getUserPrincipal());
            return Info.GetSuccess(controller.markAsSeen(id));
        } catch (Exception e) {
            return Info.GetError("markAsSeen", e.getMessage());
        }
    }


    @GET
    @Path("/pending")
    @SecuredApp
    @Produces(MediaType.APPLICATION_JSON)
    public Info getDocumentsPending() {
        try {
            MedicAttachmentController controller = new MedicAttachmentController(context.getUserPrincipal());
            return Info.GetSuccess(controller.getAttachmentsPending());
        } catch (AuthenticationException e) {
            return Info.GetError("Authentication failed", e.getMessage());
        }
    }
}
