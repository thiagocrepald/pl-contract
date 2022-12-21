package br.com.plantaomais.util;

import jxl.write.DateTime;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateUtils {

    private static final String DEFAULT_PATTERN_DATE = "dd/MM/yyyy";
    private static final String DEFAULT_PATTERN_HOUR = "HH:mm";
    private static final String DEFAULT_PATTERN_DATE_DAY_AND_MONTH = "dd/MM";
    private static final String DEFAULT_PATTERN_DATE_MONTH_AND_YEAR = "MM/yyyy";

    private static final DateTimeFormatter DEFAULT_HOUR_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_PATTERN_HOUR);
    private static final DateTimeFormatter DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_PATTERN_DATE);
    private static final DateTimeFormatter DEFAULT_DATE_FORMATTER_DAY_AND_MONTH = DateTimeFormatter.ofPattern(DEFAULT_PATTERN_DATE_DAY_AND_MONTH);
    private static final DateTimeFormatter DEFAULT_DATE_FORMATTER_MONTH_AND_YEAR = DateTimeFormatter.ofPattern(DEFAULT_PATTERN_DATE_MONTH_AND_YEAR);
    private static final ZoneId DEFAULT_ZONE_BR = ZoneId.of("America/Sao_Paulo");


    public static String formatHour(Instant instant) {

        return LocalDateTime
                .ofInstant(instant, DEFAULT_ZONE_BR)
                .format(DEFAULT_HOUR_FORMATTER);
    }

    public static String formatHour(Instant instant, DateTimeFormatter formatter) {

        return LocalDateTime
                .ofInstant(instant, DEFAULT_ZONE_BR)
                .format(formatter);
    }

    public static String formatHour(Date date) {

        return formatHour(date.toInstant());
    }

    public static String formatHour(Date date, DateTimeFormatter formatter) {

        return formatHour(date.toInstant(), formatter);
    }

    public static String formatDate(Instant instant) {
        return LocalDateTime
                .ofInstant(instant, DEFAULT_ZONE_BR)
                .format(DEFAULT_DATE_FORMATTER);
    }

    public static String formatDate(Date date) {
        return LocalDateTime
                .ofInstant(date.toInstant(), ZoneOffset.UTC)
                .format(DEFAULT_DATE_FORMATTER);
    }

    public static String formatDate(Date date, DateTimeFormatter formatter) {
        return LocalDateTime
                .ofInstant(date.toInstant(), ZoneOffset.UTC)
                .format(formatter);
    }

    public static String formatByPattern(Instant instant, String pattern, ZoneId zone) {
        if (zone == null) {
            zone = DEFAULT_ZONE_BR;
        }

        if (pattern == null) {
            pattern = DEFAULT_PATTERN_DATE;
        }

        return LocalDateTime
            .ofInstant(instant, zone)
            .format(DateTimeFormatter.ofPattern(pattern));
    }


    public static String formatByPattern(Instant instant, String pattern) {
        return formatByPattern(instant, pattern, null);
    }

    public static String formatDateToDayAndMonth(Date date) {
        return LocalDateTime
                .ofInstant(date.toInstant(), ZoneOffset.UTC)
                .format(DEFAULT_DATE_FORMATTER_DAY_AND_MONTH);
    }

    public static String formatDateToMonthAndYear(Date date) {
        return LocalDateTime
                .ofInstant(date.toInstant(), ZoneOffset.UTC)
                .format(DEFAULT_DATE_FORMATTER_MONTH_AND_YEAR);
    }


}
