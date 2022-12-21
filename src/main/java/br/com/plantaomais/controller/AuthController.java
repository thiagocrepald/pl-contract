package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.nextage.persistence_2.util.HibernateUtil;
import br.com.nextage.util.Constantes;
import br.com.plantaomais.entitybean.*;
import br.com.plantaomais.entitybean.enums.AttachmentType;
import br.com.plantaomais.mapper.*;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.util.builder.PropriedadeListBuilder;
import br.com.plantaomais.util.criptografia.Criptografia;
import br.com.plantaomais.util.email.EmailSendGrid;
import br.com.plantaomais.util.email.SendGridUtil;
import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.MedicoAnexoVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.UsuarioVo;
import com.google.gson.Gson;
import org.hibernate.Session;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.logging.Level;
import java.util.logging.Logger;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;
import static br.com.plantaomais.util.RandomUtil.generateResetKey;

/**
 * @author Matheus Toledo on 04/05/2019
 */
public class AuthController {
    private static final Logger logger = Logger.getLogger(AuthController.class.getName());
    private UsuarioVo usuario;
    private MedicoVo usuarioApp;

    public static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    public AuthController() {

    }

    public AuthController(UsuarioVo usuario) {
        this.usuario = usuario;
    }

    public AuthController(MedicoVo usuarioApp) {
        this.usuarioApp = usuarioApp;
    }


    public Info login(UsuarioVo vo) {
        Info info;

        logger.info("URL: " + HibernateUtil.getConfiguration().getProperty("hibernate.connection.url"));
        logger.info("URL system: " + System.getProperty("hibernate.connection.url"));

        try {

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Usuario.ID));
            propriedades.add(new Propriedade(Usuario.NOME));
            propriedades.add(new Propriedade(Usuario.DATA_EXPIRACAO_TOKEN));
            propriedades.add(new Propriedade(Usuario.DATA_ALTERACAO_SENHA));
            propriedades.add(new Propriedade(Usuario.SENHA));
            propriedades.add(new Propriedade(Usuario.LOGIN));
            propriedades.add(new Propriedade(Usuario.REQUISITADO_NOVA_SENHA));
            propriedades.add(new Propriedade(Usuario.EXCLUIDO));
            propriedades.add(new Propriedade(Usuario.TOKEN));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Usuario.LOGIN, vo.getLogin(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, false, Filtro.EQUAL)));
            GenericDao<Usuario> dao = new GenericDao();

            Usuario usuario = dao.selectUnique(propriedades, Usuario.class, nxCriterion);

            if (usuario == null) {
                logger.info("User not found " + vo.getLogin());
            }

            if (!PASSWORD_ENCODER.matches(vo.getSenha(), usuario.getSenha()) && !Criptografia.criptMD5(vo.getSenha()).equals(usuario.getSenha())) {
                throw new Exception("Auth error");
            }

            if (usuario.getId() > 0) {


                propriedades = new ArrayList<>();
                GenericDao<UsuarioTipoPermissao> genericDao = new GenericDao<>();
                propriedades.add(new Propriedade(UsuarioTipoPermissao.ID));
                propriedades.add(new Propriedade(UsuarioTipoPermissao.USUARIO));
                propriedades.add(new Propriedade(UsuarioTipoPermissao.TIPO_PERMISSAO));

                nxCriterion = NxCriterion.montaRestriction(new Filtro(UsuarioTipoPermissao.USUARIO, usuario, Filtro.EQUAL));

                List<UsuarioTipoPermissao> list = genericDao.listarByFilter(propriedades, null, UsuarioTipoPermissao.class, -1, nxCriterion);


                vo = UsuarioMapper.convertToVo(usuario);
                vo.setToken(null);
                usuario.setToken(Util.generateTokenUser(vo));
                usuario.setDataExpiracaoToken(vo.getDataExpiracaoToken());
                int minutosAtualizarToken = vo.getMinutosAtualizarToken();
                vo = UsuarioMapper.convertToVo(usuario);
                vo.setMinutosAtualizarToken(minutosAtualizarToken);

                propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Usuario.TOKEN));
                propriedades.add(new Propriedade(Usuario.DATA_EXPIRACAO_TOKEN));
                dao.update(usuario, propriedades);
                vo.setSenha(null);

                vo.setListaUsuarioTipoPermissao(UsuarioTipoPermissaoMapper.convertToListVo(list));
                info = Info.GetSuccess(vo);
                return info;
            }
            return Info.GetError("Login ou senha inválidos");

        } catch (Exception e) {
            e.printStackTrace();
            return Info.GetError(Constantes.ERRO_OPERACAO_I18N);
        }
    }

    public Info loginApp(MedicoVo vo, Boolean isBiometry) {
        Info info;
        try {
            String versao = vo.getVersaoLogin();

            List<Propriedade> propriedades = new PropriedadeListBuilder()
                    .propriedade(Medico.ID)
                    .propriedade(Medico.NOME)
                    .propriedade(Medico.DATA_EXPIRACAO_TOKEN)
                    .propriedade(Medico.DATA_ALTERACAO_SENHA)
                    .propriedade(Medico.EMAIL)
                    .propriedade(Medico.SENHA)
                    .propriedade(Medico.EXCLUIDO)
                    .propriedade(Medico.TOKEN)
                    .propriedade(Medico.ANEXO_FOTO)
                    .propriedade(Medico.EMAIL_VALIDADO)
                    .propriedade(Medico.MEDICO_ACESSO)
                    .propriedade(Medico.CADASTRO_COMPLETO)
                    .propriedade(Medico.TOKEN_PUSH_NOTIFICATION)
                    .propriedade(Medico.ATIVO)
                    .propriedade(Medico.PUBLIC_KEY)
                    .propriedade(Medico.SIGNATURE)
                    .build();


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.EMAIL, vo.getEmail(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, null, Filtro.IS_NULL)),
                            NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL))));

            GenericDao<Medico> dao = new GenericDao<>();

            Medico medico = dao.selectUnique(propriedades, Medico.class, nxCriterion);

            if (medico == null) {
                throw new Exception("Auth error");
            }
            if (!isBiometry) {
                if (!PASSWORD_ENCODER.matches(vo.getSenha(), medico.getSenha()) && !Criptografia.criptMD5(vo.getSenha()).equals(medico.getSenha())) {
                    throw new Exception("Auth error");
                }
            } else {
                if (medico.getSignature() == null) {
                    return Info.GetError("Não há biometria cadastrada para o usuário", vo);
                }
                if (!medico.getSignature().equals(vo.getSignature())) {
                    return Info.GetError("Houve um problema, por favor recadastre sua biometria", vo);
                }
            }

            if (medico != null && medico.getId() > 0) {
                if (medico.getEmailValidado() == null || !medico.getEmailValidado()) {
                    vo.setEmailValidado(false);
                    return Info.GetError("Para usar o aplicativo é necessário confirmar seu cadastro acessando o e-mail que lhe enviamos.", vo);
                }
                if (medico.getAtivo() == null || !medico.getAtivo()) {
                    vo.setAtivo(false);
                    return Info.GetError("Conta inativa.", vo);
                }
                String tokenPuh = null;
                if (!Util.isNullOrEmpty(vo.getTokenPushNotification())) {
                    tokenPuh = vo.getTokenPushNotification();
                }
                Installation newInstallation = vo.getInstallation();
                vo = MedicoMapper.convertToVo(medico);
                vo.setToken(null);
                vo.setAnexoFoto(null);
                medico.setToken(Util.generateTokenUserApp(vo));
                medico.setDataExpiracaoToken(vo.getDataExpiracaoToken());
                medico.setDataUltimoLogin(new Date());
                medico.setVersaoLogin(versao);
                int minutosAtualizarToken = vo.getMinutosAtualizarToken();
                vo = MedicoMapper.convertToVo(medico);
                vo.setMinutosAtualizarToken(minutosAtualizarToken);
                vo.setDataUltimoLogin(null);
                propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Medico.TOKEN));
                propriedades.add(new Propriedade(Medico.DATA_EXPIRACAO_TOKEN));
                propriedades.add(new Propriedade(Medico.DATA_ULTIMO_LOGIN));
                propriedades.add(new Propriedade(Medico.VERSAO_LOGIN));
                propriedades.add(new Propriedade(Medico.MEDICO_ACESSO));

                if (!Util.isNullOrEmpty(tokenPuh)) {
                    propriedades.add(new Propriedade(Medico.TOKEN_PUSH_NOTIFICATION));
                    medico.setTokenPushNotification(tokenPuh);
                }

                if (newInstallation != null) {
                    Installation installation = new Installation();
                    installation.setAlias(newInstallation.getAlias());
                    installation.setDeviceToken(newInstallation.getDeviceToken());
                    installation.setDeviceType(newInstallation.getDeviceType());
                    installation.setPlatform(newInstallation.getPlatform());
                    installation.setOsVersion(newInstallation.getOsVersion());
                    installation.setMedico(medico);
                    Session session = dao.getCurrentSession();
                    session.saveOrUpdate(installation);
                }

                int acessoCount = medico.getMedicoAcesso() != null ? medico.getMedicoAcesso() : 0;

                medico.setMedicoAcesso(acessoCount + 1);
                vo.setMedicoAcesso(medico.getMedicoAcesso());
                dao.update(medico, propriedades);
                vo.setSenha(null);
                vo.setToken(medico.getToken());
                info = Info.GetSuccess(vo);
                return info;
            }
            return Info.GetError("Login ou senha inválidos");

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
            return Info.GetError("Erro ao efetuar login");
        }
    }

    public Info salvarPreCadastro(MedicoVo vo) {
        Info info;
        GenericDao genericDao = new GenericDao();
        List<Integer> attachments = new ArrayList<>();
        try {
            if (vo == null) {
                return Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            }

            Medico medico = MedicoMapper.convertToEntity(vo);
            genericDao.beginTransaction();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.EMAIL));
            propriedades.add(new Propriedade(Medico.SENHA));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.EMAIL, medico.getEmail(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion,
                    NxCriterion.or(NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, null, Filtro.IS_NULL)),
                            NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL))));
            Medico medicoUnique = (Medico) genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            if (medicoUnique != null) {
                return Info.GetError("E-mail já cadastrado");
            }

            medico.setEmailValidado(false);
            medico.setSenha(PASSWORD_ENCODER.encode(medico.getSenha()));
            AuditoriaUtil.inclusao(medico, null);
            medico.setAtivo(true);
            medico.setMedicoAcesso(0);
            medico.setStatus(Constants.PRE_CADASTRO);
            genericDao.persistWithCurrentTransaction(medico);

            if (vo.getListaEspecialidadeSelecionado() != null && !vo.getListaEspecialidadeSelecionado().isEmpty()) {
                for (EspecialidadeVo especialidadeVo : vo.getListaEspecialidadeSelecionado()) {
                    if (especialidadeVo.getId() != null) {
                        MedicoEspecialidade medicoEspecialidade = new MedicoEspecialidade();
                        medicoEspecialidade.setMedico(medico);
                        medicoEspecialidade.setEspecialidade(EspecialidadeMapper.convertToEntity(especialidadeVo));

                        genericDao.persistWithCurrentTransaction(medicoEspecialidade);
                    }
                }
            }
            if (vo.getListaMedicoAnexo() != null && !vo.getListaMedicoAnexo().isEmpty()) {
                for (MedicoAnexoVo medicoAnexoVo : vo.getListaMedicoAnexo()) {
                    MedicoAnexo medicoAnexo = MedicoAnexoMapper.convertToEntity(medicoAnexoVo);
                    medicoAnexo.setMedico(medico);
                    Attachment attachment = new Attachment();
                    attachment.setContentType(medicoAnexo.getTipoAnexo());
                    attachment.setFile(medicoAnexo.getBase64Anexo());
                    attachment.setFileName(medicoAnexo.getNomeAnexo());
                    attachment.setName(medicoAnexo.getNomeAnexo());
                    attachment.setProcessed(false);
                    attachment.setType(AttachmentType.DOCUMENT);

                    Integer attachmentId = genericDao.persistWithCurrentTransaction(attachment);
                    attachment.setId(attachmentId);
                    attachments.add(attachmentId);

                    medicoAnexo.setAttachment(attachment);
                    medicoAnexo.setBase64Anexo(null);


                    AuditoriaUtil.inclusao(medicoAnexo, null);
                    genericDao.persistWithCurrentTransaction(medicoAnexo);

                }
            }

            try {
                var cameToUs = CameToUsMapper.convertToEntity(vo.getCameToUs());
                // Remover verificação quando web e app implementarem
                if (cameToUs != null) {
                    cameToUs.setMedico(medico);
                    var existing = (CameToUs) getSession().createQuery(
                                    "select ctu from CameToUs ctu " +
                                            "join ctu.medico m " +
                                            "where m.id = :id")
                            .setInteger("id", medico.getId())
                            .uniqueResult();
                    if (existing != null) {
                        cameToUs.setId(existing.getId());
                    }
                    Session session = genericDao.getCurrentSession();
                    session.saveOrUpdate(cameToUs);
                    vo.setCameToUs(CameToUsMapper.convertToVo(cameToUs));
                }
            } catch (Exception e) {
                logger.log(Level.SEVERE, e.toString(), e);
                throw e;
            }

            genericDao.commitCurrentTransaction();

            String conteudoEmailConfirmar = montarMensagemConfirmarEmail(medico);
            enviarEmailConfirmarCadastro(conteudoEmailConfirmar, medico.getEmail());

            String conteudoEmail = montarMensagemEmailCadastro(medico);
            Util.enviaEmail(conteudoEmail, Constants.TIPO_NOTIFICACAO_CADASTRO_APLICATIVO);
            info = Info.GetSuccess("Cadastrado com sucesso!", vo);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            genericDao.rollbackCurrentTransaction();
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
        }

        new AttachmentController().uploadByAttachmentIds(attachments);
        return info;
    }

    /**
     * @param conteudo
     * @param emailTo
     * @throws Exception
     */
    private void enviarEmailConfirmarCadastro(String conteudo, String emailTo) throws Exception {
        String sendgridApiKey = Constants.SENDGRID_API_KEY;
        String sendgridSender = Constants.EMAIL_NOTIFICACOES;

        String tituloEmail = Constants.NOME_SISTEMA + " - Confirmação de cadastro";

        EmailSendGrid email = new EmailSendGrid(emailTo, tituloEmail,
                conteudo, true);
        SendGridUtil.enviar(email);

//        if (response.getCode() != 200) {
//           Info.GetError(response.getMessage(), null);
//        } else {
//           Info.GetSuccess(Constants.SUCESSO);
//        }
    }

    /**
     * @param medicoVo
     * @return
     */
    public Info reenviarEmailConfirmacao(MedicoVo medicoVo) {
        Info info;
        try {

            GenericDao<Medico> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.EMAIL));
            propriedades.add(new Propriedade(Medico.EMAIL_VALIDADO));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.EMAIL, medicoVo.getEmail(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL)));

            Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            if (medico == null) {
                return Info.GetError("Nenhum médico encontrado com este e-mail!");
            }
            String conteudo = montarMensagemConfirmarEmail(medico);
            enviarEmailConfirmarCadastro(conteudo, medico.getEmail());

            info = Info.GetSuccess(Constants.SUCESSO);

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    private String montarMensagemConfirmarEmail(Medico medico) {

        AtomicReference<StringBuffer> mensagemEmail = new AtomicReference<>(new StringBuffer());

        Gson gson = new Gson();
        Medico medicoUrl = new Medico();
        medicoUrl.setId(medico.getId());
        medicoUrl.setEmail(medico.getEmail());

        String jsonMedicoString = gson.toJson(medicoUrl);

        var replacedDoctorJson = jsonMedicoString.replaceAll("\"", "'");

        String hrefToReplace = Constants.URL_SYSTEM + "auth/confirmar-email/" + replacedDoctorJson;

        mensagemEmail.get()
                .append("<table style='width: 100%; max-width: 650px;background: #eeeeee;padding-top: 15px;")
                .append("padding-bottom: 5px;padding-right: 15px;padding-left: 15px;'>");

        mensagemEmail.get()
                .append("<tbody><tr><td style='font-size: 16px;background: #f9f9f9;padding: 15px;color: #444444; ")
                .append("font-family: \"Arial\",\"Helvetica Neue\", Helvetica, sans-serif;'>");

        mensagemEmail.get().append("Prezado,");
        mensagemEmail.get().append("<br><br>");
        mensagemEmail.get().append("Para confirmar seu pré-cadastro clique no link abaixo:: <br>");
        mensagemEmail.get().append("<a href=\"hrefToReplace\">Confirmar cadastro</a><br>");
        mensagemEmail.get().append("<br><br>");
        mensagemEmail.get().append("Após confirmar retorne ao APP para completar seu cadastro anexando seus documentos. <br>");
        mensagemEmail.get().append("<br><br>");
        mensagemEmail.get().append("<br>Mensagem gerada automaticamente.");
        mensagemEmail.get().append("<br><br>");

        mensagemEmail.get().append("Atenciosamente,");
        mensagemEmail.get().append("<br>");

        mensagemEmail.get().append(Constants.NOME_SISTEMA);

        mensagemEmail.get()
                .append("</td></tr><tr><td style='background: #eeeeee;padding:3px; font-family: \"Arial\",\"Helvetica Neue\", Helvetica, sans-serif;'>");

        mensagemEmail.get().append("</td></tr></tbody></table>");

        return mensagemEmail.get().toString().replace("hrefToReplace", hrefToReplace);
    }

    private String montarMensagemEmailCadastro(Medico medico) {

        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String dataCad = sdf.format(now);


        AtomicReference<StringBuffer> mensagemEmail = new AtomicReference<>(new StringBuffer());

        mensagemEmail.get()
                .append("<table style='width: 100%; max-width: 650px;background: #eeeeee;padding-top: 15px;")
                .append("padding-bottom: 5px;padding-right: 15px;padding-left: 15px;'>");

        mensagemEmail.get()
                .append("<tbody><tr><td style='font-size: 16px;background: #f9f9f9;padding: 15px;color: #444444; ")
                .append("font-family: \"Arial\",\"Helvetica Neue\", Helvetica, sans-serif;'>");

        mensagemEmail.get().append("Prezado,");
        mensagemEmail.get().append("<br><br>");
        mensagemEmail.get().append("O Médico " + medico.getNome() + " realizou cadastro no aplicativo em  " + dataCad);
        mensagemEmail.get().append("<br>Mensagem gerada automaticamente.");
        mensagemEmail.get().append("<br><br>");

        mensagemEmail.get().append("Atenciosamente,");
        mensagemEmail.get().append("<br>");

        String nomeSistema = "Sistema Plantão Mais";
        if (System.getenv(Constants.NOME_SISTEMA) != null) {
            nomeSistema = Constants.NOME_SISTEMA;
        }

        mensagemEmail.get().append(nomeSistema);

        mensagemEmail.get()
                .append("</td></tr><tr><td style='background: #eeeeee;padding:3px; font-family: \"Arial\",\"Helvetica Neue\", Helvetica, sans-serif;'>");

        mensagemEmail.get().append("</td></tr></tbody></table>");

        return mensagemEmail.get().toString();
    }

    /**
     * @param medicoVo
     */
    public Info confirmarEmail(MedicoVo medicoVo) {
        try {
            GenericDao<Medico> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.EMAIL));
            propriedades.add(new Propriedade(Medico.EMAIL_VALIDADO));
            propriedades.add(new Propriedade(Medico.EXCLUIDO));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.EMAIL, medicoVo.getEmail(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL)));

            Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            if (medico != null) {
                propriedades.clear();

                propriedades.add(new Propriedade(Medico.EMAIL_VALIDADO));
                medico.setEmailValidado(true);

                genericDao.update(medico, propriedades);
            } else {
                return Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return Info.GetSuccess();
    }

    /**
     * @return
     */
    public List<UsuarioVo> obterWhatsDuvidaAjuda() {
        List<UsuarioVo> lista = new ArrayList<>();
        try {

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Configuracao.ID));

            String aliasUsuario = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.USUARIO);
            propriedades.add(new Propriedade(Usuario.ID, Usuario.class, aliasUsuario));
            propriedades.add(new Propriedade(Usuario.TELEFONE, Usuario.class, aliasUsuario));
            propriedades.add(new Propriedade(Usuario.NOME, Usuario.class, aliasUsuario));

            String aliasTipoConfiguracao = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.TIPO_CONFIGURACAO);
            propriedades.add(new Propriedade(TipoConfiguracao.ID, TipoConfiguracao.class, aliasTipoConfiguracao));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(
                    new Filtro(TipoConfiguracao.ID, Constants.TIPO_CONFIGURACAO_WHATS_DUVIDAS_AJUDA, Filtro.EQUAL, aliasTipoConfiguracao));

            GenericDao<Configuracao> genericDao = new GenericDao<>();

            List<Configuracao> listaConfiguracao = genericDao.listarByFilter(propriedades, null, Configuracao.class, -1, nxCriterion);

            if (!Util.isNullOrEmpty(listaConfiguracao)) {
                for (Configuracao configuracao : listaConfiguracao) {
                    UsuarioVo usuarioVo = UsuarioMapper.convertToVo(configuracao.getUsuario());
                    lista.add(usuarioVo);
                }
            }


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return lista;
    }

    /**
     * @param medicoVo
     * @return
     */
    public Info enviarEmailAtualizarSenha(MedicoVo medicoVo) {
        Info info;
        try {

            GenericDao<Medico> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.EMAIL));
            propriedades.add(new Propriedade(Medico.SENHA));
            propriedades.add(new Propriedade(Medico.EXCLUIDO));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.EMAIL, medicoVo.getEmail(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL)));

            Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            if (medico == null) {
                return Info.GetError("Nenhum médico encontrado com este e-mail!");
            }

            medico.setResetKey(generateResetKey());

            AuditoriaUtil.alteracao(medico);
            propriedades.clear();

            propriedades.add(new Propriedade(Medico.RESET_KEY));

            propriedades.addAll(AuditoriaUtil.getCamposAlteracao());
            genericDao.update(medico, propriedades);

            String conteudo = montarMensagemRedefinirSenha(medico.getEmail(), medico.getResetKey(), "medico");

            String tituloEmail = Constants.NOME_SISTEMA + " - Redefinição de senha";

            EmailSendGrid email = new EmailSendGrid(medicoVo.getEmail(), tituloEmail,
                    conteudo, true);
            SendGridUtil.enviar(email);
            info = Info.GetSuccess(Constants.SUCESSO);

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    /**
     * @param medicoVo
     * @return
     */
    public Info atualizarSenha(MedicoVo medicoVo) {
        Info info;
        try {

            if (medicoVo.getResetKey() == null) {
                return Info.GetError("Por favor, envie a chave de redefinição de senha enviada para o email!");
            }

            GenericDao<Medico> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.EMAIL));
            propriedades.add(new Propriedade(Medico.SENHA));
            propriedades.add(new Propriedade(Medico.RESET_KEY));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.EMAIL, medicoVo.getEmail(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL)));

            Medico medico = genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            if (medico == null) {
                return Info.GetError("Nenhum médico encontrado com este e-mail!");
            }

            if (!medico.getResetKey().equals(medicoVo.getResetKey())) {
                return Info.GetError("A chave para redefinir a senha não confere!");
            }

            medico.setSenha(PASSWORD_ENCODER.encode(medicoVo.getSenha()));
            medico.setResetKey(null);
            medico.setEmailValidado(true);
            AuditoriaUtil.alteracao(medico);
            propriedades.clear();

            propriedades.add(new Propriedade(Medico.SENHA));
            propriedades.add(new Propriedade(Medico.RESET_KEY));
            propriedades.add(new Propriedade(Medico.EMAIL_VALIDADO));

            propriedades.addAll(AuditoriaUtil.getCamposAlteracao());
            genericDao.update(medico, propriedades);

            info = Info.GetSuccess(Constants.SUCESSO);

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    private String montarMensagemRedefinirSenha(String email, String resetKey, String medicOrAdmin) {

        AtomicReference<StringBuffer> mensagemEmail = new AtomicReference<>(new StringBuffer());


        String hrefToReplace = Constants.URL_SYSTEM + "auth/redefinir-senha/" + medicOrAdmin + "/" + email + "/" + resetKey;

        mensagemEmail.get()
                .append(
                        "<table width=\"100%\" style=\"background: #ffffff\">\n" +
                                "<tbody><tr>\n" +
                                "    <td align=\"center\" style=\"background: #ffffff; height:100px\">\n" +
                                "      <img src=\"https://hygeasaude.s3.amazonaws.com/logo.png\" alt=\"Minha Figura\" style=\"height: 70px; marginTop: 15px; marginBottom: 15px\">\n" +
                                "    </td>\n" +
                                "  </tr>  <tr>\n" +
                                "    <td align=\"center\" style=\"background: #0E7258; height: 80px\">\n" +
                                "      <span style=\"color: #ffffff; font-family: Helvetica; font-size: 22px; font-weight: 400\">Esqueceu a senha?</span>\n" +
                                "    </td>\n" +
                                "  </tr>\n" +
                                "  <tr>\n" +
                                "\n" +
                                "    <td align=\"center\" style=\"padding-bottom: 15px; padding-top: 30px\">\n" +
                                "      <span style=\"color: #464646; font-family: Helvetica; font-size: 20px\"><b>Olá!</b> </span>\n" +
                                "    </td>\n" +
                                "  </tr>\n" +
                                "  <tr>\n" +
                                "    <td align=\"center\" style=\"padding-bottom: 5px\">\n" +
                                "      <div style=\"color: #333333; font-family: Helvetica; font-size: 1rem; font-weight: 300; line-height: 1.5; max-width: 470px\">\n" +
                                "        <span>Altere a sua senha para acessar o Plantão Mais.</span><br>\n" +
                                "      </div>\n" +
                                "    </td>\n" +
                                "  </tr>\n" +
                                "  <tr>\n" +
                                "    <td align=\"center\" style=\"padding-bottom: 10px\">\n" +
                                "      <div style=\"color: #333333; font-family: Helvetica; font-size: 1rem; font-weight: 300; line-height: 1.5; max-width: 470px\">\n" +
                                "                        <span>Se você não pediu a alteração, ignore este e-mail.</span><br>\n" +
                                "      </div>\n" +
                                "    </td>\n" +
                                "  </tr>\n" +
                                "  <tr>\n" +
                                "    <td align=\"center\" style=\"padding-bottom: 30px; padding-top: 50px\">\n" +
                                "      <a href=\"hrefToReplace\" style=\"text-decoration: none; border-radius: 9px; background: #0E7258; border: none; color: white; padding: 15px 40px; font-family: Helvetica; cursor: pointer; font-size: 16px\" target=\"_blank\" rel=\"noreferrer\">\n" +
                                "        <span>Alterar senha</span>\n" +
                                "      </a>\n" +
                                "    </td>\n" +
                                "  </tr>\n" +
                                "  <tr>\n" +
                                "    <td align=\"center\" style=\"padding-bottom: 40px\">\n" +
                                "      <div style=\"color: #0E7258; font-family: Helvetica; font-size: 14px; font-weight: 300; line-height: 1.7\">\n" +
                                "        <span style=\"color: #0E7258\">Abraços,</span><br>\n" +
                                "        <span style=\"font-weight: 500\">Equipe Plantão Mais</span>\n" +
                                "      </div>\n" +
                                "    </td>\n" +
                                "  </tr>\n" +
                                "</tbody></table>"
                );

        return mensagemEmail.get().toString().replace("hrefToReplace", hrefToReplace);
    }

    //ADMIN

    public Info enviarEmailAtualizarSenha(UsuarioVo usuarioVo) {
        Info info;
        try {

            GenericDao<Usuario> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Usuario.ID));
            propriedades.add(new Propriedade(Usuario.LOGIN));
            propriedades.add(new Propriedade(Usuario.SENHA));
            propriedades.add(new Propriedade(Usuario.EXCLUIDO));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Usuario.LOGIN, usuarioVo.getEmail(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, false, Filtro.EQUAL)));

            Usuario usuario = genericDao.selectUnique(propriedades, Usuario.class, nxCriterion);

            if (usuario == null) {
                return Info.GetError("Nenhum usuário encontrado com este e-mail!");
            }

            usuario.setResetKey(generateResetKey());

            AuditoriaUtil.alteracao(usuario);
            propriedades.clear();

            propriedades.add(new Propriedade(Usuario.RESET_KEY));

            propriedades.addAll(AuditoriaUtil.getCamposAlteracao());
            genericDao.update(usuario, propriedades);

            String conteudo = montarMensagemRedefinirSenha(usuario.getLogin(), usuario.getResetKey(), "admin");

            String tituloEmail = Constants.NOME_SISTEMA + " - Redefinição de senha";

            EmailSendGrid email = new EmailSendGrid(usuario.getLogin(), tituloEmail,
                    conteudo, true);
            SendGridUtil.enviar(email);
            info = Info.GetSuccess(Constants.SUCESSO);

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    /**
     * @param usuarioVo
     * @return
     */
    public Info atualizarSenha(UsuarioVo usuarioVo) {
        Info info;
        try {

            if (usuarioVo.getResetKey() == null) {
                return Info.GetError("Por favor, envie a chave de redefinição de senha enviada para o email!");
            }

            GenericDao<Usuario> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Usuario.ID));
            propriedades.add(new Propriedade(Usuario.LOGIN));
            propriedades.add(new Propriedade(Usuario.SENHA));
            propriedades.add(new Propriedade(Usuario.RESET_KEY));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Usuario.LOGIN, usuarioVo.getLogin(), Filtro.EQUAL));
            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, false, Filtro.EQUAL)));

            Usuario usuario = genericDao.selectUnique(propriedades, Usuario.class, nxCriterion);

            if (usuario == null) {
                return Info.GetError("Nenhum usuario encontrado com este e-mail!");
            }


            if (!usuario.getResetKey().equals(usuarioVo.getResetKey())) {
                return Info.GetError("A chave para redefinir a senha não confere!");
            }

            usuario.setSenha(PASSWORD_ENCODER.encode(usuarioVo.getSenha()));
            usuario.setResetKey(null);
            AuditoriaUtil.alteracao(usuario);
            propriedades.clear();

            propriedades.add(new Propriedade(Medico.SENHA));
            propriedades.add(new Propriedade(Medico.RESET_KEY));

            propriedades.addAll(AuditoriaUtil.getCamposAlteracao());
            genericDao.update(usuario, propriedades);

            info = Info.GetSuccess(Constants.SUCESSO);

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

}


