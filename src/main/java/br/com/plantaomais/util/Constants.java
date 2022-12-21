package br.com.plantaomais.util;

import br.com.plantaomais.config.ApplicationProperties;

import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Contains the client IDs and scopes for allowed clients consuming the
 * helloworld API.
 */
public class Constants {

    private static final Logger logger = Logger.getLogger(Constants.class.getName());
    public static final ApplicationProperties APPLICATION_PROPERTIES;

    public static final String NOME_PROJETO = "Plantão Mais";
    public static final String EMAIL_NOTIFICACOES = "no-reply@app.plantaomais.com.br";

    public static String SENDGRID_API_KEY;
    public static String AWS_KEY;
    public static String URL_SYSTEM;

    public static final String PUSH_QUALIFIER_MAPPER = "pushObjectMapper";

    static {
        APPLICATION_PROPERTIES = ApplicationProperties.getInstance();

        URL_SYSTEM = Optional.ofNullable(APPLICATION_PROPERTIES.getProperty("host.url"))
                .orElseGet(() -> {
                    logger.log(Level.WARNING, "Not found host.url, using localhost:3000");
                    return "http://localhost:3000";
                });

        SENDGRID_API_KEY = Optional.ofNullable(APPLICATION_PROPERTIES.getProperty("sendgrid.key"))
                .orElseGet(() -> {
                    logger.log(Level.WARNING, "Not found sendgrid.key, using empty string");
                    return "";
                });

        AWS_KEY = Optional.ofNullable(APPLICATION_PROPERTIES.getProperty("aws.key"))
                .orElseGet(() -> {
                    logger.log(Level.WARNING, "Not found sendgrid.key, using empty string");
                    return "";
                });

    }


    public static final String ACESSO_NEGADO = "Acesso Negado!";
    public static final String ACESSO_NEGADO_TIPO_USUARIO_DESCONHECIDO = "Acesso Negado, tipo de usuario desconhecido! - {0}";
    public static final String ERRO_INTERNO_SISTEMA = "Desculpe, ocorreu um erro interno. Tente novamente.";
    public static final String SUCESSO = "Operação realizada com sucesso!";

    public static final String EMAIL_SCOPE = "https://www.googleapis.com/auth/userinfo.email";

    public static final int NO_LIMIT = -1;

    public static final String EXCLUIDO_SIM = "S";
    public static final String EXCLUIDO_NAO = "N";

    public static final String TURNO_MANHA = "manhã";
    public static final String TURNO_TARDE = "tarde";
    public static final String TURNO_NOITE = "noite";
    public static final String TURNO_CINDERELA = "cinderela";

    public static final String SEGUNDA = "segunda";
    public static final String TERCA = "terça";
    public static final String QUARTA = "quarta";
    public static final String QUINTA = "quinta";
    public static final String SEXTA = "sexta";
    public static final String SABADO = "sabado";
    public static final String DOMINGO = "domingo";

    public static final String SEGUNDA_LABEL = "Segunda-feira";
    public static final String TERCA_LABEL = "Terça-feira";
    public static final String QUARTA_LABEL = "Quarta-feira";
    public static final String QUINTA_LABEL = "Quinta-feira";
    public static final String SEXTA_LABEL = "Sexta-feira";
    public static final String SABADO_LABEL = "Sábado";
    public static final String DOMINGO_LABEL = "Domingo";

    public static final String LOCAL_CAPITAL = "capital";
    public static final String LOCAL_COASTAL = "coastal";
    public static final String LOCAL_COUNTRYSIDE = "countryside";

    public static final String LOCAL_CAPITAL_LABEL = "Capital";
    public static final String LOCAL_COASTAL_LABEL = "Litoral";
    public static final String LOCAL_COUNTRYSIDE_LABEL = "Interior";

    public static final Map<String, String> mapLocalityLabels = Map.of(
            LOCAL_CAPITAL, LOCAL_CAPITAL_LABEL,
            LOCAL_COASTAL, LOCAL_COASTAL_LABEL,
            LOCAL_COUNTRYSIDE, LOCAL_COUNTRYSIDE_LABEL
    );

    public static final String SETOR_CONSULTORIO = "consultorio";
    public static final String SETOR_OBSERVACAO = "observacao";
    public static final String SETOR_EMERGENCIA = "emergencia";
    public static final String SETOR_PEDIATRIA = "pediatria";

    public static final String SETOR_OBSERVACAO_LABEL = "Observação";
    public static final String SETOR_CONSULTORIO_LABEL = "Consultório";
    public static final String SETOR_EMERGENCIA_LABEL = "Emergência";
    public static final String SETOR_PEDIATRIA_LABEL = "Pediatria";

    public static final Map<String, String> mapSetorLabels = Map.of(
            SETOR_CONSULTORIO, SETOR_CONSULTORIO_LABEL,
            SETOR_OBSERVACAO, SETOR_OBSERVACAO_LABEL,
            SETOR_EMERGENCIA, SETOR_EMERGENCIA_LABEL,
            SETOR_PEDIATRIA, SETOR_PEDIATRIA_LABEL
    );

    public static final String MANHA = "manha";
    public static final String TARDE = "tarde";
    public static final String NOITE = "noite";
    public static final String CINDERELA = "cinderela";

    public static final Map<String, String> mapPeriodoLabel = Map.of(
            MANHA, TURNO_MANHA,
            TARDE, TURNO_TARDE,
            NOITE, TURNO_NOITE,
            CINDERELA, TURNO_CINDERELA
    );

    public static final String PUSH_TYPE_APPLICANT_RECEIVED = "PUSH_TYPE_APPLICANT_RECEIVED";
    public static final String PUSH_TYPE_DONATION_OPEN_MY_OWN_DUTY = "PUSH_TYPE_DONATION_OPEN_MY_OWN";
    public static final String PUSH_TYPE_DONATION_NEW_OPEN = "PUSH_TYPE_DONATION_NEW_OPEN";
    public static final String PUSH_TYPE_DONATION_NEW_APPLICANT = "PUSH_TYPE_DONATION_NEW_APPLICANT";
    public static final String PUSH_TYPE_DONATION_APPLICANT_RECEIVED = "PUSH_TYPE_DONATION_APPLICANT_RECEIVED";
    public static final String PUSH_TYPE_DONATION_DECLINED = "PUSH_TYPE_DONATION_DECLINED";
    public static final String PUSH_TYPE_DONATION_ACCEPTED = "PUSH_TYPE_DONATION_ACCEPTED";
    public static final String PUSH_TYPE_DONATION_APPLICANT_ACCEPTED = "PUSH_TYPE_DONATION_APPLICANT_ACCEPTED";

    public static final String PUSH_TYPE_CHANGE_DUTY = "PUSH_TYPE_CHANGE_DUTY";
    public static final String PUSH_TYPE_CHANGE_DUTY_ACCEPTED = "PUSH_TYPE_CHANGE_DUTY_ACCEPTED";
    public static final String PUSH_TYPE_CHANGE_DUTY_DECLINED = "PUSH_TYPE_CHANGE_DUTY_DECLINED";

    public static final String PUSH_TYPE_NEW_SHIFT = "PUSH_TYPE_NEW_SHIFT";

    public static final String TIPO_PUSH_CANDIDATURA_ACEITA = "CANDIDATURA_ACEITA";
    public static final String TIPO_PUSH_CANDIDATURA_RECUSADA = "CANDIDATURA_RECUSADA";
    public static final String TIPO_PUSH_CADASTRO_COMPLETO = "CADASTRO COMPLETO";
    public static final String TIPO_PUSH_PLANTOES_DIVULGADOS = "PLANTOES_DIVULGADOS";
    public static final String TIPO_PUSH_MUDANCA_STATUS_PLANTAO = "MUDANCA_STATUS_PLANTAO";
    public static final String TIPO_PUSH_VALIDACAO_CADASTRO = "VALIDACAO_CADASTRO";
    public static final String TIPO_PUSH_INVALIDO_CADASTRO = "INVALIDO_CADASTRO";
    public static final String PUSH_TYPE_EVENT = "PUSH_TYPE_EVENT";
    public static final String PUSH_TYPE_REMINDER = "PUSH_TYPE_REMINDER";

    public static final String TIPO_PUSH_INFORMATIVO_ESCALA = "INFORMATIVO_ESCALA";

    public static final String TIPO_PUSH_DOCUMENTO_ADICIONAL = "DOCUMENTO_ADICIONAL";
    public static final String TIPO_PUSH_DOCUMENTO_ADICIONAL_INVALIDO = "DOCUMENTO_ADICIONAL_INVALIDO";


    public static final String NOME_SISTEMA = "Plantão Mais";
    public static final String NENHUM_USUARIO_NOTIFICACAO = "NENHUM_USUARIO_NOTIFICACAO";
    public static final String EMAIL_ENVIO_ERRO = "Não foi possivel enviar o e-mail!";


    public static final String STATUS_PLANTAO_FIXO = "F";
    public static final String STATUS_PLANTAO_CONFIRMADO = "C";
    public static final String STATUS_PLANTAO_A_CONFIRMAR = "AC";
    public static final String STATUS_PLANTAO_DOACAO = "D";
    public static final String STATUS_PLANTAO_RECUSADO = "R";

    public static final String TIPO_NOTIFICACAO_CADASTRO_APLICATIVO = "TIPO_NOTIFICACAO_CADASTRO_APLICATIVO";
    public static final String TIPO_NOTIFICACAO_GESTAO_ESCALA = "TIPO_NOTIFICACAO_GESTAO_ESCALA";
    public static final String TIPO_NOTIFICACAO_DOCUMENTO_ADICIONAL = "TIPO_NOTIFICACAO_DOCUMENTO_ADICIONAL";
    public static final String TIPO_NOTIFICACAO_CADASTRO_COMPLETO = "TIPO_NOTIFICACAO_CADASTRO_COMPLETO";
    public static final String TIPO_NOTIFICACAO_OUTRA_MODALIDADE = "TIPO_NOTIFICACAO_OUTRA_MODALIDADE";
    public static final String TIPO_NOTIFICACAO_NOVA_MODALIDADE = "TIPO_NOTIFICACAO_NOVA_MODALIDADE";

    public static final Integer TIPO_CONFIGURACAO_CADASTRO_APLICATIVO = 1;
    public static final Integer TIPO_CONFIGURACAO_GESTAO_ESCALA = 2;
    public static final Integer TIPO_CONFIGURACAO_WHATS_DUVIDAS_AJUDA = 3;
    public static final Integer TIPO_CONFIGURACAO_DOCUMENTOS_ADICIONAIS = 4;
    public static final Integer TIPO_CONFIGURACAO_CADASTRO_COMPLETO = 5;
    public static final Integer TIPO_CONFIGURACAO_OUTRA_MODALIDADE = 6;
    public static final Integer TIPO_CONFIGURACAO_NOVA_MODALIDADE = 7;

    public static final String MSG_HORARIO_CONFLITANTE_MEDICO_PLANTAO = "O médico já possui um plantão neste horário";
    public static final String MSG_MEDICO_SALVO_SUCESSO = "Médico salvo com sucesso!";
    public static final String MSG_MEDICO_SALVO_ERRO = "Desculpe, ocorreu um erro ao cadastrar o médico. Por favor, tente novamente.";

    public static final String PRE_CADASTRO = "P";
    public static final String EM_ANALISE = "EA";
    public static final String DOCUMENTOS_PENDENTES = "DP";
    public static final String COMPLETO = "C";
}
