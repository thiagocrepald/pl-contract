package br.com.plantaomais.util;

import com.itextpdf.text.Document;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfImportedPage;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfWriter;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import static br.com.plantaomais.util.FontUtils.setPdfFonts;

public abstract class PdfUtils {

    private PdfUtils() {}

    public static void generatePdf(PdfRendererBuilder pdf, String html, ByteArrayOutputStream outputStream) throws IOException {
        setPdfFonts(pdf);
        pdf.withHtmlContent(html, "");
        pdf.toStream(outputStream);
        pdf.run();
    }

    public static void generatePdf(String html, ByteArrayOutputStream byteArrayOutputStream) throws IOException {
        PdfRendererBuilder pdf = new PdfRendererBuilder();
        generatePdf(pdf, html, byteArrayOutputStream);
    }

    private static void setPdfInASinglePage(ByteArrayOutputStream newByteArray, ByteArrayOutputStream byteArrayOutputStream) {
        try {
            PdfReader reader = new PdfReader(newByteArray.toByteArray());
            Rectangle pageSize = reader.getPageSize(1);
            Rectangle newSize = new Rectangle(pageSize.getWidth(), pageSize.getHeight() *
                    (reader.getNumberOfPages() - 1));
            Rectangle unitSize = new Rectangle(pageSize.getWidth(), pageSize.getHeight());
            int n = (int)Math.pow(2, reader.getNumberOfPages());
            int r = (int)Math.pow(2, reader.getNumberOfPages() / 2);
            int c = n / r;

            Document document2 = new Document(newSize);
            PdfWriter writer2 = PdfWriter.getInstance(document2, byteArrayOutputStream);
            document2.open();
            document2.newPage();
            PdfContentByte cb = writer2.getDirectContent();
            PdfImportedPage page;

            float offsetY, factor;
            for (int i = 1; i <= reader.getNumberOfPages(); i++) {
                page = writer2.getImportedPage(reader, i);
                Rectangle currentSize = reader.getPageSize(i);
                factor = Math.min(
                        unitSize.getWidth() / currentSize.getWidth(),
                        unitSize.getHeight() / currentSize.getHeight());
                offsetY = newSize.getHeight() - (unitSize.getHeight() * (((i % n) / c) + 1))
                        + (unitSize.getHeight() - (currentSize.getHeight() * factor)) / 2f;

                offsetY -= 518 * (i - 1);

                cb.addTemplate(page, factor, 0, 0, factor, 0, offsetY);
            }
            document2.close();
            reader.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}