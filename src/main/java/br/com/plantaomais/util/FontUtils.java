package br.com.plantaomais.util;

import com.openhtmltopdf.extend.FSSupplier;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;

import static com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder.FontStyle.NORMAL;

public abstract class FontUtils {

    private FontUtils() {}

    public static final String OPEN_SANS = "Open Sans";
    public static final String FONTS_URI = "templates/fonts";

    private static FSSupplier<InputStream> getFontSupplier(String uri) {
        return () -> {
            try {
                ClassLoader classloader = Thread.currentThread().getContextClassLoader();
                var resource = classloader.getResource(uri);
                File file = new File(resource.toURI());
                return new FileInputStream(file);
            } catch (IOException | URISyntaxException e) {
                e.printStackTrace();
            }
            return null;
        };
    }

    public static void setPdfFonts(PdfRendererBuilder pdf) {
        pdf.useFont(getFontSupplier(FONTS_URI + "/OpenSans-Light.ttf"), OPEN_SANS, 300, NORMAL, true);
        pdf.useFont(getFontSupplier(FONTS_URI + "/OpenSans-Regular.ttf"), OPEN_SANS, 400, NORMAL, true);
        pdf.useFont(getFontSupplier(FONTS_URI + "/OpenSans-SemiBold.ttf"), OPEN_SANS, 600, NORMAL, true);
        pdf.useFont(getFontSupplier(FONTS_URI + "/OpenSans-ExtraBold.ttf"), OPEN_SANS, 800, NORMAL, true);
    }

}