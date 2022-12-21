package br.com.plantaomais.util;

import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.layoutEscala.DiasVo;
import br.com.plantaomais.vo.layoutEscala.LayoutEscalaVo;
import br.com.plantaomais.vo.layoutEscala.SetoresVo;
import br.com.plantaomais.vo.layoutEscala.TurnosVo;
import com.vladsch.flexmark.pdf.converter.PdfConverterExtension;
import org.joda.time.DateTime;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static br.com.plantaomais.util.Constants.STATUS_PLANTAO_CONFIRMADO;
import static br.com.plantaomais.util.Constants.STATUS_PLANTAO_DOACAO;
import static br.com.plantaomais.util.Constants.STATUS_PLANTAO_FIXO;
import static br.com.plantaomais.util.DateUtils.formatDateToDayAndMonth;

public abstract class HtmlUtils {

    public static final String SCHEDULE_NAME = "@schedule.name";
    public static final String SCHEDULE_DATE = "@schedule.date";
    public static final String CSS_URI = "reports/ScheduleReport.css";
    public static final String HTML_URI = "reports/ScheduleReport.html";

    private static final Integer MAX_ON_CALLS_PER_PAGE = 5;

    private static Integer mondayCount;
    private static Integer tuesdayCount;
    private static Integer wednesdayCount;
    private static Integer thursdayCount;
    private static Integer fridayCount;
    private static Integer saturdayCount;
    private static Integer sundayCount;

    private static Integer sectorMondayCount;
    private static Integer sectorTuesdayCount;
    private static Integer sectorWednesdayCount;
    private static Integer sectorThursdayCount;
    private static Integer sectorFridayCount;
    private static Integer sectorSaturdayCount;
    private static Integer sectorSundayCount;

    private static Integer tableCount;
    private static String weekNumber;
    private static Boolean breakTable;
    private static List<DiasVo> weekDays;
    private static TurnosVo period;

    public static String getCss() throws IOException {
        return ResourceUtils.getFileFromResource(CSS_URI);
    }

    public HtmlUtils() {}

    public static String addCssToHtml(String html) throws IOException {
        return PdfConverterExtension.embedCss(html, getCss());
    }

    public static String generateHtml(List<LayoutEscalaVo> layoutEscala, DateTime date, String scheduleName) throws IOException {
        var html = ResourceUtils.getFileFromResource(HTML_URI);

        setVariablesValues();

        if (layoutEscala.size() == 0) {
            html += finishHtml();
            return html;
        }

        for (LayoutEscalaVo week : layoutEscala) {
            html += buildTable();
            weekNumber = week.getNumSemana().toString();
            weekDays = week.getDIAS();
            html += buildWeekHeader();
            for (TurnosVo turno : week.getTURNOS()) {
                period = turno;
                html += buildPeriodHeader(capitalizeFirstLetter(turno.getDesc()));
                for (SetoresVo sector : turno.getSETORES()) {
                    sectorMondayCount = 0;
                    sectorTuesdayCount = 0;
                    sectorWednesdayCount = 0;
                    sectorThursdayCount = 0;
                    sectorFridayCount = 0;
                    sectorSaturdayCount = 0;
                    sectorSundayCount = 0;
                    html += buildSector(sector);
                }
            }
            html += finishTable();
        }

        html += finishHtml();

        html = html.replace(SCHEDULE_NAME, scheduleName);
        html = html.replace(SCHEDULE_DATE, monthString(date.getMonthOfYear()) + " " + date.getYear());

        return addCssToHtml(html);
    }

    private static void setVariablesValues() {
        mondayCount = 0;
        tuesdayCount = 0;
        wednesdayCount = 0;
        thursdayCount = 0;
        fridayCount = 0;
        saturdayCount = 0;
        sundayCount = 0;
        sectorMondayCount = 0;
        sectorTuesdayCount = 0;
        sectorWednesdayCount = 0;
        sectorThursdayCount = 0;
        sectorFridayCount = 0;
        sectorSaturdayCount = 0;
        sectorSundayCount = 0;
        tableCount = 0;
        weekNumber = "";
        breakTable = false;
        weekDays = new ArrayList<>();
        period = null;
    }

    private static String buildTable() {
        tableCount++;
        mondayCount = 0;
        tuesdayCount = 0;
        wednesdayCount = 0;
        thursdayCount = 0;
        fridayCount = 0;
        saturdayCount = 0;
        sundayCount = 0;

        var breakPageClass = tableCount != 1 ? "break-page" : "";
        return "<table class=\"" + breakPageClass + "\">\n" +
                "    <tr class=\"title-header\">\n" +
                "      <td style=\"width: 50%;\" colspan=\"4\">\n" +
                "                <span class=\"title font-800\">\n" +
                "                    @schedule.name\n" +
                "                </span>\n" +
                "        <span class=\"title font-600\">\n" +
                "                    @schedule.date\n" +
                "                </span>\n" +
                "      </td>\n" +
                "      <td class=\"status-container\" colspan=\"4\">\n" +
                "        <div class=\"status\"><span class=\"dot green-dot\">&nbsp;</span><span>Confirmado</span></div>\n" +
                "        <div class=\"status\"><span class=\"dot blue-dot\">&nbsp;</span><span>Fixo</span></div>\n" +
                "        <div class=\"status\"><span class=\"dot red-dot\">&nbsp;</span><span>Troca/Doação</span></div>\n" +
                "      </td>\n" +
                "    </tr>\n";
    }

    private static String finishTable() {
        return "</table>\n";
    }

    private static String finishHtml() {
        return "\n" +
                "</div>\n" +
                "</body>\n" +
                "</html>";
    }

    private static String buildWeekHeader() {
        String html = "";
        html += "<tr class=\"week-header-tr\">\n" +
                "      <td class=\"week-header font-700 week-header-td\">\n" +
                "        Semana <span class=\"week-header-number\">" + weekNumber + "</span>\n" +
                "      </td>\n";

        weekDays = weekDays.stream()
                .filter(it -> it.getData() != null)
                .collect(Collectors.toList());
        for (DiasVo day : weekDays) {
            html += buildWeekHeaderDay(formatWeekDay(day.getStr()), formatDateToDayAndMonth(day.getData()));
        }

        html += "</tr>\n";
        return html;

    }

    private static String buildWeekHeaderDay(String weekDay, String date) {
        return "      <td class=\"week-header-td font-600\">\n" +
                "        " + weekDay + " <span class=\"font-400\">" + date + "</span>\n" +
                "      </td>\n";
    }

    private static String buildPeriodHeader(String period) {
        return "<tr class=\"week-shift\">\n" +
                "      <td class=\"font-600\" colspan=\"8\">" + period + "</td>\n" +
                "    </tr>\n";
    }

    private static String buildSector(SetoresVo sector) {
        String html = "";
        if (sector.getPLANTOES() == null) return html;

        if (mondayCount < MAX_ON_CALLS_PER_PAGE
                && tuesdayCount < MAX_ON_CALLS_PER_PAGE
                && wednesdayCount < MAX_ON_CALLS_PER_PAGE
                && thursdayCount < MAX_ON_CALLS_PER_PAGE
                && fridayCount < MAX_ON_CALLS_PER_PAGE
                && saturdayCount < MAX_ON_CALLS_PER_PAGE
                && sundayCount < MAX_ON_CALLS_PER_PAGE) {

            html += "<tr class=\"week-schedule\">";
            html += "<td class=\"font-600 week-sector\">" + sector.getDesc() + "</td>\n";
            html += "<td>";
            var mondayOnCalls = buildOnCalls(sector.getPLANTOES().getSegunda(), mondayCount, sectorMondayCount).entrySet().iterator().next();
            html += mondayOnCalls.getKey();
            mondayCount += mondayOnCalls.getValue();
            sectorMondayCount = mondayOnCalls.getValue();
            html += "</td>\n";
            html += "<td>";
            var tuesdayOnCalls = buildOnCalls(sector.getPLANTOES().getTerca(), tuesdayCount, sectorTuesdayCount).entrySet().iterator().next();
            html += tuesdayOnCalls.getKey();
            tuesdayCount += tuesdayOnCalls.getValue();
            sectorTuesdayCount = tuesdayOnCalls.getValue();
            html += "</td>\n";
            html += "<td>";
            var wednesdayOnCalls = buildOnCalls(sector.getPLANTOES().getQuarta(), wednesdayCount, sectorWednesdayCount).entrySet().iterator().next();
            html += wednesdayOnCalls.getKey();
            wednesdayCount += wednesdayOnCalls.getValue();
            sectorWednesdayCount = wednesdayOnCalls.getValue();
            html += "</td>\n";
            html += "<td>";
            var thursdayOnCalls = buildOnCalls(sector.getPLANTOES().getQuinta(), thursdayCount, sectorThursdayCount).entrySet().iterator().next();
            html += thursdayOnCalls.getKey();
            thursdayCount += thursdayOnCalls.getValue();
            sectorThursdayCount = thursdayOnCalls.getValue();
            html += "</td>\n";
            html += "<td>";
            var fridayOnCalls = buildOnCalls(sector.getPLANTOES().getSexta(), fridayCount, sectorFridayCount).entrySet().iterator().next();
            html += fridayOnCalls.getKey();
            fridayCount += fridayOnCalls.getValue();
            sectorFridayCount = fridayOnCalls.getValue();
            html += "</td>\n";
            html += "<td>";
            var saturdayOnCalls = buildOnCalls(sector.getPLANTOES().getSabado(), saturdayCount, sectorSaturdayCount).entrySet().iterator().next();
            html += saturdayOnCalls.getKey();
            saturdayCount += saturdayOnCalls.getValue();
            sectorSaturdayCount = saturdayOnCalls.getValue();
            html += "</td>\n";
            html += "<td>";
            var sundayOnCalls = buildOnCalls(sector.getPLANTOES().getDomingo(), sundayCount, sectorSundayCount).entrySet().iterator().next();
            html += sundayOnCalls.getKey();
            sundayCount += sundayOnCalls.getValue();
            sectorSundayCount = sundayOnCalls.getValue();
            html += "</td>\n";
            html += "</tr>\n";
        } else {
            breakTable = true;
        }

        if (breakTable) {
            breakTable = false;
            html += finishTable();
            html += buildTable();
            html += buildWeekHeader();
            html += buildPeriodHeader(capitalizeFirstLetter(period.getDesc()));
            html += buildSector(sector);
        }

        return html;
    }

    private static Map<String, Integer> buildOnCalls(List<PlantaoVo> plantoes, Integer weekDayCount, Integer sectorCount) {
        String html = "";
        String onCallStatusClass = "";
        var count = 0;
        var onCallCount = 0;
        if (plantoes == null) {
            return Map.of(html, count);
        }
        for (PlantaoVo plantao : plantoes) {
            onCallCount++;
            if (onCallCount <= sectorCount) {
                continue;
            }
            count++;
            if (count + weekDayCount > MAX_ON_CALLS_PER_PAGE) {
                breakTable = true;
                count--;
                break;
            };

            if (plantao.getStatus() != null) {
                switch (plantao.getStatus()) {
                    case STATUS_PLANTAO_FIXO:
                        onCallStatusClass = "on-call-fixed";
                        break;
                    case STATUS_PLANTAO_CONFIRMADO:
                        onCallStatusClass = "on-call-confirmed";
                        break;
                    case STATUS_PLANTAO_DOACAO:
                        onCallStatusClass = "on-call-swap-donation";
                        break;
                    default:
                        onCallStatusClass = "";
                }
            } else {
                onCallStatusClass = "";
            }

            var doctorName = plantao.getMedico() != null ? plantao.getMedico().getName() : "";
            var doctorCrm = plantao.getMedico() != null ? plantao.getMedico().getNumeroCrm() : "";

            SimpleDateFormat sdfHour = new SimpleDateFormat("HH:mm");
            String startTime = sdfHour.format(plantao.getHoraInicio());
            String endTime = sdfHour.format(plantao.getHoraFim());

            html += "<div class=\"on-call " + onCallStatusClass + "\">\n" +
                    "   <span class=\"doctor-name\">" + doctorName + "</span>\n" +
                    "   <div class=\"inline-time-crm font-400\">\n" +
                    "     <span class=\"on-call-time font-400\">" + startTime+"/"+endTime + "</span>\n" +
                    "     <span class=\"doctor-crm font-300\">" + doctorCrm + "</span>\n" +
                    "   </div>\n" +
                    " </div>\n";
        }
        return Map.of(html, count);
    }

    private static String formatWeekDay(String weekDay) {
        return capitalizeFirstLetter(weekDay.substring(0, 3));
    }

    private static String capitalizeFirstLetter(String stringToCapitalize) {
        return stringToCapitalize.substring(0, 1).toUpperCase() + stringToCapitalize.substring(1);
    }

    private static String monthString(Integer month) {
        switch (month) {
            case 1:
                return "Janeiro";
            case 2:
                return "Fevereiro";
            case 3:
                return "Março";
            case 4:
                return "Abril";
            case 5:
                return "Maio";
            case 6:
                return "Junho";
            case 7:
                return "Julho";
            case 8:
                return "Agosto";
            case 9:
                return "Setembro";
            case 10:
                return "Outubro";
            case 11:
                return "Novembro";
            case 12:
                return "Dezembro";
            default:
                return "";
        }
    }


}