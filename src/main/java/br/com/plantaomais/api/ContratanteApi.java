package br.com.plantaomais.api;

import br.com.plantaomais.config.Secured;
import br.com.plantaomais.controller.ContratanteController;
import br.com.plantaomais.filtro.FiltroContratante;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.ContratanteVo;
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
 * Created by nextage on 09/05/2019.
 */
@Path("contratante")
public class ContratanteApi {
    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<ContratanteVo> listar(FiltroContratante filtro) throws AuthenticationException {
        ContratanteController controller = new ContratanteController((UsuarioVo) context.getUserPrincipal());
        return controller.listar(filtro);
    }

    @POST
    @Path("salvar")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info salvar(ContratanteVo vo) throws AuthenticationException {
        ContratanteController controller = new ContratanteController((UsuarioVo) context.getUserPrincipal());
        return controller.salvar(vo);
    }

    @POST
    @Path("excluir")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info excluir(ContratanteVo vo) throws AuthenticationException {
        ContratanteController controller = new ContratanteController((UsuarioVo) context.getUserPrincipal());
        return controller.excluir(vo);
    }

    @POST
    @Path("getById")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info getById(ContratanteVo vo) throws AuthenticationException {
        ContratanteController controller = new ContratanteController((UsuarioVo) context.getUserPrincipal());
        return controller.getContratanteById(vo);
    }

    @POST
    @Path("ativarContratante")
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info ativarContratante(ContratanteVo vo) throws AuthenticationException {
        ContratanteController controller = new ContratanteController((UsuarioVo) context.getUserPrincipal());
        return controller.ativarContratante(vo);
    }
}
