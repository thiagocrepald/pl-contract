package br.com.plantaomais.api;

import br.com.nextage.util.Info;
import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.TipoServicoController;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.TipoServicoVo;
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
 * Created by nextage on 10/05/2019.
 */
@Path("tipoServico")
public class TipoServicoApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<TipoServicoVo> listarComboTipoServico() throws AuthenticationException {
        TipoServicoController controller = new TipoServicoController((UsuarioVo) context.getUserPrincipal());
        return controller.listarComboTipoServico();
    }

    @POST
    @Path("salvar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info salvar(TipoServicoVo vo) throws AuthenticationException {
        TipoServicoController controller = new TipoServicoController((UsuarioVo) context.getUserPrincipal());
        return controller.salvar(vo);
    }
}
