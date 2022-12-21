package br.com.plantaomais.config;

import br.com.plantaomais.integration.AccessControlApi;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.logging.HttpLoggingInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

import static br.com.plantaomais.config.ApplicationProperties.getProperty;
import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;
import static com.fasterxml.jackson.databind.DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY;
import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;
import static com.fasterxml.jackson.databind.MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES;
import static com.fasterxml.jackson.databind.SerializationFeature.WRITE_DURATIONS_AS_TIMESTAMPS;
import static java.util.Optional.ofNullable;

public class TimeTrackingApiProxy {

    private static final Logger log = LoggerFactory.getLogger(TimeTrackingApiProxy.class);

    private static final ObjectMapper objectMapper;

    private static final JacksonConverterFactory jacksonConverterFactory;

    private static final TimeTrackingApiProxy SERVICE_INSTANCE;

    private OkHttpClient.Builder okHttpBuilder;

    private Retrofit.Builder adapterBuilder;

    static {
        objectMapper = new ObjectMapper();
        objectMapper
                .disable(WRITE_DURATIONS_AS_TIMESTAMPS)
                .registerModule(new JavaTimeModule())
                .setSerializationInclusion(NON_NULL)
                .configure(ACCEPT_CASE_INSENSITIVE_PROPERTIES, true)
                .configure(FAIL_ON_UNKNOWN_PROPERTIES, false)
                .configure(ACCEPT_SINGLE_VALUE_AS_ARRAY, true)
                .setDefaultPrettyPrinter(new DefaultPrettyPrinter());

        jacksonConverterFactory = JacksonConverterFactory.create(objectMapper);
        SERVICE_INSTANCE = new TimeTrackingApiProxy();
        SERVICE_INSTANCE.createDefaultAdapter();
    }

    private TimeTrackingApiProxy() {

    }

    public static TimeTrackingApiProxy getInstance() {
        return SERVICE_INSTANCE;
    }

    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
                .connectTimeout(15, TimeUnit.SECONDS)
                .readTimeout(15, TimeUnit.SECONDS)
                .build();
    }

    public AccessControlApi createAccessControlApi() {
        return createService(AccessControlApi.class);
    }

    private void createDefaultAdapter() {
        var baseUrl = ofNullable(System.getProperty("timetracking.api.url")).orElseGet(() -> getProperty("timetracking.api.url"));
        this.okHttpBuilder = new OkHttpClient.Builder();
        this.okHttpBuilder.addInterceptor(chain -> {
            Request request = chain.request()
                    .newBuilder()
                    .addHeader("Authorization", String.format("Bearer %s", ofNullable(System.getProperty("timetracking.api.token")).orElseGet(() -> getProperty("timetracking.api.token"))))
                    .build();
            return chain.proceed(request);
        });
        this.adapterBuilder = new Retrofit
                .Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(jacksonConverterFactory);
    }

    public <S> S createService(Class<S> serviceClass) {
        var httpLoggingInterceptor = new HttpLoggingInterceptor(log::info);
        httpLoggingInterceptor.level(HttpLoggingInterceptor.Level.valueOf(ofNullable(getProperty("timetracking.api.level")).orElse("BASIC")));
        return adapterBuilder
                .client(okHttpBuilder.addInterceptor(httpLoggingInterceptor)
                        .connectTimeout(Duration.ofSeconds(30))
                        .callTimeout(Duration.ofSeconds(30)).build())
                .build()
                .create(serviceClass);
    }

}
