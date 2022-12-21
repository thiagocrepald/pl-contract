package br.com.plantaomais.api;

import br.com.nextage.util.Info;
import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.EspecialidadeController;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.EspecialidadeVo;
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
@Path("especialidade")
public class EspecialidadeApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<EspecialidadeVo> listarComboEspecialidade() throws AuthenticationException {
        EspecialidadeController controller = new EspecialidadeController((UsuarioVo) context.getUserPrincipal());
        return controller.listarComboEspecialidade();
    }

    @POST
    @Path("salvar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info salvar(EspecialidadeVo vo) throws AuthenticationException {
        EspecialidadeController controller = new EspecialidadeController((UsuarioVo) context.getUserPrincipal());
        return controller.salvar(vo);
    }

    @POST
    @Path("listarComboEspecialidadeApp")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<EspecialidadeVo> listarComboEspecialidadeApp()  {
        br.com.plantaomais.controller.aplicativo.EspecialidadeController controller = new br.com.plantaomais.controller.aplicativo.EspecialidadeController();
        return controller.listarComboEspecialidade();
    }
}
