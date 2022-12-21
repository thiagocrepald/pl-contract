package br.com.plantaomais.vo;

import br.com.plantaomais.entitybean.Installation;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import java.io.Serializable;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by nextage on 04/06/2019.
 */
@Getter
@Setter
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString
public class MedicoVo extends AuditoriaVo implements Serializable, Principal {
    private static final long serialVersionUID = 1L;

    @EqualsAndHashCode.Include
    private Integer id;
    private String nome;
    private String email;
    private String senha;
    private String telefone;
    private String ufConselhoMedico;
    private String sexo;
    private AttachmentVo attachment;
    private String anexoFoto;
    private String nomeAnexoFoto;
    private String tamanhoAnexoFoto;
    private String tipoAnexoFoto;
    private String tokenPushNotification;
    private Installation installation;
    private String versaoLogin;
    private Date dataUltimoLogin;

    private Date birthDate;

    private String tipoRecebimento;
    private Boolean ehContaEmpresa;
    private String banco;
    private String agencia;
    private String operacao;
    private String conta;
    private String cpf;
    private String cnpj;
    private String nomeTitular;
    private String numeroPis;
    private String status;

    private Boolean validado;
    private String observacoesValidacao;
    private List<BloqueioMedicoEscalaVo> listaBloqueioMedicoEscala;

    private List<EspecialidadeVo> listaEspecialidadeSelecionado;
    private List<MedicoEspecialidadeVo> listaMedicoEspecialidade;
    private String especialidadesStr;
    private String token;
    private Date dataExpiracaoToken;
    private Date dataAlteracaoSenha;
    private Integer minutosAtualizarToken;

    private List<ConfiguracaoVo> listaConfiguracao;
    private List<TipoConfiguracaoVo> listaTipoConfiguracao;

    private List<AnexoCampoCadastroMedicoVo> listAnexoCampoCadrastroMedico;
    private List<TodosAnexosMedicoVo> listTodosAnexosMedicoVo;

    private List<MedicoAnexoVo> listaMedicoAnexo;

    private Boolean cadastroCompleto;
    private Boolean salvoNoBanco;

    //Usado na tela de indicadores
    private Double porcentagemPlantoes;

    private Boolean emailValidado;
    private String numeroCrm;
    private String numeroCrmAdicional;
    private String ufConselhoMedicoAdicional;
    private Date crmIssueDate;

    private Boolean ativo;

    private AddressVo address;

    private Integer medicoAcesso;

    private PreferencesMedicVo preferencesMedic;
    private String pontuacao;
    private Date crmAdicionalIssueDate;

    private List<MedicoCursoVo> listaMedicoCurso;
    private List<PaymentDataVo> paymentsData;
    private CameToUsVo cameToUs;
    private String resetKey;

    private String publicKey;
    private String signature;


    @Override
    public String getName() {
        return nome;
    }
}
