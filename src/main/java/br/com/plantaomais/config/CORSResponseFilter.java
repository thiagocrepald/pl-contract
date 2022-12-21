package br.com.plantaomais.config;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.MultivaluedMap;
import java.io.IOException;

/**
 * Created by nextage
 * on 30/06/2016.
 */
public class CORSResponseFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        MultivaluedMap<String, Object> headers = responseContext.getHeaders();

        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, X-Codingpedia, Authorization");
        headers.add("strict-transport-security", "max-age=31536000");
    }
}
