package br.com.plantaomais.controller.aplicativo;

import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Curso;
import br.com.plantaomais.mapper.CursoMapper;
import br.com.plantaomais.vo.CursoVo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CursoUnsecuredController {

    private static final Logger logger = Logger.getLogger(CursoUnsecuredController.class.getName());

    public List<CursoVo> listarComboCurso() {
        List<CursoVo> listVo = new ArrayList<>();
        try {
            GenericDao<Curso> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Curso.ID));
            propriedades.add(new Propriedade(Curso.NOME));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Curso.NOME, NxOrder.NX_ORDER.ASC));

            List<Curso> lista = dao.listarByFilter(propriedades, nxOrders, Curso.class, -1, null);

            Curso curso = lista.stream().filter(it -> it.getNome().toLowerCase().equals("outros")).findFirst().orElse(null);
            if (curso != null) {
                lista.remove(curso);
                lista.add(curso); // add in the end
            }

            listVo = CursoMapper.convertToListVo(lista);
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        return listVo;
    }
}
