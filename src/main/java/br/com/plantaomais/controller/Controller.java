package br.com.plantaomais.controller;


import br.com.nextage.util.Util;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.Usuario;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.UsuarioMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.UsuarioVo;

import java.security.Principal;
import java.util.TimeZone;

/**
 * Created by Alyson on 01/04/2016.
 * <p>
 * Classe abstrata responsavel por 'obrigar' os controllers
 * a passarem um usuarioVo em seu construtor, caso não, solta a exception de autenticação
 * para as apis (Jax-rs, Google, etc.) tratarem do seu modo
 */
public abstract class Controller {
    protected Usuario usuario;
    protected UsuarioVo usuarioVO;
    protected Medico medico;
    protected MedicoVo medicoVO;
    protected TimeZone timeZone;

    public <T extends Principal> Controller(T vo) throws AuthenticationException {
        if (vo instanceof UsuarioVo) {
            construtor((UsuarioVo) vo);
        } else if (vo instanceof MedicoVo) {
            construtor((MedicoVo) vo);
        } else {
            throw new AuthenticationException(Util.setParamsLabel(Constants.ACESSO_NEGADO_TIPO_USUARIO_DESCONHECIDO, vo.getClass()));
        }
    }

    private void construtor(UsuarioVo vo) throws AuthenticationException {
        if (vo == null) {
            throw new AuthenticationException(Constants.ACESSO_NEGADO);
        }
        try {
            this.usuarioVO = vo;
            this.usuario = UsuarioMapper.convertToEntity(vo);

            timeZone = TimeZone.getTimeZone("America/Sao_Paulo");
        } catch (Exception e) {
            throw new AuthenticationException(Constants.ACESSO_NEGADO);
        }
    }

    private void construtor(MedicoVo vo) throws AuthenticationException {
        if (vo == null) {
            throw new AuthenticationException(Constants.ACESSO_NEGADO);
        }
        try {
            this.medicoVO = vo;
            this.medico = MedicoMapper.convertToEntity(vo);

            this.usuario = new Usuario();
            this.usuario.setNome(vo.getNome() + " - App");

            timeZone = TimeZone.getTimeZone("America/Sao_Paulo");
        } catch (Exception e) {
            throw new AuthenticationException(Constants.ACESSO_NEGADO);
        }
    }

    public Controller(UsuarioVo vo) throws AuthenticationException {
        if (vo != null) {
            construtor(vo);
        } else {
            throw new AuthenticationException(Constants.ACESSO_NEGADO);
        }
    }

    public Controller() {
    }
}
