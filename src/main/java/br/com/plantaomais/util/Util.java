package br.com.plantaomais.util;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.config.ApplicationProperties;
import br.com.plantaomais.controller.UserConfigurationController;
import br.com.plantaomais.entitybean.CandidatoPlantao;
import br.com.plantaomais.entitybean.Configuracao;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.Installation;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.PaymentData;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.TipoConfiguracao;
import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.entitybean.enums.PaymentType;
import br.com.plantaomais.util.criptografia.JWT;
import br.com.plantaomais.util.email.EmailSendGrid;
import br.com.plantaomais.util.email.SendGridUtil;
import br.com.plantaomais.vo.EscalaReportVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.UsuarioVo;
import br.com.plantaomais.vo.aplicativo.PushNotificationVo;
import br.com.plantaomais.vo.layoutEscala.LayoutEscalaVo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import io.jsonwebtoken.Claims;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.glassfish.jersey.client.ClientProperties;
import org.glassfish.jersey.client.filter.EncodingFilter;
import org.glassfish.jersey.message.DeflateEncoder;
import org.glassfish.jersey.message.GZipEncoder;
import org.hibernate.property.Getter;
import org.hibernate.property.PropertyAccessorFactory;
import org.hibernate.property.Setter;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.w3c.tidy.Tidy;

import javax.imageio.ImageIO;
import javax.validation.constraints.NotNull;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;
import static br.com.plantaomais.util.HtmlUtils.generateHtml;

//POI libraries to read Excel File
//itext libraries to write PDF file

/**
 * Created by nextage
 * on 09/08/2017.
 */
public class Util {

    private static final Logger logger = Logger.getLogger(Util.class.getName());

    private static final SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    private static final SimpleDateFormat localDateSdf = new SimpleDateFormat("dd/MM/yyyy");
    private static final TimeZone defaultTimeZone = TimeZone.getTimeZone("America/Sao_Paulo");
    public static Gson gsonWithDate() {
        final GsonBuilder builder = new GsonBuilder();

        builder.registerTypeAdapter(Date.class, (JsonDeserializer<Date>) (json, typeOfT, context) -> {
            try {
                Date date = null;
                if (json.getAsString().matches("\\d+")) {
                    long timeStamp = Long.parseLong(json.getAsString());
                    date = new Date(timeStamp);
                } else {
                    date = new SimpleDateFormat("yyyy-MM-dd").parse(json.getAsString());
                }
                return date;
            } catch (final Exception e) {
                return null;
            }
        });

        return builder.create();
    }

    public static <T> T convertJsonStringToObject(String json, Class<T> classe) {
        T retorno = null;
        try {
            // Removido o mapper pois demora demais para converter
            // Adicionado o Gson do google
            //ObjectMapper objectMapper = new ObjectMapper();
            //objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//            Gson convert = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();
            Gson convert = gsonWithDate();
            //Gson convert = new GsonBuilder().setDateFormat("yyyy-MMM-dd HH:mm:ss.zzz").create();
            //Gson convert = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").create();
            retorno = convert.fromJson(json, classe);
            // Transforma no objeto
            //cliente = objectMapper.readValue(json, classe);
        } catch (Exception e) {
            Logger.getGlobal().log(Level.SEVERE, e.getMessage(), e);
        }
        return retorno;
    }

    public static UsuarioVo convertTokenToUser(String token) {
        UsuarioVo cliente = null;
        try {
            Claims claim = JWT.parseJWT(token);
            cliente = Util.convertJsonStringToObject(claim.getIssuer(), UsuarioVo.class);
            if (cliente != null) {
                cliente.setToken(token);
            }
        } catch (Exception e) {
            Logger.getGlobal().log(Level.SEVERE, e.getMessage(), e);
        }
        return cliente;
    }

    public static MedicoVo convertTokenToMedico(String token) {
        MedicoVo medicoVo = null;
        try {
            Claims claim = JWT.parseJWT(token);
            medicoVo = Util.convertJsonStringToObject(claim.getIssuer(), MedicoVo.class);
            if (medicoVo != null) {
                medicoVo.setToken(token);
            }
        } catch (Exception e) {
            Logger.getGlobal().log(Level.SEVERE, e.getMessage(), e);
        }
        return medicoVo;
    }

    public static String convertObjectToToken(Object obj) throws IOException {
        Gson convert = gsonWithDate();
        String token = convert.toJson(obj);
        return token;
    }

    public static String generateTokenUser(UsuarioVo vo) throws IOException {
        int minutosAtualizarToken = 720; // 12 horas
        //EXPIRAÇÃO DO TOKEN
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(new Date());
        calendar.add(GregorianCalendar.MINUTE, minutosAtualizarToken);
        vo.setDataExpiracaoToken(calendar.getTime());

        vo.setMinutosAtualizarToken(minutosAtualizarToken);

        String issuer = Util.convertObjectToToken(vo);
        String token = JWT.createJWT(String.valueOf(vo.getId()), issuer, vo.getLogin(), 0, vo.getId(), null);
        return token;
    }

    public static String generateTokenUserApp(MedicoVo vo) throws IOException {
        int minutosAtualizarToken = 120;
        //EXPIRAÇÃO DO TOKEN
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(new Date());
        calendar.add(GregorianCalendar.MINUTE, minutosAtualizarToken);
        vo.setDataExpiracaoToken(calendar.getTime());

        vo.setMinutosAtualizarToken(minutosAtualizarToken);

        String issuer = Util.convertObjectToToken(vo);
        String token = JWT.createJWT(String.valueOf(vo.getId()), issuer, vo.getEmail(), 0, null, vo.getId());
        return token;
    }

    public static <T> Map<String, Object> convertObjectToMap(T obj) {
        ObjectMapper oMapper = new ObjectMapper();

        //Transforma o camel-case em snake-case   ----   dataNascimento -> data_nascimento
        oMapper.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);

        // object -> Map
        Map<String, Object> mappedObject = oMapper.convertValue(obj, Map.class);
        return mappedObject;
    }

    /**
     * Adiciona a pontuação no cpf passado por parametro, tambem corrige caso seja
     * passado um cpf com a pontuação incompleta
     * <p>
     * Daniel H. Parisotto
     *
     * @param cpf
     * @return
     */
    public static String formatarCpf(String cpf) {
        return cpf.replaceAll("\\D+", "").replaceAll("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
    }

    public static String dateToString(Date data, TimeZone timeZone) {
        return dateToString(data, sdf, timeZone);
    }


    public static String localDateToString(Date data) {
        return dateToString(data, localDateSdf, defaultTimeZone);
    }

    public static String dateToString(Date data, SimpleDateFormat simpleDateFormat, TimeZone timeZone) {
        try {

            if (data == null) {
                return null;
            }
            if (simpleDateFormat == null) {
                simpleDateFormat = sdf;
            }
            if (timeZone != null) {
                simpleDateFormat.setTimeZone(timeZone);
            }
            return simpleDateFormat.format(data);
        } catch (Exception e) {
            Logger.getGlobal().log(Level.SEVERE, e.getMessage(), e);
        }
        return null;
    }

    /**
     * @param strDate
     * @return
     */
    public static Date stringToDate(String strDate, TimeZone timeZone) {
        return stringToDate(strDate, sdf, timeZone);
    }


    public static Date stringToDate(String strDate, SimpleDateFormat simpleDateFormat, TimeZone timeZone) {
        try {
            if (isNullOrEmpty(strDate)) {
                return null;
            } else {
                strDate = formataStringData(strDate);
            }
            if (timeZone != null) {
                sdf.setTimeZone(timeZone);
            }
            Date data = sdf.parse(strDate);
            return data;
        } catch (Exception e) {
            Logger.getGlobal().log(Level.SEVERE, e.getMessage(), e);
        }
        return null;
    }

    /**
     * Metodo responsavel para validar se a stData possui este formato 2016-11-18T00:00:00.000Z
     *
     * @param unformatStDate String
     * @return String
     * @throws Exception
     */
    public static String formataStringData(String unformatStDate) throws Exception {
        String formatStDate;
        if (unformatStDate != null && !unformatStDate.trim().isEmpty() && unformatStDate.contains("T")) {
            String[] dataHora = unformatStDate.split("T");
            String[] data = dataHora[0].split("-");
            String[] hora = dataHora[1].split(":");
            formatStDate = data[2] + "/" + data[1] + "/" + data[0] + " " + hora[0] + ":" + hora[1] + ":" + hora[2].split("\\.")[0];
        } else {
            formatStDate = unformatStDate;
        }
        return formatStDate;
    }

    /**
     * Metodo que cria o Setter da propriedade Passada por parametro do Objeto
     *
     * @param objeto
     * @param propriedade
     * @return Getter
     * @throws Exception
     */
    public static Setter getSetter(Object objeto, String propriedade) throws Exception {
        Class classe = objeto.getClass().equals(Class.class) ? (Class) objeto : objeto.getClass();
        Class superClasse = classe.getSuperclass().equals(Object.class) ? null : classe.getSuperclass();
        Class classeParametro = null;
        try {
            if (superClasse != null && superClasse.getDeclaredField(propriedade) != null) {
                classeParametro = superClasse;
            } else {
                if (classe.getDeclaredField(propriedade) != null) {
                    classeParametro = classe;
                }
            }
        } catch (Exception e) {
            if (classe.getDeclaredField(propriedade) != null) {
                classeParametro = classe;
            }
        }
        Setter setter = PropertyAccessorFactory.getPropertyAccessor("field").getSetter(classeParametro, propriedade);
        return setter;
    }

    /**
     * Metodo que cria o Getter da propriedade Passada por parametro do Objeto
     *
     * @param objeto
     * @param propriedade
     * @return Getter
     * @throws Exception
     */
    public static Getter getGetter(Object objeto, String propriedade) throws Exception {
        Class classe = objeto.getClass().equals(Class.class) ? (Class) objeto : objeto.getClass();
        Class superClasse = classe.getSuperclass().equals(Object.class) ? null : classe.getSuperclass();
        Class classeParametro = null;
        try {
            if (superClasse != null && superClasse.getDeclaredField(propriedade) != null) {
                classeParametro = superClasse;
            } else {
                if (classe.getDeclaredField(propriedade) != null) {
                    classeParametro = classe;
                }
            }
        } catch (Exception e) {
            if (classe.getDeclaredField(propriedade) != null) {
                classeParametro = classe;
            }
        }
        Getter getter = (PropertyAccessorFactory.getPropertyAccessor("field").getGetter(classeParametro, propriedade));
        return getter;
    }

    public static boolean isNullOrEmpty(java.util.List list) {
        return list == null || list.isEmpty();
    }

    public static boolean isNullOrFalse(Boolean var) {
        return var == null || !var;
    }

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    public static boolean isNullOrEmpty(Integer str) {
        return str == null || str <= 0;
    }

    public static boolean isNullOrEmpty(byte[] obj) {
        return obj == null || obj.length == 0;
    }

    public static String imageByteToBase64String(byte[] obj, String nome) {
        String imgFromBase64 = Util.byteToBase64String(obj);

        String tipoFoto = "*";
        if (!isNullOrEmpty(nome)) {
            tipoFoto = nome.substring(nome.lastIndexOf('.') + 1);
        }

        imgFromBase64 = imgFromBase64.substring(getIndexBase64(imgFromBase64));

        imgFromBase64 = "data:image/" + tipoFoto + ";base64," + imgFromBase64;
        return imgFromBase64;
    }

    public static String pdfByteToBase64String(byte[] obj) {
        String pdfFromBase64 = Util.byteToBase64String(obj);

        pdfFromBase64 = pdfFromBase64.substring(getIndexBase64(pdfFromBase64));

        pdfFromBase64 = "data:application/pdf;base64," + pdfFromBase64;
        return pdfFromBase64;
    }

    public static String applicationToBase64String(byte[] obj, String tipo) {
        String base64 = Util.byteToBase64String(obj);

        base64 = base64.substring(getIndexBase64(base64));

        base64 = "data:application/" + tipo + ";base64," + base64;
        return base64;
    }

    public static String byteToBase64String(byte[] obj) {
        return java.util.Base64.getMimeEncoder().encodeToString(obj).replaceAll("\r\n", "").replaceAll("\n", "");
    }

    public static byte[] base64StringToByte(String obj) {

        obj = obj.substring(getIndexBase64(obj));
        return java.util.Base64.getMimeDecoder().decode(obj.trim().getBytes(StandardCharsets.UTF_8));
    }

    private static int getIndexBase64(String obj) {
        int index = 0;
        if (obj.contains("base64,")) {
            index = (obj.indexOf("base64,") + 7);
        } else if (obj.contains("base64")) {
            index = (obj.indexOf("base64") + 6);
        }
        return index;
    }

    public static byte[] redimensionarImagem(byte[] fileData, int width, int height) {
        try {
            ByteArrayInputStream in = new ByteArrayInputStream(fileData);

            //Faz a leitura do bytefile[]
            BufferedImage img = ImageIO.read(in);

            //Caso a altura ou a largura seja zero calcula a proporção correta para fazer o redimensionamento
            if (height == 0) {
                height = (width * img.getHeight()) / img.getWidth();
            }
            if (width == 0) {
                width = (height * img.getWidth()) / img.getHeight();
            }

            //Redimensiona a imagem conforme os tamanhos passados por parametro
            Image scaledImage = img.getScaledInstance(width, height, Image.SCALE_SMOOTH);

            //Recria o BufferedImage apartir do tamamnho especificado
            BufferedImage imageBuff = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

            //"Desenha" a imagem no buffer
            imageBuff.getGraphics().drawImage(scaledImage, 0, 0, new Color(0, 0, 0), null);

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();

            ImageIO.write(imageBuff, "jpg", buffer);

            return buffer.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileData;
    }

    public static int tryParseInt(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * @param dataIni
     * @return Converte a hora da data recebida por parametro para 00:00.00 para evitar
     * que nos filtros por between a data inicial tenha sua hora zerada, podendo
     * compreender o periodo por inteiro.
     */
    public static Date convertDateHrInicial(Date dataIni, TimeZone timeZone) {
        if (dataIni != null) {
            GregorianCalendar calendar = new GregorianCalendar();
            if (timeZone != null) {
                calendar.setTimeZone(timeZone);
            }

            calendar.setTime(dataIni);
            calendar.set(GregorianCalendar.HOUR_OF_DAY, 0);
            calendar.set(GregorianCalendar.MINUTE, 0);
            calendar.set(GregorianCalendar.SECOND, 0);
            calendar.set(GregorianCalendar.MILLISECOND, 0);
            return calendar.getTime();
        }
        return null;
    }

    /**
     * Converte a hora da data recebida por parametro para 23:59.59 para evitar
     * que nos filtros por between a data final tenha sua hora setada para
     * ultima hora possível, podendo compreender o periodo por inteiro.
     * <p>
     * <PRE>
     * Ex: Permite filtrar por uma data espefícica ou por um período de data,
     * independente do horário na qual a requisição de um serviço foi
     * solicitada. Assim, será possível filtrar pela data corretamente.
     * </PRE>
     *
     * @param dataFim
     * @return
     */
    public static Date convertDateHrFinal(Date dataFim, TimeZone timeZone) {
        if (dataFim != null) {
            GregorianCalendar calendar = new GregorianCalendar();
            if (timeZone != null) {
                calendar.setTimeZone(timeZone);
            }

            calendar.setTime(dataFim);
            calendar.set(GregorianCalendar.HOUR_OF_DAY, 23);
            calendar.set(GregorianCalendar.MINUTE, 59);
            calendar.set(GregorianCalendar.SECOND, 59);
            return calendar.getTime();
        }
        return null;
    }

    public static void enviarPushNotification(@NotNull final List<PushNotificationVo> listaPushNotificationVo) throws Exception {
        if (ApplicationProperties.pushBlocked()) {
            logger.log(Level.INFO, "push are blocked");
            return;
        }
        Client client = ClientBuilder.newBuilder()
                .register(EncodingFilter.class)
                .register(GZipEncoder.class)
                .register(DeflateEncoder.class)
                .property(ClientProperties.USE_ENCODING, "gzip")
                .build();
        Gson gson = new Gson();

        String json = gson.toJson(listaPushNotificationVo);

        WebTarget target = client.
                target("https://exp.host/--/api/v2/push/send");

        String response = target.request()
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .header(HttpHeaders.ACCEPT_ENCODING, "gzip, deflate")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CONTENT_ENCODING, "gzip")
                .post(Entity.entity(json, MediaType.APPLICATION_JSON)
                        , String.class);

        System.out.println("Expo Push Notification: " + response);
    }

    @Deprecated
    // use PushNotificationController
    public static void enviarPushNotification(@NotNull final PushNotificationVo pushNotificationVo) throws Exception {
        if (ApplicationProperties.pushBlocked()) {
            logger.log(Level.INFO, "push are blocked {0}", pushNotificationVo.getBody());
            return;
        }
        Client client = ClientBuilder.newClient();
        Gson gson = new Gson();

        String json = gson.toJson(pushNotificationVo);

        WebTarget target = client.
                target("https://exp.host/--/api/v2/push/send");

        String response = target.request()
                .header("accept", MediaType.APPLICATION_JSON)
                .header("accept-encoding", "gzip, deflate")
                .header("content-type", MediaType.APPLICATION_JSON)
                .post(Entity.entity(json, MediaType.APPLICATION_JSON)
                        , String.class);

        System.out.println("Expo Push Notification: " + response);
    }


    public static Date converterDataTimeZone(Date data) {
        if (data == null) {
            return null;
        }
        try {

            DateTime dt = new DateTime(data);
//            DateTimeZone dtZone = DateTimeZone.forID("America/Sao_Paulo");
            DateTimeZone dtZone = DateTimeZone.forOffsetHours(-3);
            DateTime dBrazil = dt.withZone(dtZone);

            data = dBrazil.toLocalDateTime().toDate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return data;
    }

    public static String obterTokenPushNotificationMedico(int id) throws Exception {
        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(Medico.ID));
        propriedades.add(new Propriedade(Medico.TOKEN_PUSH_NOTIFICATION));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, id, Filtro.EQUAL));

        GenericDao<Medico> genericDao = new GenericDao<>();
        Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

        return medico.getTokenPushNotification();
    }

    public static Optional<Installation> obtePushNotificationMedico(int id) throws Exception {
        var installations = (List<Installation>) getSession()
                .createQuery("select i from Installation i " +
                        "left join i.medico m " +
                        "where m.id = :medicoId order by i.id desc"
                ).setInteger("medicoId", id).list();

        return Optional.ofNullable(installations.size() > 0 ? installations.get(0) : null);
    }

    public static byte[] convertWorkbookToPDF(XSSFWorkbook workbook, int numberColumns) throws Exception {
        var sheet = workbook.getSheetAt(0);
        var rowIterator = sheet.iterator();

        var table = new PdfPTable(numberColumns);
        table.setHeaderRows(1);
        var bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        var fontH1 = new Font(bf, 6, Font.NORMAL);
        var fontH1Bold = new Font(bf, 6, Font.BOLD);

        boolean isHeader = true;
        while(rowIterator.hasNext()) {
            var row = rowIterator.next();
            var cellIterator = row.cellIterator();

            while(cellIterator.hasNext()) {
                Cell cell = cellIterator.next();

                var value = cell != null ? cell.getStringCellValue() : "";
                PdfPCell tableCell = new PdfPCell(new Phrase(value, fontH1));
                if (isHeader) {
                    tableCell.setFixedHeight(16f);
                }

                table.addCell(tableCell);
            }

            isHeader = false;
        }

        var dsf = new ByteArrayOutputStream();
        var document = new Document();

        var writer = PdfWriter.getInstance(document, dsf);

        document.open();
        document.add(table);
        document.close();

        return dsf.toByteArray();
    }

    public static String convertHTMLToXHTML(String html) {
        String UTF_8 = "UTF-8";
        Tidy tidy = new Tidy();
        tidy.setInputEncoding(UTF_8);
        tidy.setOutputEncoding(UTF_8);
        tidy.setXHTML(true);
        ByteArrayInputStream inputStream = new ByteArrayInputStream(html.getBytes(StandardCharsets.UTF_8));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        tidy.parseDOM(inputStream, outputStream);
        try {
            return outputStream.toString(UTF_8);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return html;
        }
    }

    public static byte[] convertResultToPDF(List<LayoutEscalaVo> layoutEscala, DateTime date, String scheduleName) throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            PdfUtils.generatePdf(convertHTMLToXHTML(generateHtml(layoutEscala, date, scheduleName)), outputStream);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return outputStream.toByteArray();
    }

    public static byte[] converterXLSparaPDF(XSSFWorkbook my_xls_workbook) throws Exception {
        //First we read the Excel file in binary format into FileInputStream
        //FileInputStream input_document = new FileInputStream(new File("C:\\excel_to_pdf.xls"));
        // Read workbook into HSSFWorkbook

        // Read worksheet into HSSFSheet
        XSSFSheet my_worksheet = my_xls_workbook.getSheetAt(0);
        // To iterate over the rows
        Iterator<Row> rowIterator = my_worksheet.iterator();
        //We will create output PDF document objects at this point
        Document iText_xls_2_pdf = new Document();

        ByteArrayOutputStream dsf = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(iText_xls_2_pdf, dsf);


        iText_xls_2_pdf.open();
        //we have two columns in the Excel sheet, so we create a PDF table with two columns
        //Note: There are ways to make this dynamic in nature, if you want to.
        PdfPTable my_table = new PdfPTable(8);
        //We will use the object below to dynamically add new data to the table
        PdfPCell table_cell;
        //Loop through rows.

        BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA,
                BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);

        Font fontH1 = new Font(bf, 6, Font.NORMAL);

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Iterator<Cell> cellIterator = row.cellIterator();

            while (cellIterator.hasNext()) {
                Cell cell = cellIterator.next();

                if (cell != null) {

                    if (cell.getStringCellValue().contains("SEMANA")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(8);
                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue().equals("manhã")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(8);

                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue().equals("tarde")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(8);

                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue().equals("noite")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(8);

                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue().equals("cinderela")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(8);

                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue() != null) {
                        for (int i = row.getFirstCellNum(); i < row.getLastCellNum(); i++) {
                            String valor = "";
                            if (row.getCell(i) != null && row.getCell(i).getStringCellValue() != null) {
                                valor = row.getCell(i).getStringCellValue();
                            }
                            table_cell = new PdfPCell(new Phrase(valor, fontH1));
                            my_table.addCell(table_cell);

                        }
                        break;
                    }
                }

            }

        }


        //Finally add the table to PDF document
        iText_xls_2_pdf.add(my_table);
        iText_xls_2_pdf.close();
        //we created our pdf file..
        //my_xls_workbook.close(); //close xls

        return dsf.toByteArray();
    }


    public static byte[] converterXLSparaPDFDia(XSSFWorkbook my_xls_workbook) throws Exception {
        //First we read the Excel file in binary format into FileInputStream
        //FileInputStream input_document = new FileInputStream(new File("C:\\excel_to_pdf.xls"));

        // Read worksheet into HSSFSheet
        XSSFSheet my_worksheet = my_xls_workbook.getSheetAt(0);
        // To iterate over the rows
        Iterator<Row> rowIterator = my_worksheet.iterator();
        //We will create output PDF document objects at this point
        Document iText_xls_2_pdf = new Document();

        ByteArrayOutputStream dsf = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(iText_xls_2_pdf, dsf);
        iText_xls_2_pdf.open();
        //we have two columns in the Excel sheet, so we create a PDF table with two columns
        //Note: There are ways to make this dynamic in nature, if you want to.
        PdfPTable my_table = new PdfPTable(2);
        //We will use the object below to dynamically add new data to the table
        PdfPCell table_cell;
        //Loop through rows.

        BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA,
                BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);

        Font fontH1 = new Font(bf, 6, Font.NORMAL);

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Iterator<Cell> cellIterator = row.cellIterator();

            while (cellIterator.hasNext()) {
                Cell cell = cellIterator.next();

                if (cell != null) {

                    if (cell.getStringCellValue().contains("Segunda-feira") || cell.getStringCellValue().contains("Terça-feira") || cell.getStringCellValue().contains("Quarta-feira") || cell.getStringCellValue().contains("Quinta-feira") || cell.getStringCellValue().contains("Sexta-feira") || cell.getStringCellValue().contains("Sábado") || cell.getStringCellValue().contains("Domingo")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(2);
                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue().equals("manhã")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(2);

                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue().equals("tarde")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(2);

                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue().equals("noite")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(2);

                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue().equals("cinderela")) {
                        table_cell = new PdfPCell(new Phrase(cell.getStringCellValue(), fontH1));
                        table_cell.setColspan(2);

                        my_table.addCell(table_cell);
                        break;
                    } else if (cell.getStringCellValue() != null) {
                        for (int i = row.getFirstCellNum(); i < row.getLastCellNum(); i++) {
                            String valor = "";
                            if (row.getCell(i) != null && row.getCell(i).getStringCellValue() != null) {
                                valor = row.getCell(i).getStringCellValue();
                            }
                            table_cell = new PdfPCell(new Phrase(valor, fontH1));
                            my_table.addCell(table_cell);

                        }
                        break;
                    }
                }

            }

        }
        //Finally add the table to PDF document
        iText_xls_2_pdf.add(my_table);
        iText_xls_2_pdf.close();
        //we created our pdf file..
        return dsf.toByteArray(); //close xls
    }


    public static void enviaEmail(String conteudo, String tipoNotificacao) throws Exception {
        if (ApplicationProperties.mailBlocked()) {
            logger.log(Level.INFO, "mail are blocked {0}");
            return;
        }

        GenericDao<Configuracao> genericDao = new GenericDao<>();
        genericDao.beginTransaction();
        //propriedades
        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(Configuracao.ID));

        String aliasUsuario = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.USUARIO);
        propriedades.add(new Propriedade(Usuario.ID, Usuario.class, aliasUsuario));
        propriedades.add(new Propriedade(Usuario.NOME, Usuario.class, aliasUsuario));
        propriedades.add(new Propriedade(Usuario.LOGIN, Usuario.class, aliasUsuario));
        propriedades.add(new Propriedade(Usuario.EXCLUIDO, Usuario.class, aliasUsuario));

        String aliasTipoConfiguracao = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.TIPO_CONFIGURACAO);
        propriedades.add(new Propriedade(TipoConfiguracao.ID, TipoConfiguracao.class, aliasTipoConfiguracao));
        propriedades.add(new Propriedade(TipoConfiguracao.DESCRICAO, TipoConfiguracao.class, aliasTipoConfiguracao));

        List<Configuracao> listaConfiguracao = null;

        UserConfigurationController userConfigurationController = new UserConfigurationController();

        if (tipoNotificacao.equals(Constants.TIPO_NOTIFICACAO_GESTAO_ESCALA)) {
            listaConfiguracao = userConfigurationController.findAllByConfigurationType(Constants.TIPO_CONFIGURACAO_GESTAO_ESCALA);

        } else if (tipoNotificacao.equals(Constants.TIPO_NOTIFICACAO_CADASTRO_APLICATIVO)) {
            listaConfiguracao = userConfigurationController.findAllByConfigurationType(Constants.TIPO_CONFIGURACAO_CADASTRO_APLICATIVO);

        } else if (tipoNotificacao.equals(Constants.TIPO_NOTIFICACAO_DOCUMENTO_ADICIONAL)) {
            listaConfiguracao = userConfigurationController.findAllByConfigurationType(Constants.TIPO_CONFIGURACAO_DOCUMENTOS_ADICIONAIS);
        } else if (tipoNotificacao.equals(Constants.TIPO_NOTIFICACAO_CADASTRO_COMPLETO)) {
            listaConfiguracao = userConfigurationController.findAllByConfigurationType(Constants.TIPO_CONFIGURACAO_CADASTRO_COMPLETO);
        } else if (tipoNotificacao.equals(Constants.TIPO_NOTIFICACAO_OUTRA_MODALIDADE)) {
            listaConfiguracao = userConfigurationController.findAllByConfigurationType(Constants.TIPO_CONFIGURACAO_OUTRA_MODALIDADE);
        }


        if (!isNullOrEmpty(listaConfiguracao)) {
            String emails = listaConfiguracao.stream()
                    .map(conf -> conf.getUsuario().getLogin())
                    .collect(Collectors.joining(";"));
            // Envia um e-mail para o médico informando o aceite
            EmailSendGrid email = new EmailSendGrid(emails, "Nova Notificação",
                    conteudo, true);
            SendGridUtil.enviar(email);
        }
    }

    public static void enviaEmailGestaoEscala(String conteudo, Integer usuarioId) {
        if (ApplicationProperties.mailBlocked()) {
            logger.log(Level.INFO, "mail are blocked {0}");
            return;
        }

        UserConfigurationController userConfigurationController = new UserConfigurationController();

        List<Configuracao> listaConfiguracao = userConfigurationController.findAllByConfigurationType(Constants.TIPO_CONFIGURACAO_GESTAO_ESCALA);


        if (!isNullOrEmpty(listaConfiguracao)) {
            String emails = listaConfiguracao.stream()
                    .filter(it -> it.getUsuario().getId().equals(usuarioId))
                    .map(conf -> conf.getUsuario().getLogin())
                    .collect(Collectors.joining(";"));
            // Envia um e-mail para o médico informando o aceite
            EmailSendGrid email = new EmailSendGrid(emails, "Nova Notificação",
                    conteudo, true);
            SendGridUtil.enviar(email);
        }
    }

    public static void notifyAdminERPMedicRegisterCompleted(Medico medico) {

        if (Util.isNullOrFalse(medico.getAtivo()) || Util.isNullOrFalse(medico.getCadastroCompleto())) {
            return;
        }

        try {
            enviaEmail(getHtmlTemplateToMedicRegisterCompleted(medico), Constants.TIPO_NOTIFICACAO_CADASTRO_COMPLETO);
        } catch (Exception e) {
            logger.warning("Fail to sent email: " + e.getMessage());
        }
    }

        private static String getHtmlTemplateToMedicRegisterCompleted(Medico medico) {
            String html = "";
            html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
            html += "<p style=\"font-weight:bold;\">Olá,</p>";
            html += "<p>O Dr(a). " + medico.getNome() + " está com cadastro completo.</p>";
            html += "<p>Confira acessando a tela de médicos no sistema.</p>";
            html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
            html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
            html += "</div>";
            return html;
        }

    public static void notifyAdminMedicRegisterCompletedReceiveByAnotherModality(Medico medico, List<PaymentData> paymentsData) {

        if (Util.isNullOrFalse(medico.getAtivo()) || Util.isNullOrFalse(medico.getCadastroCompleto()) || isNullOrEmpty(paymentsData) || paymentsData.stream().noneMatch(it -> it.getPaymentType().equals(PaymentType.SO))) {
            return;
        }

        try {
            enviaEmail(getHtmlTemplateToMedicRegisterCompletedReceiveByAnotherModality(medico), Constants.TIPO_NOTIFICACAO_OUTRA_MODALIDADE);
        } catch (Exception e) {
            logger.warning("Fail to sent email: " + e.getMessage());
        }
    }

    private static String getHtmlTemplateToMedicRegisterCompletedReceiveByAnotherModality(Medico medico) {
        String html = "";
        html += "<div style=\"margin:25px 0px 25px 0px;font-size:18px;color:#000000;font-family: Arial;\">";
        html += "<p style=\"font-weight:bold;\">Olá,</p>";
        html += "<p>O Dr(a). " + medico.getNome() + " está com cadastro completo e selecionou o recebimento como outra modalidade</p>";
        html += "<p>Link: <a href='"+ Constants.URL_SYSTEM +"admin/cadastro-usuario-app/" + medico.getId() + "'>" + Constants.URL_SYSTEM + "admin/cadastro-usuario-app/" + medico.getId() + "</a></p>";
        html += "<p style='color:#888888;font-size: 16px;'>Este e-mail foi gerado automaticamente, favor não responder.</p>";
        html += "<p style='color:#888888;font-size: 16px;margin-top:60px;'>Esta comunicação, incluindo quaisquer anexos, contém informações confidenciais e destina-se a indivíduos e propósitos específicos. Se você recebeu esta comunicação por engano, por favor, apague-a imediatamente. O uso não autorizado, acesso, cópia ou divulgação das informações aqui contidas é estritamente proibido.</p>";
        html += "</div>";
        return html;
    }

    /**
     * @param plantao
     * @param listaPlantoesMedico
     * @return
     */
    public static boolean verificaHorarioConflitantePlantaoMedico(Plantao plantao, List<Plantao> listaPlantoesMedico) {

        boolean temPlantao = false;

        //formato no padrão BR
        SimpleDateFormat dfData = new SimpleDateFormat("dd/MM/yyyy");
        DateTime horaInicioPlantao = new DateTime(plantao.getHoraInicio());
        DateTime horaFimPlantao = new DateTime(plantao.getHoraFim());

        //faz o set dos segundos do planto sendo comparado em 0 para não interferir nas comparações
        GregorianCalendar inicioPlantao = new GregorianCalendar();
        inicioPlantao.setTime(plantao.getData());
        inicioPlantao.set(GregorianCalendar.MINUTE, horaInicioPlantao.getMinuteOfHour());
        inicioPlantao.set(GregorianCalendar.HOUR, horaInicioPlantao.getHourOfDay());
        inicioPlantao.set(GregorianCalendar.SECOND, 0);

        //faz o set dos segundos do planto sendo comparado em 0 para não interferir nas comparações
        GregorianCalendar fimPlantao = new GregorianCalendar();
        fimPlantao.setTime(plantao.getData());
        fimPlantao.set(GregorianCalendar.MINUTE, horaFimPlantao.getMinuteOfHour());
        fimPlantao.set(GregorianCalendar.HOUR, horaFimPlantao.getHourOfDay());
        fimPlantao.set(GregorianCalendar.SECOND, 0);

        if (fimPlantao.before(inicioPlantao)) {
            fimPlantao.add(Calendar.DATE, 1);
        }

        for (Plantao plantaoMedico : listaPlantoesMedico) {
            //se for o mesmo plantão pula a verificação
            if (plantaoMedico.getId().equals(plantao.getId())) {
                continue;
            }
            DateTime horaInicioPlantaoBase = new DateTime(plantaoMedico.getHoraInicio());
            DateTime horaFimPlantaoBase = new DateTime(plantaoMedico.getHoraFim());

            //faz o set dos segundos do planto do médico em 0 para não interferir nas comparações
            GregorianCalendar inicioPlantaoBase = new GregorianCalendar();
            inicioPlantaoBase.setTime(plantaoMedico.getData());
            inicioPlantaoBase.set(GregorianCalendar.HOUR_OF_DAY, horaInicioPlantaoBase.getHourOfDay());
            inicioPlantaoBase.set(GregorianCalendar.MINUTE, horaInicioPlantaoBase.getMinuteOfHour());
            inicioPlantaoBase.set(GregorianCalendar.SECOND, 0);

            //faz o set dos segundos do planto do médico em 0 para não interferir nas comparações
            GregorianCalendar fimPlantaoBase = new GregorianCalendar();
            fimPlantaoBase.setTime(plantaoMedico.getData());
            fimPlantaoBase.set(GregorianCalendar.HOUR_OF_DAY, horaFimPlantaoBase.getHourOfDay());
            fimPlantaoBase.set(GregorianCalendar.MINUTE, horaFimPlantaoBase.getMinuteOfHour());
            fimPlantaoBase.set(GregorianCalendar.SECOND, 0);

            if (fimPlantaoBase.before(inicioPlantaoBase)) {
                fimPlantaoBase.add(Calendar.DATE, 1);
            }

            //compara os horários somente se os plantões forem do mesmo dia
            if (dfData.format(plantaoMedico.getData()).equals(dfData.format(plantao.getData()))) {
                //se os horários forem iguais...
                if (inicioPlantao.getTime().equals(inicioPlantaoBase.getTime()) && fimPlantao.getTime().equals(fimPlantaoBase.getTime())) {
                    temPlantao = true;

                    //verifica se o intervalo de horários conflita
                } else if (
                        (inicioPlantao.getTime().before(fimPlantaoBase.getTime()) && fimPlantao.getTime().after(inicioPlantaoBase.getTime()))
                        && !(inicioPlantaoBase.before(inicioPlantao) && fimPlantaoBase.equals(inicioPlantao))
                        && !(inicioPlantaoBase.equals(fimPlantao) && fimPlantaoBase.after(fimPlantao))
                ) {
                    temPlantao = true;
                }
            }
        }
        return temPlantao;
    }

    public static Escala obterEscalaPorPlantao(int id) throws Exception {
        List<Propriedade> propriedades = new ArrayList<>();

        propriedades.add(new Propriedade(Plantao.ID));

        String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
        propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
        propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));

//        String aliasContrato = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA, Escala.CONTRATO);
//        propriedades.add(new Propriedade(Contrato.ID, Contrato.class, aliasContrato));
//        propriedades.add(new Propriedade(Contrato.LOCAL, Contrato.class, aliasContrato));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, id, Filtro.EQUAL));

        GenericDao<Plantao> genericDao = new GenericDao<>();

        Plantao plantao = genericDao.selectUnique(propriedades, Plantao.class, nxCriterion);

        return plantao.getEscala();
    }

    /**
     * Copy only the time of one date to the date of another date.
     */
    public static Date copyTimeToDate(Date date, Date time) {
        Calendar t = Calendar.getInstance();
        t.setTime(time);

        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, t.get(Calendar.HOUR_OF_DAY));
        c.set(Calendar.MINUTE, t.get(Calendar.MINUTE));
        c.set(Calendar.SECOND, t.get(Calendar.SECOND));
        c.set(Calendar.MILLISECOND, t.get(Calendar.MILLISECOND));
        return c.getTime();
    }

    /**
     * Adiciona nrDias na data recebida por parametro
     *
     * @param data
     * @param nrDias
     * @return data + nrDias
     * @throws Exception
     */
    public static Date addDia(Date data, int nrDias) throws Exception {
        try {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(data);
            calendar.add(Calendar.DATE, +nrDias);
            return new Date(calendar.getTime().getTime());
        } catch (Exception e) {
            throw new Exception("Erro no metodo addDia(data: " + data.toString() + ", dias: " + nrDias + "): " + e);
        }
    }

    public static String getStringJsonFor(Object object) {
        Gson gson = new Gson();
        return gson.toJson(object);
    }

    public static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
        Map<Object, Boolean> map = new ConcurrentHashMap<>();
        return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }
}
