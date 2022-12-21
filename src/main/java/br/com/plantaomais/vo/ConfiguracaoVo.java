package br.com.plantaomais.vo;

/**
 * Created by nextage on 17/06/2019.
 */
public class ConfiguracaoVo {
    private Integer id;
    private UsuarioVo usuario;
    private TipoConfiguracaoVo tipoConfiguracao;

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

    public TipoConfiguracaoVo getTipoConfiguracao() {
        return tipoConfiguracao;
    }

    public void setTipoConfiguracao(TipoConfiguracaoVo tipoConfiguracao) {
        this.tipoConfiguracao = tipoConfiguracao;
    }
}
