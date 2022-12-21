package br.com.plantaomais.util;

import br.com.plantaomais.config.ObjectMapperProvider;
import org.codehaus.jackson.map.ObjectMapper;


public class JsonConvert {

    public static <T> T convertObjectToObject(Object obj, Class classe) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            //Object to JSON in String
            String jsonString = mapper.writeValueAsString(obj);

            ObjectMapper mapperConvert = new ObjectMapperProvider().getContext(classe);

            return (T) mapperConvert.readValue(jsonString, classe);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public static <T> T convertJsonToObject(String jsonString, Class classe) {
        try {
            ObjectMapper mapperConvert = new ObjectMapperProvider().getContext(classe);

            return (T) mapperConvert.readValue(jsonString, classe);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String convertObjectToJson(Object obj) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            //Object to JSON in String
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
