package br.com.plantaomais.util;

import br.com.plantaomais.entitybean.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

public class PlantaoUtils {

    private static final String APP_DEEP_LINK = "plantaomais://plantaomais";

    public static String generateUrlForPlantao(Plantao plantao, Escala escala, Workplace workplace) {
        return Constants.URL_SYSTEM + "plantao/" + workplace.getId() + "/" + DateUtils.formatDate(plantao.getData(), DateTimeFormatter.ofPattern("yyyy-MM-dd"))
               + "/" + plantao.getId() ;
    }

    public static String generateEscalaHeaderForPlantao(Escala escala, Workplace workplace) {
        return "\uD83D\uDEA8\uD83D\uDEA8\uD83D\uDEA8\uD83D\uDEA8 %0a Escala " + escala.getNomeEscala() + " %0a " +
                "Lote " + workplace.getUnitName() + " %0a  \uD83D\uDEA8\uD83D\uDEA8\uD83D\uDEA8\uD83D\uDEA8  %0a %0a";
    }

    public static String generatePlantaoInfo(Plantao plantao, Escala escala, Workplace workplace, Especialidade especialidade, Boolean available) {
        StringBuilder builder = new StringBuilder();

        builder.append(available ? "\uD83D\uDFE2  " : "\uD83D\uDFE1  ");
        builder.append("️" + DateUtils.formatDate(plantao.getData())  + " das " + DateUtils.formatHour(plantao.getHoraInicio()) +
                " às " + DateUtils.formatHour(plantao.getHoraFim()) + " - " + especialidade.getDescricao() +  "  %0a " +
                generateUrlForPlantao(plantao, escala, workplace) + " %0a %0a ");

        return builder.toString();
    }

    public static String generateInfoForPlantao(PlantaoEspecialidade plantaoEspecialidade, Escala escala, Workplace workplace) {
        return generateEscalaHeaderForPlantao(escala, workplace) + generatePlantaoInfo(plantaoEspecialidade.getPlantao(), escala,
                workplace, plantaoEspecialidade.getEspecialidade(), plantaoEspecialidade.getPlantao().getDisponivel());
    }

    public static String generateInfoForEscala(List<PlantaoEspecialidade> plantaoEspecialidades, Escala escala, Workplace workplace) {
        StringBuilder builder = new StringBuilder();
        builder.append(generateEscalaHeaderForPlantao(escala, workplace));
        builder.append("%0a \uD83D\uDFE2 Plantões disponíveis \uD83D\uDFE2 %0a %0a");
        plantaoEspecialidades.stream().filter(it -> it.getPlantao().getDisponivel())
                        .forEach(it -> {
                            builder.append(generatePlantaoInfo(it.getPlantao(), escala, workplace, it.getEspecialidade(), true));
                        });
        builder.append("%0a %0a \uD83D\uDFE1 Plantões Doação/Em Troca \uD83D\uDFE1");
        plantaoEspecialidades.stream().filter(it -> !it.getPlantao().getDisponivel()).forEach(it -> {
            builder.append(generatePlantaoInfo(it.getPlantao(), escala, workplace, it.getEspecialidade(), false));
        });

        return builder.toString();
    }
}
