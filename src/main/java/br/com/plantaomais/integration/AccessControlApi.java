package br.com.plantaomais.integration;

import br.com.plantaomais.integration.dto.accesscontrol.AccessControlCreateDTO;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

import javax.validation.Valid;
import java.util.Set;

public interface AccessControlApi {

    @GET("access-controls/{id}")
    Call<Object> findById(@Path("id") Long id);

    @POST("access-controls/multiples")
    Call<Void> createAccessControls(@Valid @Body Set<AccessControlCreateDTO> payload);

    @POST("access-controls")
    Call<AccessControlCreateDTO> createAccessControl(@Valid @Body AccessControlCreateDTO payload);

}
