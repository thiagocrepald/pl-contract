package br.com.plantaomais.config;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.map.annotate.JsonSerialize.Inclusion;

import javax.ws.rs.ext.ContextResolver;
import java.text.SimpleDateFormat;

/**
 * Created by nextage
 * on 30/06/2016.
 */
public class ObjectMapperProvider implements ContextResolver<ObjectMapper> {
    final ObjectMapper defaultObjectMapper;

    public ObjectMapperProvider() {
        defaultObjectMapper = createDefaultMapper();
    }

    @Override
    public ObjectMapper getContext(Class<?> type) {
        return defaultObjectMapper;
    }

    private static ObjectMapper createDefaultMapper() {
        final ObjectMapper result = new ObjectMapper();
        result.setSerializationInclusion(Inclusion.NON_NULL);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");//("EEE, d MMM yyyy HH:mm:ss 'GMT'",Locale.ENGLISH);
        result.getSerializationConfig().setDateFormat(sdf);

        result.disable(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES);
        result.disable(SerializationConfig.Feature.WRITE_CHAR_ARRAYS_AS_JSON_ARRAYS);
        result.enable(DeserializationConfig.Feature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        return result;
    }
}
