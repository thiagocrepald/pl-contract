package br.com.plantaomais.entitybean.push;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import org.apache.commons.lang3.math.NumberUtils;

import static org.apache.commons.lang3.StringUtils.isNumeric;
import static org.apache.commons.lang3.math.NumberUtils.isParsable;

public enum NotificationType {

    QUOTATION_CHANGED,
    SALES_APPROVED,
    SALES_REJECTED,
    OTHER;

    @JsonCreator
    public static NotificationType findByValue(String value) {
        for (NotificationType p : values()) {
            if (p.getValue().equalsIgnoreCase(value)) {
                return p;
            }
        }
        if (isNumeric(value) && isParsable(value)) {
            int ordinal = NumberUtils.toInt(value);
            if (ordinal < values().length) {
                return values()[ordinal];
            }
        }

        return null;
    }

    @JsonValue
    public String getValue() {
        return this.name();
    }


    public static class Extras {
        public static final String PAYLOAD = "payload";
        public static final String QUOTATION = "quotation";
        public static final String SALES = "sales";
        public static final String TITLE = "title";
    }
}
