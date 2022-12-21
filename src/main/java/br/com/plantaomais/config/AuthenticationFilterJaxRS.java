package br.com.plantaomais.config;

import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.UsuarioVo;

import javax.ws.rs.ForbiddenException;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.security.Principal;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by Jerry
 * on 22/10/2018.
 */

class AuthenticationFilterJaxRS {
    private static final Logger logger = Logger.getLogger(AuthenticationFilterJaxRS.class.getName());

    public static void filter(ContainerRequestContext requestContext, boolean verificaToken) {
        try {
            // Recupera o token no header da requisição
            String authorizationHeader
                    = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

            if (authorizationHeader == null || !authorizationHeader.startsWith("Basic ")) {
//				logger.log(Level.SEVERE, "Rota requerida: " + requestContext.getUriInfo().getPath());
                throw new NotAuthorizedException("Sem permissão de acesso!" + "Rota requerida: " + requestContext.getUriInfo().getPath());
            }

            String token = authorizationHeader.substring("Basic".length()).trim();

            // Verifica se o token é um usuário serializado
            final UsuarioVo usuario = validarUsuario(token);

            // Valida se o token do usuário é o mesmo que está no banco de dados
            if (verificaToken && !validarTokenUsuario(usuario)) {
//				logger.log(Level.SEVERE, "Rota requerida: " + requestContext.getUriInfo().getPath());
                throw new NotAuthorizedException(Constants.ACESSO_NEGADO + " Rota requerida: " + requestContext.getUriInfo().getPath());
            }

            // injetar o context na classe que utiliza o rest para recuperar o usuario logado
            requestContext.setSecurityContext(new SecurityContext() {
                @Override
                public Principal getUserPrincipal() {
                    return usuario;
                }

                @Override
                public boolean isUserInRole(String s) {
                    return false;
                }

                @Override
                public boolean isSecure() {
                    return false;
                }

                @Override
                public String getAuthenticationScheme() {
                    return null;
                }
            });

        } catch (NotAuthorizedException e) {
            // Retorna para o disposito o erro 401
            String msg = "";
            if (e.getChallenges() != null && e.getChallenges().get(0) != null) {
                msg = e.getChallenges().get(0).toString();
            }
            logger.log(Level.INFO, msg, e);
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
        } catch (ForbiddenException e) {
            // Retorna para o disposito o erro 403
            logger.log(Level.SEVERE, e.toString(), e);
            requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).build());
        } catch (Exception e) {
            // Retorna para o disposito o erro 400
            logger.log(Level.SEVERE, e.toString(), e);
            requestContext.abortWith(Response.status(Response.Status.BAD_REQUEST).build());
        }
    }

    private static UsuarioVo validarUsuario(String token) throws Exception {
        return Util.convertTokenToUser(token);
    }

    private static boolean validarTokenUsuario(UsuarioVo vo) throws AuthenticationException {
        if (vo == null) {
            return false;
        }
        try {
//            AuthController controller = new AuthController(vo);
//            vo = controller.validarTokenUsuario(vo);
            return vo != null;
        } catch (Exception e) {
            throw new AuthenticationException(e.getMessage());
        }
    }


}
