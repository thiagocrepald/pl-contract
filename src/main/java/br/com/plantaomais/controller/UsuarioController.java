package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.nextage.persistence_2.util.Paginacao;
import br.com.nextage.persistence_2.vo.PaginacaoVo;
import br.com.plantaomais.entitybean.Configuracao;
import br.com.plantaomais.entitybean.TipoConfiguracao;
import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.entitybean.UsuarioTipoPermissao;
import br.com.plantaomais.filtro.FiltroUsuario;
import br.com.plantaomais.mapper.TipoConfiguracaoMapper;
import br.com.plantaomais.mapper.TipoPermissaoMapper;
import br.com.plantaomais.mapper.UsuarioMapper;
import br.com.plantaomais.mapper.UsuarioTipoPermissaoMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.util.criptografia.Criptografia;
import br.com.plantaomais.vo.TipoConfiguracaoVo;
import br.com.plantaomais.vo.TipoPermissaoVo;
import br.com.plantaomais.vo.UsuarioVo;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import static br.com.plantaomais.controller.AuthController.PASSWORD_ENCODER;

/**
 * Created by nextage on 07/05/2019.
 */
public class UsuarioController extends Controller {
    private static final Logger logger = Logger.getLogger(UsuarioController.class.getName());

    private final UserConfigurationController userConfigurationController;

    public static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    public UsuarioController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
        userConfigurationController = new UserConfigurationController();
    }

    /**
     * Retorno uma lista de usuarios
     *
     * @param filtro
     * @return
     */
    public List<UsuarioVo> listar(FiltroUsuario filtro) {
        List<UsuarioVo> listaVo = null;
        try {

            GenericDao<Usuario> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Usuario.ID));
            propriedades.add(new Propriedade(Usuario.NOME));
            propriedades.add(new Propriedade(Usuario.DATA_ALTERACAO_SENHA));
            propriedades.add(new Propriedade(Usuario.LOGIN));
            propriedades.add(new Propriedade(Usuario.EXCLUIDO));
            propriedades.add(new Propriedade(Usuario.TELEFONE));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, false, Filtro.EQUAL));
            NxCriterion nxCriterionAux;
            NxCriterion nxCriterionOr;
            if (filtro != null && filtro.getNome() != null && filtro.getNome().length() > 0) {
                nxCriterionOr = NxCriterion.montaRestriction(new Filtro(Usuario.NOME, filtro.getNome(), Filtro.LIKE));
                nxCriterionAux = NxCriterion.montaRestriction(new Filtro(Usuario.LOGIN, filtro.getNome(), Filtro.LIKE));
                nxCriterionOr = NxCriterion.or(nxCriterionOr, nxCriterionAux);
                nxCriterion = NxCriterion.and(nxCriterion, nxCriterionOr);
            }

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Usuario.NOME, NxOrder.NX_ORDER.ASC));

            List<Usuario> lista = dao.listarByFilter(propriedades, nxOrders, Usuario.class, Constants.NO_LIMIT, nxCriterion);
            listaVo = UsuarioMapper.convertToListVo(lista);


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            //info = Info.GetError("Erro ao listar Usuario");
        }

        return listaVo;
    }

    /**
     * Retorno uma lista de Usuários paginado
     *
     * @param paginacaoVo
     * @return
     */
    public Info listarPaginado(PaginacaoVo paginacaoVo) {
        Info info = null;

        try {
            GenericDao<Usuario> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Usuario.ID));
            propriedades.add(new Propriedade(Usuario.NOME));
            propriedades.add(new Propriedade(Usuario.DATA_ALTERACAO_SENHA));
            propriedades.add(new Propriedade(Usuario.LOGIN));
            propriedades.add(new Propriedade(Usuario.EXCLUIDO));
            propriedades.add(new Propriedade(Usuario.TELEFONE));

            NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, false, Filtro.EQUAL));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Usuario.NOME, NxOrder.NX_ORDER.ASC));

            Paginacao.build(propriedades, nxOrders, Usuario.class, criterion, paginacaoVo);

            info = Info.GetSuccess(paginacaoVo);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao listar Usuários");
        }

        return info;
    }

    /**
     * Retorno de Usuarios com todas as propriendades carregadas
     *
     * @param vo UsuarioVo
     * @return
     */

    public Info getUsuarioById(UsuarioVo vo) {
        Info info;
        try {
            if (vo != null && vo.getId() != null) {
                GenericDao dao = new GenericDao();

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Usuario.ID));
                propriedades.add(new Propriedade(Usuario.NOME));
                propriedades.add(new Propriedade(Usuario.LOGIN));
                propriedades.add(new Propriedade(Usuario.EXCLUIDO));
                propriedades.add(new Propriedade(Usuario.TELEFONE));

                NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, true, Filtro.NOT_EQUAL));
                NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Usuario.ID, vo.getId(), Filtro.EQUAL));
                criterion = NxCriterion.and(criterion, criterionAux);

                Usuario usuario = (Usuario) dao.selectUnique(propriedades, Usuario.class, criterion);

                vo = UsuarioMapper.convertToVo(usuario);

                GenericDao<UsuarioTipoPermissao> genericDao = new GenericDao<>();

                propriedades = new ArrayList<>();

                propriedades.add(new Propriedade(UsuarioTipoPermissao.ID));
                propriedades.add(new Propriedade(UsuarioTipoPermissao.USUARIO));
                propriedades.add(new Propriedade(UsuarioTipoPermissao.TIPO_PERMISSAO));

//                String aliasUsuario = NxCriterion.montaAlias(UsuarioTipoPermissao.ALIAS_CLASSE, UsuarioTipoPermissao.USUARIO);
//                propriedades.add(new Propriedade(Usuario.ID, Usuario.class, aliasUsuario));
//                propriedades.add(new Propriedade(Usuario.NOME, Usuario.class, aliasUsuario));
//
//                String aliasTipoPermissao = NxCriterion.montaAlias(UsuarioTipoPermissao.ALIAS_CLASSE, UsuarioTipoPermissao.TIPO_PERMISSAO);
//                propriedades.add(new Propriedade(TipoPermissao.ID, TipoPermissao.class, aliasTipoPermissao));
//                propriedades.add(new Propriedade(TipoPermissao.DESCRICAO, TipoPermissao.class, aliasTipoPermissao));

                criterion = NxCriterion.montaRestriction(new Filtro(UsuarioTipoPermissao.USUARIO, usuario, Filtro.EQUAL));

                List<UsuarioTipoPermissao> list = genericDao.listarByFilter(propriedades, null, UsuarioTipoPermissao.class, -1, criterion);

                vo.setListaConfiguracao(userConfigurationController.findAllForUserVO(usuario.getId()));

                vo.setListaUsuarioTipoPermissao(UsuarioTipoPermissaoMapper.convertToListVo(list));
                info = Info.GetSuccess(vo);
            } else {
                info = Info.GetError("Usuário não encontrado.");
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao buscar Usuário.");
        }
        return info;
    }

    /**
     * Faz o persist ou update de usuário
     *
     * @param vo
     * @return
     */
    public Info salvar(UsuarioVo vo) {
        Info info;
        GenericDao dao = new GenericDao<>();
        try {
            List<Propriedade> propriedades;
            Usuario usuario = UsuarioMapper.convertToEntity(vo);

            dao.beginTransaction();

            //Verifica se ja existe Login
            if (vo.getLogin() != null) {
                propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Usuario.ID));
                propriedades.add(new Propriedade(Usuario.LOGIN));
                propriedades.add(new Propriedade(Usuario.EXCLUIDO));

                NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Usuario.LOGIN, vo.getLogin(), Filtro.EQUAL));
                NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, false, Filtro.EQUAL));
                criterion = NxCriterion.and(criterion, criterionAux);
                if (usuario.getId() != null && usuario.getId() > 0) {
                    criterionAux = NxCriterion.montaRestriction(new Filtro(Usuario.ID, vo.getId(), Filtro.NOT_EQUAL));
                    criterion = NxCriterion.and(criterion, criterionAux);
                }

                List<Usuario> users = dao.listarByFilter(propriedades, null, Usuario.class, 1, criterion);
                if (users != null && users.size() > 0) {
                    return Info.GetError("Já existe um usuário cadastrado com o mesmo login.");
                }
            }
            if (usuario.getId() != null && usuario.getId() > 0) {
                propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Usuario.ID));
                propriedades.add(new Propriedade(Usuario.NOME));
                propriedades.add(new Propriedade(Usuario.LOGIN));
                propriedades.add(new Propriedade(Usuario.TELEFONE));

                if (vo.getSenha() != null && vo.getSenha().length() > 0) {
                    propriedades.add(new Propriedade(Usuario.SENHA));
                    usuario.setSenha(PASSWORD_ENCODER.encode(vo.getSenha()));
                }

                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());
                AuditoriaUtil.alteracao(usuario);
                dao.updateWithCurrentTransaction(usuario, propriedades);
            } else {
                usuario.setSenha(PASSWORD_ENCODER.encode(usuario.getSenha()));
                AuditoriaUtil.inclusao(usuario, null);
                dao.persistWithCurrentTransaction(usuario);
            }

            if (vo.getListaTipoPermissao() != null) {
//                GenericDao<UsuarioTipoPermissao> genericDao = new GenericDao<>();

                propriedades = new ArrayList<>();

                propriedades.add(new Propriedade(UsuarioTipoPermissao.ID));
                propriedades.add(new Propriedade(UsuarioTipoPermissao.USUARIO));
                propriedades.add(new Propriedade(UsuarioTipoPermissao.TIPO_PERMISSAO));

                NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(UsuarioTipoPermissao.USUARIO, usuario, Filtro.EQUAL));

                List<UsuarioTipoPermissao> listUsuarioTipoPermissao = dao.listarByFilter(propriedades, null, UsuarioTipoPermissao.class, Constants.NO_LIMIT, nxCriterion);

                if (listUsuarioTipoPermissao != null) {
                    for (TipoPermissaoVo permissaoVo : vo.getListaTipoPermissao()) {
                        if (permissaoVo.getChecked() != null) {
                            if (permissaoVo.getChecked()) {
                                UsuarioTipoPermissao usuarioTipoPermissao = listUsuarioTipoPermissao.stream().filter(o -> o.getTipoPermissao().getId().equals(permissaoVo.getId())).findAny().orElse(null);
                                if (usuarioTipoPermissao == null) {
                                    usuarioTipoPermissao = new UsuarioTipoPermissao();
                                    usuarioTipoPermissao.setTipoPermissao(TipoPermissaoMapper.convertToEntity(permissaoVo));
                                    usuarioTipoPermissao.setUsuario(usuario);
                                    dao.persistWithCurrentTransaction(usuarioTipoPermissao);
                                }
                            } else if (!permissaoVo.getChecked()) {
                                UsuarioTipoPermissao usuarioTipoPermissao = listUsuarioTipoPermissao.stream().filter(o -> o.getTipoPermissao().getId().equals(permissaoVo.getId())).findAny().orElse(null);
                                if (usuarioTipoPermissao != null) {
                                    dao.deleteWithCurrentTransaction(usuarioTipoPermissao);
                                }

                            }
                        }

                    }
                } else {
                    for (TipoPermissaoVo tipoPermissaoVo : vo.getListaTipoPermissao()) {
                        UsuarioTipoPermissao usuarioTipoPermissao = new UsuarioTipoPermissao();
                        usuarioTipoPermissao.setUsuario(usuario);
                        usuarioTipoPermissao.setTipoPermissao(TipoPermissaoMapper.convertToEntity(tipoPermissaoVo));
                        dao.persistWithCurrentTransaction(usuarioTipoPermissao);
                    }
                }
            }

            if (vo.getListaConfiguracao() != null) {
                List<Propriedade> propriedadesConfiguracao = new ArrayList<>();
                propriedadesConfiguracao.add(new Propriedade(Configuracao.ID));
                propriedadesConfiguracao.add(new Propriedade(Configuracao.TIPO_CONFIGURACAO));

                String aliasUsuario = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.USUARIO);
                propriedadesConfiguracao.add(new Propriedade(Usuario.ID, Usuario.class, aliasUsuario));
                propriedadesConfiguracao.add(new Propriedade(Usuario.NOME, Usuario.class, aliasUsuario));

                String aliasTipoConfiguracao = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.TIPO_CONFIGURACAO);
                propriedadesConfiguracao.add(new Propriedade(TipoConfiguracao.ID, TipoConfiguracao.class, aliasTipoConfiguracao));
                propriedadesConfiguracao.add(new Propriedade(TipoConfiguracao.DESCRICAO, TipoConfiguracao.class, aliasTipoConfiguracao));


                NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Configuracao.USUARIO, usuario, Filtro.EQUAL));

                List<Configuracao> listConfiguracao = dao.listarByFilter(propriedadesConfiguracao, null, Configuracao.class, Constants.NO_LIMIT, nxCriterion);

                if (listConfiguracao != null) {
                    for (TipoConfiguracaoVo tipoConfiguracaoVo : vo.getListaTipoConfiguracao()) {
                        if (tipoConfiguracaoVo.getChecked() != null) {
                            if (tipoConfiguracaoVo.getChecked()) {
                                Configuracao configuracao = listConfiguracao.stream().filter(o -> o.getTipoConfiguracao().getId().equals(tipoConfiguracaoVo.getId())).findAny().orElse(null);
                                if (configuracao == null) {
                                    configuracao = new Configuracao();
                                    configuracao.setTipoConfiguracao(TipoConfiguracaoMapper.convertToEntity(tipoConfiguracaoVo));
                                    configuracao.setUsuario(usuario);
                                    dao.persistWithCurrentTransaction(configuracao);
                                }
                            } else if (!tipoConfiguracaoVo.getChecked()) {
                                Configuracao configuracao = listConfiguracao.stream().filter(o -> o.getTipoConfiguracao().getId().equals(tipoConfiguracaoVo.getId())).findAny().orElse(null);
                                if (configuracao != null) {
                                    dao.deleteWithCurrentTransaction(configuracao);
                                }
                            }
                        }
                    }
                } else {
                    for (TipoConfiguracaoVo tipoConfiguracaoVo : vo.getListaTipoConfiguracao()) {
                        Configuracao configuracao = new Configuracao();
                        configuracao.setUsuario(usuario);
                        configuracao.setTipoConfiguracao(TipoConfiguracaoMapper.convertToEntity(tipoConfiguracaoVo));
                        dao.persistWithCurrentTransaction(configuracao);
                    }
                }
            }


            vo.setId(usuario.getId());

            dao.commitCurrentTransaction();
            info = Info.GetSuccess("Usuário salvo com sucesso.", usuario.getId());
        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao salvar Usuário.");
        }
        return info;
    }

    public Info saveDeletePassword(Integer userId, String password) {
        GenericDao<Usuario> dao = new GenericDao<>();

        try {
            if (Util.isNullOrEmpty(password)) {
                throw new IllegalStateException("password cannot be empty");
            }

            List<Propriedade> props = new ArrayList<>();
            props.add(new Propriedade(Usuario.ID));
            props.add(new Propriedade(Usuario.EXCLUIDO));
            props.add(new Propriedade(Usuario.SENHA_EXCLUSAO_ESCALA));

            NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Usuario.ID, userId, Filtro.EQUAL));
            NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, false, Filtro.EQUAL));

            Usuario user = dao.selectUnique(props, Usuario.class, NxCriterion.and(criterion, criterionAux));

            if (user == null) {
                throw new IllegalStateException("user not found");
            }

            user.setSenhaEsclusaoEscala(PASSWORD_ENCODER.encode(password));

            dao.beginTransaction();
            dao.updateWithCurrentTransaction(user, props);
            dao.commitCurrentTransaction();

            return Info.GetSuccess();

        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("saveDeletePassword");
        }
    }

    public Info verifyDeletePassword(Integer userId, String password) {
        GenericDao<Usuario> dao = new GenericDao<>();

        try {
            if (Util.isNullOrEmpty(password)) {
                throw new IllegalStateException("password cannot be empty");
            }

            List<Propriedade> props = new ArrayList<>();
            props.add(new Propriedade(Usuario.ID));
            props.add(new Propriedade(Usuario.EXCLUIDO));
            props.add(new Propriedade(Usuario.SENHA_EXCLUSAO_ESCALA));

            NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Usuario.ID, userId, Filtro.EQUAL));
            NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Usuario.EXCLUIDO, false, Filtro.EQUAL));

            Usuario user = dao.selectUnique(props, Usuario.class, NxCriterion.and(criterion, criterionAux));

            if (user == null) {
                throw new IllegalStateException("user not found");
            }

            return Info.GetSuccess(PASSWORD_ENCODER.matches(password, user.getSenhaEsclusaoEscala())
                    || Criptografia.criptMD5(password).equals(user.getSenhaEsclusaoEscala()));

        } catch (Exception e) {
            dao.rollbackCurrentTransaction();
            logger.log(Level.SEVERE, e.toString(), e);
            return Info.GetError("saveDeletePassword");
        }
    }

    public Info excluir(UsuarioVo vo) {
        Info info;
        try {
            GenericDao<Usuario> dao = new GenericDao<>();
            Usuario usuario = UsuarioMapper.convertToEntity(vo);
            if (usuario.getId() > 0) {

                GenericDao<Configuracao> daoConfig = new GenericDao<>();

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Configuracao.ID));

                String aliasUsuario = NxCriterion.montaAlias(Configuracao.ALIAS_CLASSE, Configuracao.USUARIO);
                propriedades.add(new Propriedade(Usuario.ID, Usuario.class, aliasUsuario));

                NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Usuario.ID, usuario.getId(), Filtro.EQUAL, aliasUsuario));

                List<Configuracao> listaConfiguracao = daoConfig.listarByFilter(propriedades, null, Configuracao.class, -1, nxCriterion);

                if (listaConfiguracao != null && listaConfiguracao.size() > 0) {
                    for (Configuracao configuracao : listaConfiguracao) {
                        daoConfig.delete(configuracao);
                    }
                }

                AuditoriaUtil.exclusao(usuario, null);
                dao.update(usuario, AuditoriaUtil.getCamposExclusao());
                info = Info.GetSuccess("Usuário excluído com sucesso.", UsuarioMapper.convertToVo(usuario));
            } else {
                info = Info.GetError("Não foi possivel excluir o Usuário.");
            }


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao excluir Usuário.");
        }
        return info;
    }
}
