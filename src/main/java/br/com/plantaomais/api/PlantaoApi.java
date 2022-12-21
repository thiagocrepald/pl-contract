package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.PlantaoController;
import br.com.plantaomais.filtro.FiltroPlantao;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.UsuarioVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
@Path("plantao")
public class PlantaoApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<PlantaoVo> listar(FiltroPlantao filtro) throws AuthenticationException {
        PlantaoController controller = new PlantaoController((UsuarioVo) context.getUserPrincipal());
        return controller.listar(filtro);
    }

    @POST
    @Path("getById")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info getById(PlantaoVo vo) throws AuthenticationException {
        PlantaoController controller = new PlantaoController((UsuarioVo) context.getUserPrincipal());
        return controller.getPlantaoById(vo);
    }

    @POST
    @Path("excluirPlantao")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info excluir(PlantaoVo vo) throws AuthenticationException {
        PlantaoController controller = new PlantaoController((UsuarioVo) context.getUserPrincipal());
        return controller.excluirPlantao(vo);
    }

    @POST
    @Path("atualizaPlantaoGestaoEscala")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info atualizaPlantaoGestaoEscala(PlantaoVo vo) throws AuthenticationException {
        PlantaoController controller = new PlantaoController((UsuarioVo) context.getUserPrincipal());
        return controller.atualizaPlantaoGestaoEscala(vo);
    }

//    @POST
//    @Path("adicionarMedicoPlantao")
//    @Secured
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Info adicionarMedicoPlantao(PlantaoVo vo) throws AuthenticationException {
//        PlantaoController controller = new PlantaoController((UsuarioVo) context.getUserPrincipal());
//        return controller.adicionarMedicoPlantao(vo);
//    }

}
