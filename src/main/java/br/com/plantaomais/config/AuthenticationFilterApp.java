package br.com.plantaomais.config;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.MedicoVo;

import javax.annotation.Priority;
import javax.ws.rs.ForbiddenException;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@SecuredApp
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilterApp implements ContainerRequestFilter {
    private static final Logger logger = Logger.getLogger(AuthenticationFilter.class.getName());

    @Override
    public void filter(ContainerRequestContext containerRequestContext) throws IOException {
        try {

            String authorization = containerRequestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

            if (authorization == null || authorization.isEmpty()) {
                throw new NotAuthorizedException(Constants.ACESSO_NEGADO);
            }

//            final String json = authorization.get(0).replaceFirst("Bearer" + " ", "");

            String token = authorization.substring("Bearer ".length()).trim();

            final MedicoVo medicoVo = Util.convertTokenToMedico(token);

            // Valida se o token do usuário é o mesmo que está no banco de dados
            if (validarTokenMedico(medicoVo)) {
                logger.log(Level.SEVERE, "Rota requerida: " + containerRequestContext.getUriInfo().getPath());
                throw new NotAuthorizedException(Constants.ACESSO_NEGADO);
            }


            // injetar o context na classe que utiliza o rest para recuperar o nxCliente logado
            String scheme = containerRequestContext.getUriInfo().getRequestUri().getScheme();
            containerRequestContext.setSecurityContext(new PlantaoMaisAppSecurityContext(medicoVo, scheme));
//            }

        } catch (NotAuthorizedException e) {
            // Retorna para o disposito o erro 401
            logger.log(Level.SEVERE, e.toString(), e);
            containerRequestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
        } catch (ForbiddenException e) {
            // Retorna para o disposito o erro 403
            logger.log(Level.SEVERE, e.toString(), e);
            containerRequestContext.abortWith(Response.status(Response.Status.FORBIDDEN).build());
        } catch (Exception e) {
            // Retorna para o disposito o erro 400
            logger.log(Level.SEVERE, e.toString(), e);
            containerRequestContext.abortWith(Response.status(Response.Status.BAD_REQUEST).build());
        }
    }


    private static boolean validarTokenMedico(final MedicoVo vo) throws AuthenticationException {
        try {

            return vo == null || vo.getId() == null || ehMedicoExcluido(vo.getId()) || dataExpiracaoTokenExpirada(vo.getId());
        } catch (Exception e) {
            throw new AuthenticationException(e.getMessage());
        }
    }

    private static boolean dataExpiracaoTokenExpirada(final int id) throws AuthenticationException{
        try{
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.DATA_EXPIRACAO_TOKEN));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, id, Filtro.EQUAL));
            GenericDao<Medico> genericDao = new GenericDao<>();

            Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            Date now = new Date();
           return medico == null || medico.getDataExpiracaoToken() == null || medico.getDataExpiracaoToken().before(now);

        }catch (Exception e){
            throw new AuthenticationException(e.getMessage());
        }
    }

    private static boolean ehMedicoExcluido(final int id) throws AuthenticationException {
        try {
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.EXCLUIDO));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, id, Filtro.EQUAL));
            GenericDao<Medico> genericDao = new GenericDao<>();

            Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            return medico == null  || medico.getExcluido();

        } catch (Exception e) {
            throw new AuthenticationException(e.getMessage());
        }
    }
}
