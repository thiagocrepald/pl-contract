package br.com.plantaomais.entitybean;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 * Created by nextage on 09/05/2019.
 */
@Entity
@Table(name = "TIPO_PERMISSAO")
public class TipoPermissao {
    private static final long serialVersionUID = 1L;

    // Constantes com os nomes da classe
    public static final String ALIAS_CLASSE = "tipoPermissao";

    public static final String ID = "id";
    public static final String DESCRICAO = "descricao";

    public enum Tipos {
        CadastrarContratos(1, "Contratos - Cadastrar/editar/excluir"),
        Contratantes(2, "Contratantes - Cadastrar/editar/excluir"),
        CadastrarEscalas(3, "Cadastro Escalas - Cadastrar/editar/excluir"),
        ExportarPublicarEscalas(4, "Gestão Escalas - Exportar/Publicar escalas"),
        DivulgarPlataoEscalas(5, "Gestão Escalas - Divulgar Plantões Disponíveis"),
        AceitarRecusarCandidaturas(6, "Plantões/app - Aceitar ou recusar Candidaturas, trocas e doações"),
        FechamentosExportar(7, "Fechamentos - Exportar"),
        IndicadoresFiltrarExportar(8, "Indicadores - Filtrar/Exportar"),
        AprovarEditarExcluirDocumentosMedicos(9, "Cadastros Médicos --> Aprovar documentos enviados pelos médicos, solicitar atualização ao médico, editar e excluir cadastros existentes"),
        CadastrarEditarUsuarios(10, "Cadastrar/editar usuários"),
        CriarAlterarExcluirDocumentosAdicionais(12, "Criar, alterar, excluir documentos adicionais"),
        CriarAlterarExcluirEventos(13, "Criar, alterar, excluir eventos");

        private int id;
        private String descricao;

        Tipos(int id) {
            valueOfCodigo(id);
        }

        Tipos(int id, String descricao) {
            this.id = id;
            this.descricao = descricao;
        }

        public static Tipos valueOfCodigo(final int codigo) {
            for (final Tipos statusRetorno : Tipos.values()) {
                if (statusRetorno.getId() == codigo) {
                    return statusRetorno;
                }
            }
            throw new IllegalArgumentException(String.format("Tipo de permissão n\u00e3o mapeado", codigo));
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getDescricao() {
            return descricao;
        }

        public void setDescricao(String descricao) {
            this.descricao = descricao;
        }
    }

    @Id
    @Basic(optional = false)
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ")
    @SequenceGenerator(name = "SEQ", sequenceName = "GEN_TIPO_PERMISSAO_ID", allocationSize = 1)
    private Integer id;

    @Column(name = "DESCRICAO")
    private String descricao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}