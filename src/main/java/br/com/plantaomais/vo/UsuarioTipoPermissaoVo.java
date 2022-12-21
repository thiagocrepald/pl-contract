package br.com.plantaomais.vo;


/**
 * Created by nextage on 09/05/2019.
 */
public class UsuarioTipoPermissaoVo  {
    private Integer id;
    private TipoPermissaoVo tipoPermissao;
    private UsuarioVo usuario;

    public TipoPermissaoVo getTipoPermissao() {
        return tipoPermissao;
    }

    public void setTipoPermissao(TipoPermissaoVo tipoPermissao) {
        this.tipoPermissao = tipoPermissao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public UsuarioVo getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioVo usuario) {
        this.usuario = usuario;
    }
}
