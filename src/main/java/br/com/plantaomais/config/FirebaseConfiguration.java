package br.com.plantaomais.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
public class FirebaseConfiguration {

    private volatile static FirebaseApp INSTANCE;

    @SuppressWarnings("SpellCheckingInspection")
    @Bean
    public FirebaseApp getFirebaseApp() throws IOException {

        if (INSTANCE != null) {
            return INSTANCE;
        }

        var refreshToken = new ClassPathResource("plantao-mais-3f99f-firebase-adminsdk-kizkl-27807c9e85.json");

        var options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(refreshToken.getInputStream()))
            .setDatabaseUrl("https://plantao-mais-3f99f.firebaseio.com")
            .build();
        INSTANCE = FirebaseApp.initializeApp(options);
        return INSTANCE;
    }

}
