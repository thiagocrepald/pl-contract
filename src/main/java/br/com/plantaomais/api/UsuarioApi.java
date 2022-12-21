package br.com.plantaomais.api;


import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.TipoPermissaoController;
import br.com.plantaomais.controller.UsuarioController;
import br.com.plantaomais.filtro.FiltroUsuario;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.TipoPermissaoVo;
import br.com.plantaomais.vo.UsuarioVo;

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


@Path("usuario")
public class UsuarioApi {

    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<UsuarioVo> listar(FiltroUsuario filtro) throws AuthenticationException {
        UsuarioController controller = new UsuarioController((UsuarioVo) context.getUserPrincipal());
        return controller.listar(filtro);
    }

    @POST
    @Path("salvar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info salvar(UsuarioVo vo) throws AuthenticationException {
        UsuarioController controller = new UsuarioController((UsuarioVo) context.getUserPrincipal());
        return controller.salvar(vo);
    }

    @POST
    @Path("getById")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info getById(UsuarioVo vo) throws AuthenticationException {
        UsuarioController controller = new UsuarioController((UsuarioVo) context.getUserPrincipal());
        return controller.getUsuarioById(vo);
    }

    @POST
    @Path("listarTipoPermissao")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<TipoPermissaoVo> listarTipoPermissao() throws AuthenticationException {
        TipoPermissaoController controller = new TipoPermissaoController((UsuarioVo) context.getUserPrincipal());
        return controller.listar();
    }

    @POST
    @Path("excluir")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info excluir(UsuarioVo vo) throws AuthenticationException {
        UsuarioController controller = new UsuarioController((UsuarioVo) context.getUserPrincipal());
        return controller.excluir(vo);
    }

    @PUT
    @Path("salvarSenhaExclusaoEscala")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info saveDeletePassword(@QueryParam("id") Integer id, @QueryParam("password") String password) throws AuthenticationException {
        UsuarioController controller = new UsuarioController((UsuarioVo) context.getUserPrincipal());
        return controller.saveDeletePassword(id, password);
    }

    @GET
    @Path("verificaSenhaExclusaoEscala")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info verifyDeletePassword(@QueryParam("id") Integer id, @QueryParam("password") String password) throws AuthenticationException {
        UsuarioController controller = new UsuarioController((UsuarioVo) context.getUserPrincipal());
        return controller.verifyDeletePassword(id, password);
    }
}
