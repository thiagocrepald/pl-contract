package br.com.plantaomais.entitybean.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonValue;
import org.apache.commons.lang3.math.NumberUtils;

import static java.util.Optional.ofNullable;
import static org.apache.commons.lang3.StringUtils.isNumeric;
import static org.apache.commons.lang3.math.NumberUtils.isParsable;

public enum EntityStatus {
    ACTIVE,
    INACTIVE;

    @JsonCreator
    public static EntityStatus findByValue(String value) {
        for (EntityStatus status : values()) {
            if (status.getValue().equalsIgnoreCase(value)) {
                return status;
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

    public static EntityStatus findByValueOrElse(String value, EntityStatus other) {
        return ofNullable(findByValue(value)).orElse(other);
    }

    @JsonValue
    @JsonGetter
    public String getValue() {
        return this.name();
    }

    public EntityStatus toggle() {
        return this.equals(ACTIVE) ? INACTIVE : ACTIVE;
    }

}