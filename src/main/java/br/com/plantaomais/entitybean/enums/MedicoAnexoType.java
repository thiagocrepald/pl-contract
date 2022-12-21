package br.com.plantaomais.entitybean.enums;

public enum MedicoAnexoType {
    CRM(1),
    PROTOCOLO(2),
    DIPLOMA_MEDICO_OU_DECLARACAO_CONCLUSAO(3),
    RG(4),
    CPF(5),
    COMPROVANTE_ENDEREÇO(6),
    TITULOS_ESPECIALIDADE(7),
    CERTIDAO_RQE(8),
    CERTIDAO_CASAMENTO(9),
    CARTEIRINHA_DE_CURSOS(10),
    CONTRATO_SOCIAL_CONSOLIDADO(11),
    CARTAO_CNPJ(12),
    CERTIDAO_SIMPLIFICADA(13),
    CNH(14);

    private final int value;

    MedicoAnexoType(final int newValue) {
        value = newValue;
    }

    public int getValue() { return value; }
}
