package br.com.plantaomais.api;

import br.com.plantaomais.controller.CityController;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.CityVo;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("cities")
public class CityApi {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Info find(@QueryParam("id") Integer id, @QueryParam("stateId") Integer stateId) {
        try {
            CityController controller = new CityController();

            List<CityVo> cityVo;

            if (id != null) {
                cityVo = controller.findOne(id);
            }
            else if (stateId != null) {
                cityVo = controller.findByState(stateId);
            }
            else {
                cityVo = controller.findAll();
            }

            return Info.GetSuccess(cityVo);
        }
        catch (Exception e) {
            return Info.GetError("find", e.getMessage());
        }
    }
}
