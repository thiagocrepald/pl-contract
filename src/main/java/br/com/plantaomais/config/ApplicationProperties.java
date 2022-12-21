package br.com.plantaomais.config;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import static java.util.Optional.ofNullable;

public class ApplicationProperties implements ServletContextListener {

    private static final Logger logger = Logger.getLogger(ApplicationProperties.class.getName());

    private static ApplicationProperties instance = null;

    private static Properties properties = null;

    private static String fileConfig = null;

    private String firebaseKey = "\tAAAAUmtlfZg:APA91bFwU" +
            "-bAfemqGEVdKserHPBtJlDvsHQWfB76PMbtoqyrMqAAgCWg0V5JAroSH1_FTrOXqrWmvJsyti46i1XNzCEvaSsGXi7VFo1XoDfRUkcv7MEVCFNNvEiduHEL3Y-mfCXx0afA";

    private static void initApplicationProperties() {
        try {

            loadProperties();
        } catch (IOException e) {

            logger.log(Level.SEVERE, "Properties cannot be loaded from file {0}", fileConfig);
            System.exit(1);
        }
    }

    public static synchronized ApplicationProperties getInstance() {

        if (instance == null) {

            instance = new ApplicationProperties();
        }
        return instance;
    }

    private static String getEnvironmentFileConfig() {

        String defaultEnvironment = "development";


        logger.log(Level.INFO, "Environment: {0}", System.getProperty("environment"));
        return ofNullable(System.getProperty("environment"))
                .filter(it -> StringUtils.equalsAny(it, "development", "staging", "production"))
                .map(it -> it + ".properties")
                .orElseGet(() -> {
                    logger.log(Level.INFO, "Environment not found, using default: {0}", defaultEnvironment);
                    return "development.properties";
                });
    }

    public static String getProperty(String key) {
        logger.info(String.format("loading %s as %s", key, properties.getProperty(key)));
        return properties.getProperty(key);
    }

    private static void loadProperties() throws IOException {

        fileConfig = getEnvironmentFileConfig();

        URL resource = ApplicationProperties.class.getClassLoader().getResource(fileConfig);

        File file = new File(resource.getFile());

        FileInputStream fileStream = new FileInputStream(file);

        properties = new Properties();

        logger.log(Level.INFO, "Environment file: {0}", fileConfig);

        properties.load(fileStream);
    }

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        initApplicationProperties();
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }

    public static Boolean pushBlocked() {
        return ofNullable(getProperty("push.blocked"))
                .map(Boolean::valueOf)
                .orElse(true);
    }

    public static Boolean mailBlocked() {
        return ofNullable(getProperty("mail.blocked"))
                .map(Boolean::valueOf)
                .orElse(true);
    }

    public static Boolean jobsBlocked() {
        return ofNullable(getProperty("jobs.blocked"))
                .map(Boolean::valueOf)
                .orElse(true);
    }

    public String getFirebaseKey() {
        return firebaseKey;
    }

    public void setFirebaseKey(String firebaseKey) {
        this.firebaseKey = firebaseKey;
    }
}
