package br.com.plantaomais.util;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.plantaomais.entitybean.Auditoria;
import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.vo.UsuarioAuditoriaVo;
import com.google.gson.Gson;
import org.hibernate.property.Getter;
import org.hibernate.property.Setter;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AuditoriaUtil {

    /**
     * Adiciona os valores de auditoria para inclusão da entidade
     *
     * @param obj     Object
     * @param usuario Object
     */
    public static void inclusao(Object obj, Usuario usuario) throws Exception {

        String user = "Usuário Anônimo";
        if (usuario != null) {
            user = gerarUsuarioAuditoria(usuario);
        }

        Date now = new Date();

        Setter setter = Util.getSetter(obj, Auditoria.DATA_USUARIO_INC);
        setter.set(obj, now, null);
        setter = Util.getSetter(obj, Auditoria.USUARIO_INC);
        setter.set(obj, user, null);

        setter = Util.getSetter(obj, Auditoria.DATA_USUARIO_ALT);
        setter.set(obj, now, null);
        setter = Util.getSetter(obj, Auditoria.USUARIO_ALT);
        setter.set(obj, user, null);

        Getter getter = Util.getGetter(obj, Auditoria.EXCLUIDO);
        Object isExcluido = getter.get(obj);
        if (isExcluido == null) {
            setter = Util.getSetter(obj, Auditoria.EXCLUIDO);
            setter.set(obj, Constants.EXCLUIDO_NAO, null);
        }
    }



    public static void alteracao(Object obj) throws Exception {
        alteracao(obj , null);
    }

    /**
     * Adiciona os valores de auditoria para alteração da entidade
     *
     * @param obj     Object
     * @param usuario Object
     */
    public static void alteracao(Object obj, Usuario usuario) throws Exception {

        String user = "Usuário Anônimo";
        if (usuario != null) {
            user = gerarUsuarioAuditoria(usuario);
        }

        Date now = new Date();
        Setter setter = Util.getSetter(obj, Auditoria.DATA_USUARIO_ALT);
        setter.set(obj, now, null);

        setter = Util.getSetter(obj, Auditoria.USUARIO_ALT);
        setter.set(obj, user, null);
    }

    /**
     * Adiciona os valores de auditoria para exclusão da entidade
     *
     * @param obj     Object
     * @param usuario Object
     */
    public static void exclusao(Object obj, Usuario usuario) throws Exception {

        String user = "Usuário Anônimo";
        if (usuario != null) {
            user = gerarUsuarioAuditoria(usuario);
        }

        Date now = new Date();

        Setter setter = Util.getSetter(obj, Auditoria.DATA_USUARIO_DEL);
        setter.set(obj, now, null);
        setter = Util.getSetter(obj, Auditoria.USUARIO_DEL);
        setter.set(obj, user, null);
        setter = Util.getSetter(obj, Auditoria.EXCLUIDO);
        setter.set(obj, true, null);
    }


    public static List<Propriedade> getCampos() {
        return getCampos(null, null, null);
    }

    public static List<Propriedade> getCampos(String aliasRealClasse, Class classe, String alias) {
        List<Propriedade> lista = new ArrayList<>();
        lista.add(new Propriedade(aliasRealClasse, Auditoria.DATA_USUARIO_ALT, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.DATA_USUARIO_DEL, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.DATA_USUARIO_INC, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.EXCLUIDO, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.USUARIO_ALT, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.USUARIO_DEL, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.USUARIO_INC, classe, alias));
        return lista;
    }

    public static List<Propriedade> getCamposInclusao() {
        return getCamposInclusao(null, null, null);
    }

    public static List<Propriedade> getCamposAlteracao() {
        return getCamposAlteracao(null, null, null);
    }

    public static List<Propriedade> getCamposExclusao() {
        return getCamposExclusao(null, null, null);
    }

    public static List<Propriedade> getCamposInclusao(String aliasRealClasse, Class classe, String alias) {
        List<Propriedade> lista = new ArrayList<>();
        lista.add(new Propriedade(aliasRealClasse, Auditoria.DATA_USUARIO_ALT, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.DATA_USUARIO_INC, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.USUARIO_ALT, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.USUARIO_INC, classe, alias));
        return lista;
    }

    public static List<Propriedade> getCamposAlteracao(String aliasRealClasse, Class classe, String alias) {
        List<Propriedade> lista = new ArrayList<>();
        lista.add(new Propriedade(aliasRealClasse, Auditoria.DATA_USUARIO_ALT, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.USUARIO_ALT, classe, alias));
        return lista;
    }

    public static List<Propriedade> getCamposExclusao(String aliasRealClasse, Class classe, String alias) {
        List<Propriedade> lista = new ArrayList<Propriedade>();
        lista.add(new Propriedade(aliasRealClasse, Auditoria.DATA_USUARIO_DEL, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.EXCLUIDO, classe, alias));
        lista.add(new Propriedade(aliasRealClasse, Auditoria.USUARIO_DEL, classe, alias));
        return lista;
    }

    public static NxCriterion criterionAtivo() {
        return criterionAtivo(null);
    }

    public static NxCriterion criterionAtivo(String alias) {
        return NxCriterion.and(
                NxCriterion.montaRestriction(new Filtro(Auditoria.EXCLUIDO, Constants.EXCLUIDO_NAO, Filtro.EQUAL, alias)),
                NxCriterion.montaRestriction(new Filtro(Auditoria.DATA_USUARIO_DEL, null, Filtro.IS_NULL, alias)));
    }

    public static String gerarUsuarioAuditoria(Usuario usuario) {
        String usuarioAuditoriaJson = null;
        Gson gson = new Gson();

        UsuarioAuditoriaVo usuarioAuditoriaVo = new UsuarioAuditoriaVo();
        usuarioAuditoriaVo.setId(usuario.getId());
        usuarioAuditoriaVo.setLogin(usuario.getLogin());
        usuarioAuditoriaVo.setNomeUsuario(usuario.getNome());
        usuarioAuditoriaJson = gson.toJson(usuarioAuditoriaVo);

        return Normalizer.normalize(usuarioAuditoriaJson, Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }
}
