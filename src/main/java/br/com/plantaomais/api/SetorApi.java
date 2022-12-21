package br.com.plantaomais.api;

import br.com.nextage.util.Info;
import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.SetorController;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.SetorVo;
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
@Path("setor")
public class SetorApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<SetorVo> listarComboSetor() throws AuthenticationException {
        SetorController controller = new SetorController((UsuarioVo) context.getUserPrincipal());
        return controller.listarComboSetor();
    }

    @POST
    @Path("salvar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info salvar(SetorVo vo) throws AuthenticationException {
        SetorController controller = new SetorController((UsuarioVo) context.getUserPrincipal());
        return controller.salvar(vo);
    }
    
}
