package br.com.plantaomais.util.builder;

import br.com.nextage.persistence_2.classes.Propriedade;
import com.google.gson.internal.Streams;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PropriedadeListBuilder {
    List<Propriedade> propriedades = new ArrayList<>();

    public PropriedadeListBuilder propriedade(String propriedade) {
        this.propriedades.add(new Propriedade(propriedade));
        return this;
    }

    public PropriedadeListBuilder propriedades(String... propriedades) {
        for(String props : propriedades){
            this.propriedades.add(new Propriedade(props));
        }

        return this;
    }

    public PropriedadeListBuilder propriedades(List<String> propriedades) {

        this.propriedades.addAll(propriedades.stream()
                .map(Propriedade::new)
                .collect(Collectors.toList()));

        return this;
    }

    public List<Propriedade> build() {
        return propriedades;
    }
}
