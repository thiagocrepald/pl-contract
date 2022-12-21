package br.com.plantaomais.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

public abstract class ResourceUtils {

    private ResourceUtils() {}

    public static String getFileFromResource(String uri) throws IOException {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        InputStream is = classloader.getResourceAsStream(uri);
        var str = "";
        StringBuilder buf = new StringBuilder();
        if (is != null) {
            try {
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                while ((str = reader.readLine()) != null) {
                    buf.append(str).append("\n");
                }

            } finally {
                try {
                    is.close();
                } catch (Throwable ignore) {
                }
            }
        }
        return buf.toString();
    }

}