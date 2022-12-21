package br.com.plantaomais.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.sql.Time;

/**
 * Created by gmribas on 03/06/20.
 */
public class SqlTimeDeserializer extends JsonDeserializer<Time> {

    @Override
    public Time deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        return Time.valueOf(jp.getValueAsString() + ":00");
    }
}