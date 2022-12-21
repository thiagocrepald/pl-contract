package br.com.plantaomais.entitybean.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum PaymentType {
    PF, // PRIVATE_INDIVIDUAL
    PJ, // LEGAL_ENTITY,
    SO  // ANOTHER_MODALITY
}
