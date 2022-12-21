package br.com.plantaomais.vo;

public class MedicoExportarEspecialidadeVo {

    public static final String ID = "id";
    public static final String NOME = "nome";
    public static final String ESPECIALIDADE = "especialidade";

    private String id;
    private String nome;
    private String especialidade;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }
}
