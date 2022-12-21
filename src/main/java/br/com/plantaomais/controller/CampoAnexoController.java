package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.CampoAnexo;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;

import java.util.ArrayList;
import java.util.List;

public class CampoAnexoController {

/*    public CampoAnexoController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }*/


    public Info listar() throws Exception {

        GenericDao<CampoAnexo> dao = new GenericDao();
        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(CampoAnexo.ID));
        propriedades.add(new Propriedade(CampoAnexo.DESCRICAO));

        List<CampoAnexo> lista = dao.listarByFilter(propriedades, null, CampoAnexo.class, Constants.NO_LIMIT, null);

        return Info.GetSuccess(lista);
    }
}
