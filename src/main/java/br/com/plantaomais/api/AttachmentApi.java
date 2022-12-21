package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.AttachmentController;
import br.com.plantaomais.entitybean.Attachment;
import br.com.plantaomais.entitybean.enums.AttachmentCompressionType;
import br.com.plantaomais.mapper.AttachmentMapper;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.AttachmentVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;
import java.util.Optional;

@Path("attachments")
public class AttachmentApi {

    @Context
    private SecurityContext context;

    @GET
    @Path("/{id}")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public AttachmentVo getById(@PathParam("id") Integer id) {
        AttachmentController controller = new AttachmentController();
        return AttachmentMapper.convertToVo(controller.findById(id));
    }

    @POST
    @Path("/compress/{type}/{id : (\\w+)?}")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info generateCompress(@PathParam("type") AttachmentCompressionType type,
                                 @PathParam("id") Integer id,
                                 @QueryParam("ativo") String ativo,
                                 @QueryParam("status") String status,
                                 @QueryParam("estado") String estado,
                                 @QueryParam("especialidade") String especialidade,
                                 @QueryParam("medicos") List<Integer> medicosId,
                                 @QueryParam("startDate") String startDate,
                                 @QueryParam("endDate") String endDate) {

        AttachmentController controller = new AttachmentController();
        try {
            Attachment attachment = controller.generateZipFromType(type, Optional.ofNullable(id), ativo, status, estado, especialidade, medicosId, startDate, endDate);
            return Info.GetSuccess(AttachmentMapper.convertToVo(attachment));
        }
        catch (Exception e) {

            return Info.GetError("compress attachment", e.getMessage());
        }

    }

}
