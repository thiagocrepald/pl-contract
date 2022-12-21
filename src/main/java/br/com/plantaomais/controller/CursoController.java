package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Curso;
import br.com.plantaomais.mapper.CursoMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.CursoVo;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;


public class CursoController extends Controller {
    private static final Logger logger = Logger.getLogger(CursoController.class.getName());

    public <T extends Principal> CursoController(T vo) throws AuthenticationException {
        super(vo);
    }

    public CursoVo salvar(CursoVo vo) throws Exception {

        GenericDao<Curso> genericDao = new GenericDao<>();
        genericDao.beginTransaction();

        Curso curso = CursoMapper.convertToEntity(vo);

        if (vo.getId() != null) {
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Curso.ID));
            propriedades.add(new Propriedade(Curso.NOME));
            propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

            AuditoriaUtil.alteracao(curso, this.usuario);

            genericDao.updateWithCurrentTransaction(curso, propriedades);
        } else {
            AuditoriaUtil.inclusao(curso, this.usuario);
            genericDao.persistWithCurrentTransaction(curso);
        }

        vo.setId(curso.getId());
        genericDao.commitCurrentTransaction();

        return CursoMapper.convertToVo(curso);
    }
}
