package br.com.plantaomais.config;

import br.com.nextage.persistence_2.util.HibernateUtil;
import br.com.plantaomais.api.*;
import br.com.plantaomais.api.aplicativo.AnexoApi;
import br.com.plantaomais.api.aplicativo.MedicoAppApi;
import br.com.plantaomais.api.aplicativo.MeuPerfilApi;
import br.com.plantaomais.api.aplicativo.MinhaAgendaApi;
import br.com.plantaomais.api.aplicativo.PlantaoAppApi;
import br.com.plantaomais.util.criptografia.JWT;
import org.glassfish.jersey.jackson.JacksonFeature;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("api")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new HashSet<Class<?>>();

        //Necessariamente precisa estar por primeiro do que a linha
        //addRestResourceClasses(resources);
        resources.add(ObjectMapperProvider.class);
        resources.add(JacksonFeature.class);
        resources.add(CORSResponseFilter.class);
        resources.add(AuthenticationFilter.class);
        resources.add(AuthenticationFilterApp.class);
        resources.add(JWT.class);

        addRestResourceClasses(resources);

        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method. It is automatically
     * populated with all resources defined in the project. If required, comment
     * out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(AuthApi.class);
        resources.add(UsuarioApi.class);
        resources.add(ContratanteApi.class);
        resources.add(TipoServicoApi.class);
        resources.add(EscalaApi.class);
        resources.add(EspecialidadeApi.class);
        resources.add(PlantaoApi.class);
        resources.add(SetorApi.class);
        resources.add(GestaoEscalaApi.class);
        resources.add(MedicoApi.class);
        resources.add(TipoConfiguracaoApi.class);
        resources.add(FechamentoApi.class);
        resources.add(IndicadoresApi.class);
        resources.add(MedicAttachmentApi.class);
        resources.add(CursoApi.class);
        resources.add(StateApi.class);
        resources.add(CityApi.class);
        resources.add(PreferencesMedicUtilsApi.class);
        resources.add(MedicoCursoApi.class);
        resources.add(NotificationApi.class);
        resources.add(AttachmentApi.class);
        resources.add(EventApi.class);
        resources.add(UserPermissionApi.class);
        resources.add(MobileVersionApi.class);

//        APP
        resources.add(PlantaoAppApi.class);
        resources.add(MinhaAgendaApi.class);
        resources.add(AnexoApi.class);
        resources.add(MedicoAppApi.class);
        resources.add(MeuPerfilApi.class);

        HibernateUtil.alterarConexaoUsuario(System.getProperty("hibernate.connection.url"), System.getProperty("hibernate.connection.username"), System.getProperty("hibernate.connection.password"));
    }

}
