package br.com.plantaomais.config;

import br.com.plantaomais.vo.MedicoVo;

import javax.ws.rs.core.SecurityContext;
import java.security.Principal;

public class PlantaoMaisAppSecurityContext implements SecurityContext {
    private MedicoVo medicoVo;
    private String scheme;

    public PlantaoMaisAppSecurityContext(MedicoVo medicoVo, String scheme) {
        this.medicoVo = medicoVo;
        this.scheme = scheme;
    }

    @Override
    public Principal getUserPrincipal() {
        return this.medicoVo;
    }

    @Override
    public boolean isUserInRole(String s) {
        /*if (user.getRole() != null) {
			return user.getRole().contains(s);
		}*/
        return true;
    }

    @Override
    public boolean isSecure() {
        return "https".equals(this.scheme);
    }

    @Override
    public String getAuthenticationScheme() {
        return SecurityContext.BASIC_AUTH;
    }
}
