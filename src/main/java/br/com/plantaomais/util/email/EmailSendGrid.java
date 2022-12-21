package br.com.plantaomais.util.email;

import java.util.List;

/**
 * Utilizado para nontar os dados do email que é utilizando no Sendgrid
 *
 * @author NextAge
 * @classname EmailSendGrid
 */
public class EmailSendGrid {
    private String emails;
    private String tituloEmail;
    private String html;
    private boolean naoUsarTemplate;
    private List<EmailAnexo> listaAnexo;

    public static class EmailAnexo {
        private byte[] anexo;
        private String nome;

        public EmailAnexo(String nome, byte[] anexo) {
            this.nome = nome;
            this.anexo = anexo;
        }

        public byte[] getAnexo() {
            return anexo;
        }

        public void setAnexo(byte[] anexo) {
            this.anexo = anexo;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }
    }

    /**
     * Construtor da classe
     */
    public EmailSendGrid() {
    }

    /**
     * Construtor da classe
     *
     * @param emails
     * @param tituloEmail
     * @param html
     */
    public EmailSendGrid(String emails, String tituloEmail, String html) {
        this.emails = emails;
        this.tituloEmail = tituloEmail;
        this.html = html;
        this.naoUsarTemplate = false;
    }

    /**
     * Construtor da classe
     *
     * @param emails
     * @param tituloEmail
     * @param html
     * @param listaAnexo
     */
    public EmailSendGrid(String emails, String tituloEmail, String html, List<EmailAnexo> listaAnexo) {
        this.emails = emails;
        this.tituloEmail = tituloEmail;
        this.html = html;
        this.naoUsarTemplate = false;
        this.listaAnexo = listaAnexo;
    }

    /**
     * Construtor da classe
     *
     * @param emails
     * @param tituloEmail
     * @param html
     * @param naoUsarTemplate
     */
    public EmailSendGrid(String emails, String tituloEmail, String html, boolean naoUsarTemplate) {
        this.emails = emails;
        this.tituloEmail = tituloEmail;
        this.html = html;
        this.naoUsarTemplate = naoUsarTemplate;
    }

    public String getEmails() {
        return emails;
    }

    public void setEmails(String emails) {
        this.emails = emails;
    }

    public String getTituloEmail() {
        return tituloEmail;
    }

    public void setTituloEmail(String tituloEmail) {
        this.tituloEmail = tituloEmail;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public boolean getNaoUsarTemplate() {
        return naoUsarTemplate;
    }

    public void setNaoUsarTemplate(boolean naoUsarTemplate) {
        this.naoUsarTemplate = naoUsarTemplate;
    }

    public List<EmailAnexo> getListaAnexo() {
        return listaAnexo;
    }

    public void setListaAnexo(List<EmailAnexo> listaAnexo) {
        this.listaAnexo = listaAnexo;
    }

    public boolean isNaoUsarTemplate() {
        return naoUsarTemplate;
    }
}
