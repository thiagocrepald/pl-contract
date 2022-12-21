package br.com.plantaomais.api;

import br.com.plantaomais.controller.AuthController;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.UsuarioVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;
import java.util.logging.Logger;

@Path("auth")
public class AuthApi {

    private static final Logger logger = Logger.getLogger(AuthApi.class.getName());
    
    @Context
    private SecurityContext context;

    @POST
    @Path("login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info login(UsuarioVo vo) {
        UsuarioVo copy = new UsuarioVo();
        copy.setLogin(vo.getLogin());
        copy.setEmail(vo.getEmail());
        logger.info(getClass().getSimpleName() + " POST /login " + Util.getStringJsonFor(copy));

        AuthController controller = new AuthController(vo);
        return controller.login(vo);
    }

    @POST
    @Path("loginApp")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info loginApp(MedicoVo vo) {
        MedicoVo copy = new MedicoVo();
        copy.setEmail(vo.getEmail());
        logger.info(getClass().getSimpleName() + " POST /loginApp " + Util.getStringJsonFor(copy));
        AuthController controller = new AuthController(vo);
        return controller.loginApp(vo, false);
    }

    @POST
    @Path("loginBiometria")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info loginBiometry(MedicoVo vo) {
        MedicoVo copy = new MedicoVo();
        copy.setEmail(vo.getEmail());
        logger.info(getClass().getSimpleName() + " POST /loginBiometry " + Util.getStringJsonFor(copy));
        AuthController controller = new AuthController(vo);
        return controller.loginApp(vo, true);
    }

    @POST
    @Path("salvarPreCadastro")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info salvarPreCadastro(MedicoVo vo) {
        logger.info(getClass().getSimpleName() + " POST /salvarPreCadastro " + Util.getStringJsonFor(vo));
        AuthController controller = new AuthController();
        return controller.salvarPreCadastro(vo);
    }

    @POST
    @Path("confirmarEmail")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void confirmarEmail(MedicoVo vo) {
        logger.info(getClass().getSimpleName() + " POST /confirmarEmail " + Util.getStringJsonFor(vo));
        AuthController controller = new AuthController();
        controller.confirmarEmail(vo);
    }

    @POST
    @Path("reenviarEmailConfirmacao")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info reenviarEmailConfirmacao(MedicoVo vo) {
        logger.info(getClass().getSimpleName() + " POST /reenviarEmailConfirmacao " + Util.getStringJsonFor(vo));
        AuthController controller = new AuthController();
        return controller.reenviarEmailConfirmacao(vo);
    }

    @POST
    @Path("obterWhatsDuvidaAjuda")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<UsuarioVo> obterWhatsDuvidaAjuda() {
        logger.info(getClass().getSimpleName() + " POST /obterWhatsDuvidaAjuda");
        AuthController controller = new AuthController();
        return controller.obterWhatsDuvidaAjuda();
    }

    @POST
    @Path("atualizarSenha")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info atualizarSenha(MedicoVo medicoVo) {
        logger.info(getClass().getSimpleName() + " POST /atualizarSenha " + Util.getStringJsonFor(medicoVo));
        AuthController controller = new AuthController();
        return controller.atualizarSenha(medicoVo);
    }

    @POST
    @Path("enviarEmailAtualizarSenha")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info enviarEmailAtualizarSenha(MedicoVo medicoVo) {
        logger.info(getClass().getSimpleName() + " POST /enviarEmailAtualizarSenha " + Util.getStringJsonFor(medicoVo));
        AuthController controller = new AuthController();
        return controller.enviarEmailAtualizarSenha(medicoVo);
    }

    @POST
    @Path("atualizarSenhaAdmin")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info atualizarSenha(UsuarioVo usuarioVo) {
        logger.info(getClass().getSimpleName() + " POST /atualizarSenhaAdmin " + Util.getStringJsonFor(usuarioVo));
        AuthController controller = new AuthController();
        return controller.atualizarSenha(usuarioVo);
    }

    @POST
    @Path("enviarEmailAtualizarSenhaAdmin")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Info enviarEmailAtualizarSenha(UsuarioVo usuarioVo) {
        logger.info(getClass().getSimpleName() + " POST /enviarEmailAtualizarSenhaAdmin " + Util.getStringJsonFor(usuarioVo));
        AuthController controller = new AuthController();
        return controller.enviarEmailAtualizarSenha(usuarioVo);
    }
}
