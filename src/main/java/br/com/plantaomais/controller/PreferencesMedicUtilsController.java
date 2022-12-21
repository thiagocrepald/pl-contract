package br.com.plantaomais.controller;

import br.com.plantaomais.entitybean.State;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.PreferencesItemVo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class PreferencesMedicUtilsController {

    public List<PreferencesItemVo> getWeekdaysOptions() {

        PreferencesItemVo monday = new PreferencesItemVo();
        monday.setValue("monday");
        monday.setLabel(Constants.SEGUNDA_LABEL);

        PreferencesItemVo tuesday = new PreferencesItemVo();
        tuesday.setValue("tuesday");
        tuesday.setLabel(Constants.TERCA_LABEL);

        PreferencesItemVo wednesday = new PreferencesItemVo();
        wednesday.setValue("wednesday");
        wednesday.setLabel(Constants.QUARTA_LABEL);

        PreferencesItemVo thursday = new PreferencesItemVo();
        thursday.setValue("thursday");
        thursday.setLabel(Constants.QUINTA_LABEL);

        PreferencesItemVo friday = new PreferencesItemVo();
        friday.setValue("friday");
        friday.setLabel(Constants.SEXTA_LABEL);

        PreferencesItemVo saturday = new PreferencesItemVo();
        saturday.setValue("saturday");
        saturday.setLabel(Constants.SABADO_LABEL);

        PreferencesItemVo sunday = new PreferencesItemVo();
        sunday.setValue("sunday");
        sunday.setLabel(Constants.DOMINGO_LABEL);

        return Arrays.asList(
                sunday,
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday
        );
    }

    public List<PreferencesItemVo> getSetorOptions() {

        List<String> setores = Arrays.asList(
                Constants.SETOR_CONSULTORIO,
                Constants.SETOR_EMERGENCIA,
                Constants.SETOR_OBSERVACAO,
                Constants.SETOR_PEDIATRIA);

        List<PreferencesItemVo> items = new ArrayList<>();

        for (String setor : setores) {

            String label = Constants.mapSetorLabels.get(setor);

            PreferencesItemVo item = new PreferencesItemVo();
            item.setValue(setor);
            item.setLabel(label);

            items.add(item);
        }

        return items;
    }

    public List<PreferencesItemVo> getPeriodoOptions() {

        List<String> periodos = Arrays.asList(Constants.MANHA,
                Constants.TARDE,
                Constants.NOITE,
                Constants.CINDERELA);

        List<PreferencesItemVo> items = new ArrayList<>();

        for (String periodo : periodos) {

            String label = Constants.mapPeriodoLabel.get(periodo);

            PreferencesItemVo item = new PreferencesItemVo();
            item.setValue(periodo);
            item.setLabel(label);

            items.add(item);
        }

        return items;
    }


    public List<PreferencesItemVo> getLocalityOptions() throws Exception {

        List<PreferencesItemVo> options = new ArrayList<>();

        List<State> states = new StateController().findAll();

        for (State state : states) {

            for (Map.Entry<String, String> entry : Constants.mapLocalityLabels.entrySet()) {

                String locality = entry.getKey();

                if (!state.getCoastal() && locality.equals(Constants.LOCAL_COASTAL)) {
                    continue;
                }

                String value = state.getAcronym() + "-" +locality;
                String label = state.getName() + " - " + entry.getValue();

                PreferencesItemVo item = new PreferencesItemVo();

                item.setValue(value);
                item.setLabel(label);

                options.add(item);
            }
        }

        return options;
    }

}
