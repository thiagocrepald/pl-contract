package br.com.plantaomais.vo;

public class MedicoExportarLocalityVo {

    public static final String ID = "id";
    public static final String NOME = "nome";
    public static final String ACRE = "acre";
    public static final String ALAGOAS = "alagoas";
    public static final String AMAZONAS = "amazonas";
    public static final String AMAPA = "amapa";
    public static final String BAHIA = "bahia";
    public static final String CEARA = "ceara";
    public static final String DISTRITO_FEDERAL = "distritoFederal";
    public static final String ESPIRITO_SANTO = "espiritoSanto";
    public static final String GOIAS = "goias";
    public static final String MARANHAO = "maranhao";
    public static final String MINAS_GERAIS = "minasGerais";
    public static final String MATO_GROSSO_DO_SUL = "matoGrossoDoSul";
    public static final String MATO_GROSSO = "matoGrosso";
    public static final String PARA = "para";
    public static final String PARAIBA = "paraiba";
    public static final String PERNAMBUCO = "pernambuco";
    public static final String PIAUI = "piaui";
    public static final String PARANA = "parana";
    public static final String RIO_DE_JANEIRO = "rioDeJaneiro";
    public static final String RIO_GRANDE_DO_NORTE = "rioGrandeDoNorte";
    public static final String RONDONIA = "rondonia";
    public static final String RORAIMA = "roraima";
    public static final String RIO_GRANDE_DO_SUL = "rioGrandeDoSul";
    public static final String SANTA_CATARINA = "santaCatarina";
    public static final String SERGIPE = "sergipe";
    public static final String SAO_PAULO = "saoPaulo";
    public static final String TOCANTINS = "tocantins";

    private String id = "";
    private String nome = "";
    private String acre = "";
    private String alagoas = "";
    private String amazonas = "";
    private String amapa = "";
    private String bahia = "";
    private String ceara = "";
    private String distritoFederal = "";
    private String espiritoSanto = "";
    private String goias = "";
    private String maranhao = "";
    private String minasGerais = "";
    private String matoGrossoDoSul = "";
    private String matoGrosso = "";
    private String para = "";
    private String paraiba = "";
    private String pernambuco = "";
    private String piaui = "";
    private String parana = "";
    private String rioDeJaneiro = "";
    private String rioGrandeDoNorte = "";
    private String rondonia = "";
    private String roraima = "";
    private String rioGrandeDoSul = "";
    private String santaCatarina = "";
    private String sergipe = "";
    private String saoPaulo = "";
    private String tocantins = "";

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

    public static String getBean(String acronym) {
        switch (acronym) {
            case "AC": return ACRE;
            case "AL": return ALAGOAS;
            case "AM": return AMAZONAS;
            case "AP": return AMAPA;
            case "BA": return BAHIA;
            case "CE": return CEARA;
            case "DF": return DISTRITO_FEDERAL;
            case "ES": return ESPIRITO_SANTO;
            case "GO": return GOIAS;
            case "MA": return MARANHAO;
            case "MG": return MINAS_GERAIS;
            case "MS": return MATO_GROSSO_DO_SUL;
            case "MT": return MATO_GROSSO;
            case "PA": return PARA;
            case "PB": return PARAIBA;
            case "PE": return PERNAMBUCO;
            case "PI": return PIAUI;
            case "PR": return PARANA;
            case "RJ": return RIO_DE_JANEIRO;
            case "RN": return RIO_GRANDE_DO_NORTE;
            case "RO": return RONDONIA;
            case "RR": return RORAIMA;
            case "RS": return RIO_GRANDE_DO_SUL;
            case "SC": return SANTA_CATARINA;
            case "SE": return SERGIPE;
            case "SP": return SAO_PAULO;
            case "TO": return TOCANTINS;
        }
        return  null;
    }

    public void setValue(String acronym, String value) {
        switch(acronym) {
            case ACRE:
            case "AC":
                this.acre = value;
                break;
            case ALAGOAS:
            case "AL":
                this.alagoas = value;
                break;
            case AMAZONAS:
            case "AM":
                this.amazonas = value;
                break;
            case AMAPA:
            case "AP":
                this.amapa = value;
                break;
            case BAHIA:
            case "BA":
                this.bahia = value;
                break;
            case CEARA:
            case "CE":
                this.ceara = value;
                break;
            case DISTRITO_FEDERAL:
            case "DF":
                this.distritoFederal = value;
                break;
            case ESPIRITO_SANTO:
            case "ES":
                this.espiritoSanto = value;
                break;
            case GOIAS:
            case "GO":
                this.goias = value;
                break;
            case MARANHAO:
            case "MA":
                this.maranhao = value;
                break;
            case MINAS_GERAIS:
            case "MG":
                this.minasGerais = value;
                break;
            case MATO_GROSSO_DO_SUL:
            case "MS":
                this.matoGrossoDoSul = value;
                break;
            case MATO_GROSSO:
            case "MT":
                this.matoGrosso = value;
                break;
            case PARA:
            case "PA":
                this.para = value;
                break;
            case PARAIBA:
            case "PB":
                this.paraiba = value;
                break;
            case PERNAMBUCO:
            case "PE":
                this.pernambuco = value;
                break;
            case PIAUI:
            case "PI":
                this.piaui = value;
                break;
            case PARANA:
            case "PR":
                this.parana = value;
                break;
            case RIO_DE_JANEIRO:
            case "RJ":
                this.rioDeJaneiro = value;
                break;
            case RIO_GRANDE_DO_NORTE:
            case "RN":
                this.rioGrandeDoNorte = value;
                break;
            case RONDONIA:
            case "RO":
                this.rondonia = value;
                break;
            case RORAIMA:
            case "RR":
                this.roraima = value;
                break;
            case RIO_GRANDE_DO_SUL:
            case "RS":
                this.rioGrandeDoSul = value;
                break;
            case SANTA_CATARINA:
            case "SC":
                this.santaCatarina = value;
                break;
            case SERGIPE:
            case "SE":
                this.sergipe = value;
                break;
            case SAO_PAULO:
            case "SP":
                this.saoPaulo = value;
                break;
            case TOCANTINS:
            case "TO":
                this.tocantins = value;
                break;
        }
    }

    public String getAcre() {
        return acre;
    }

    public void setAcre(String acre) {
        this.acre = acre;
    }

    public String getAlagoas() {
        return alagoas;
    }

    public void setAlagoas(String alagoas) {
        this.alagoas = alagoas;
    }

    public String getAmazonas() {
        return amazonas;
    }

    public void setAmazonas(String amazonas) {
        this.amazonas = amazonas;
    }

    public String getAmapa() {
        return amapa;
    }

    public void setAmapa(String amapa) {
        this.amapa = amapa;
    }

    public String getBahia() {
        return bahia;
    }

    public void setBahia(String bahia) {
        this.bahia = bahia;
    }

    public String getCeara() {
        return ceara;
    }

    public void setCeara(String ceara) {
        this.ceara = ceara;
    }

    public String getDistritoFederal() {
        return distritoFederal;
    }

    public void setDistritoFederal(String distritoFederal) {
        this.distritoFederal = distritoFederal;
    }

    public String getEspiritoSanto() {
        return espiritoSanto;
    }

    public void setEspiritoSanto(String espiritoSanto) {
        this.espiritoSanto = espiritoSanto;
    }

    public String getGoias() {
        return goias;
    }

    public void setGoias(String goias) {
        this.goias = goias;
    }

    public String getMaranhao() {
        return maranhao;
    }

    public void setMaranhao(String maranhao) {
        this.maranhao = maranhao;
    }

    public String getMinasGerais() {
        return minasGerais;
    }

    public void setMinasGerais(String minasGerais) {
        this.minasGerais = minasGerais;
    }

    public String getMatoGrossoDoSul() {
        return matoGrossoDoSul;
    }

    public void setMatoGrossoDoSul(String matoGrossoDoSul) {
        this.matoGrossoDoSul = matoGrossoDoSul;
    }

    public String getMatoGrosso() {
        return matoGrosso;
    }

    public void setMatoGrosso(String matoGrosso) {
        this.matoGrosso = matoGrosso;
    }

    public String getPara() {
        return para;
    }

    public void setPara(String para) {
        this.para = para;
    }

    public String getParaiba() {
        return paraiba;
    }

    public void setParaiba(String paraiba) {
        this.paraiba = paraiba;
    }

    public String getPernambuco() {
        return pernambuco;
    }

    public void setPernambuco(String pernambuco) {
        this.pernambuco = pernambuco;
    }

    public String getPiaui() {
        return piaui;
    }

    public void setPiaui(String piaui) {
        this.piaui = piaui;
    }

    public String getParana() {
        return parana;
    }

    public void setParana(String parana) {
        this.parana = parana;
    }

    public String getRioDeJaneiro() {
        return rioDeJaneiro;
    }

    public void setRioDeJaneiro(String rioDeJaneiro) {
        this.rioDeJaneiro = rioDeJaneiro;
    }

    public String getRioGrandeDoNorte() {
        return rioGrandeDoNorte;
    }

    public void setRioGrandeDoNorte(String rioGrandeDoNorte) {
        this.rioGrandeDoNorte = rioGrandeDoNorte;
    }

    public String getRondonia() {
        return rondonia;
    }

    public void setRondonia(String rondonia) {
        this.rondonia = rondonia;
    }

    public String getRoraima() {
        return roraima;
    }

    public void setRoraima(String roraima) {
        this.roraima = roraima;
    }

    public String getRioGrandeDoSul() {
        return rioGrandeDoSul;
    }

    public void setRioGrandeDoSul(String rioGrandeDoSul) {
        this.rioGrandeDoSul = rioGrandeDoSul;
    }

    public String getSantaCatarina() {
        return santaCatarina;
    }

    public void setSantaCatarina(String santaCatarina) {
        this.santaCatarina = santaCatarina;
    }

    public String getSergipe() {
        return sergipe;
    }

    public void setSergipe(String sergipe) {
        this.sergipe = sergipe;
    }

    public String getSaoPaulo() {
        return saoPaulo;
    }

    public void setSaoPaulo(String saoPaulo) {
        this.saoPaulo = saoPaulo;
    }

    public String getTocantins() {
        return tocantins;
    }

    public void setTocantins(String tocantins) {
        this.tocantins = tocantins;
    }
}
