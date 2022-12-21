package br.com.plantaomais.api;

import br.com.plantaomais.controller.PreferencesMedicUtilsController;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.PreferencesItemVo;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("utils")
public class PreferencesMedicUtilsApi {

    @GET
    @Path("weekdays")
    @Produces(MediaType.APPLICATION_JSON)
    public Info getWeekdaysOptions() {
        try {
            PreferencesMedicUtilsController controller = new PreferencesMedicUtilsController();

            List<PreferencesItemVo> weekdays = controller.getWeekdaysOptions();

            return Info.GetSuccess(weekdays);
        }
        catch (Exception e) {
            return Info.GetError("get options of weekdays", e.getMessage());
        }
    }

    @GET
    @Path("periodo")
    @Produces(MediaType.APPLICATION_JSON)
    public Info getPeriodoOptions() {
        try {
            PreferencesMedicUtilsController controller = new PreferencesMedicUtilsController();

            List<PreferencesItemVo> options = controller.getPeriodoOptions();

            return Info.GetSuccess(options);
        }
        catch (Exception e) {
            return Info.GetError("get options of periodo", e.getMessage());
        }
    }

    @GET
    @Path("setor")
    @Produces(MediaType.APPLICATION_JSON)
    public Info getSetorOptions() {
        try {
            PreferencesMedicUtilsController controller = new PreferencesMedicUtilsController();

            List<PreferencesItemVo> options = controller.getSetorOptions();

            return Info.GetSuccess(options);
        }
        catch (Exception e) {
            return Info.GetError("get options of setor", e.getMessage());
        }
    }

    @GET
    @Path("locality")
    @Produces(MediaType.APPLICATION_JSON)
    public Info getLocalityOptions() {
        try {
            PreferencesMedicUtilsController controller = new PreferencesMedicUtilsController();

            List<PreferencesItemVo> options = controller.getLocalityOptions();

            return Info.GetSuccess(options);
        }
        catch (Exception e) {
            return Info.GetError("get options of locality", e.getMessage());
        }
    }

}
