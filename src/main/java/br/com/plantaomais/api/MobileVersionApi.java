package br.com.plantaomais.api;

import br.com.plantaomais.controller.MobileVersionController;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.MobileVersionVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path("mobile-versions")
public class MobileVersionApi {

    @GET
    @Produces(APPLICATION_JSON)
    public Info find() throws Exception {
        MobileVersionController controller = new MobileVersionController();
        return controller.findVersion();
    }

    @POST
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info createOrUpdateMobileVersion(MobileVersionVo vo) throws Exception {
        MobileVersionController controller = new MobileVersionController();
        return controller.createOrUpdateMobileVersion(vo);
    }
}
