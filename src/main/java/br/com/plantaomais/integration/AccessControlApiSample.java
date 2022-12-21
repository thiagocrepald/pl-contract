package br.com.plantaomais.integration;

import br.com.plantaomais.config.TimeTrackingApiProxy;
import br.com.plantaomais.integration.dto.accesscontrol.AccessControlCreateDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Set;

@Service
public class AccessControlApiSample {

    private final Logger log = LoggerFactory.getLogger(AccessControlApiSample.class);

    private final AccessControlApi api = TimeTrackingApiProxy.getInstance().createAccessControlApi();

    public void createAccessControl(AccessControlCreateDTO payload) {
        var request = api.createAccessControl(payload);
        try {
            var response = request.execute();
            if (response.isSuccessful()) log.debug("Access control created with success!");
            log.info("Response: {}", response);
        } catch (IOException e) {
            log.debug("Error to create access control!");
        }
    }

    public void createAccessControls(Set<AccessControlCreateDTO> payload) {
        var request = api.createAccessControls(payload);
        try {
            var response = request.execute();
            if (response.isSuccessful()) log.debug("Access controls created with success!");
            log.info("Response: {}", response);
        } catch (IOException e) {
            log.debug("Error to create access controls!");
        }
    }

}
