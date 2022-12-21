package br.com.plantaomais.config;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

/**
 * Classe responsável para filtrar as requisições nos métodos que estão com a
 * notação @Secured. Assim é possível recuperar o token enviado e verificar se o
 * usuário da requisição está logado
 *
 * @author jerry
 */
@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

    /**
     * Filtra as requisições que tem a anotação @Secured e verifica se o token
     * está de acordo com usuário
     *
     * @param requestContext Request
     */
    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        AuthenticationFilterJaxRS.filter(requestContext, true);
    }
}
