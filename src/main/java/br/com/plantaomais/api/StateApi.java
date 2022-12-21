package br.com.plantaomais.api;

import br.com.plantaomais.controller.StateController;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.StateVo;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("states")
public class StateApi {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Info find(@QueryParam("id") Integer id) {
        try {
            StateController controller = new StateController();

            List<StateVo> statesVo =
                (id == null)
                    ? controller.findAllVo()
                    : controller.findOne(id);

            return Info.GetSuccess(statesVo);
        }
        catch (Exception e) {
            return Info.GetError("find", e.getMessage());
        }
    }
}
