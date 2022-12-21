package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.nextage.persistence_2.util.Paginacao;
import br.com.nextage.persistence_2.vo.PaginacaoVo;
import br.com.plantaomais.entitybean.Contratante;
import br.com.plantaomais.filtro.FiltroContratante;
import br.com.plantaomais.mapper.ContratanteMapper;
import br.com.plantaomais.util.AuditoriaUtil;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.ContratanteVo;
import br.com.plantaomais.vo.UsuarioVo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by nextage on 09/05/2019.
 */
public class ContratanteController extends Controller {
    private static final Logger logger = Logger.getLogger(ContratanteController.class.getName());

    public ContratanteController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
    }

    /**
     * Retorno uma lista de contratantes
     *
     * @param filtro
     * @return
     */
    public List<ContratanteVo> listar(FiltroContratante filtro) {
        List<ContratanteVo> listaVo = null;
        try {

            GenericDao<Contratante> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Contratante.ID));
            propriedades.add(new Propriedade(Contratante.NOME_CONTRATANTE));
            propriedades.add(new Propriedade(Contratante.CIDADE));
            propriedades.add(new Propriedade(Contratante.UF));
            propriedades.add(new Propriedade(Contratante.CNPJ));
            propriedades.add(new Propriedade(Contratante.EXCLUIDO));


            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Contratante.EXCLUIDO, false, Filtro.EQUAL));
            if(filtro != null){
                if (filtro.getSituacao() != null && filtro.getSituacao().equals("TODOS_CONTRATANTES")) {
                    nxCriterion = null;
                }
                if (filtro.getSituacao() != null && filtro.getSituacao().equals("CONTRATANTES_ATIVOS")) {
                    nxCriterion = NxCriterion.montaRestriction(new Filtro(Contratante.EXCLUIDO, false, Filtro.EQUAL));
                }
                if (filtro.getSituacao() != null && filtro.getSituacao().equals("CONTRATANTES_INATIVOS")) {
                    nxCriterion = NxCriterion.montaRestriction(new Filtro(Contratante.EXCLUIDO, true, Filtro.EQUAL));
                }
            }
            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Contratante.NOME_CONTRATANTE, NxOrder.NX_ORDER.ASC));

            List<Contratante> lista = dao.listarByFilter(propriedades, nxOrders, Contratante.class, Constants.NO_LIMIT, nxCriterion);
            listaVo = ContratanteMapper.convertToListVo(lista);


        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            //info = Info.GetError("Erro ao listar Contratante");
        }

        return listaVo;
    }

    /**
     * Retorno uma lista de Contratantes paginado
     *
     * @param paginacaoVo
     * @return
     */
    public Info listarPaginado(PaginacaoVo paginacaoVo) {
        Info info = null;

        try {
            GenericDao<Contratante> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Contratante.ID));
            propriedades.add(new Propriedade(Contratante.NOME_CONTRATANTE));
            propriedades.add(new Propriedade(Contratante.CIDADE));
            propriedades.add(new Propriedade(Contratante.UF));
            propriedades.add(new Propriedade(Contratante.EXCLUIDO));

            NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Contratante.EXCLUIDO, false, Filtro.EQUAL));

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Contratante.NOME_CONTRATANTE, NxOrder.NX_ORDER.ASC));

            Paginacao.build(propriedades, nxOrders, Contratante.class, criterion, paginacaoVo);

            info = Info.GetSuccess(paginacaoVo);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao listar Contratantes");
        }

        return info;
    }

    /**
     * Retorno de Contratantes com todas as propriendades carregadas
     *
     * @param vo ContratanteVo
     * @return
     */

    public Info getContratanteById(ContratanteVo vo) {
        Info info = null;
        try {
            if (vo != null && vo.getId() != null) {
                GenericDao<Contratante> dao = new GenericDao();

                List<Propriedade> propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Contratante.ID));
                propriedades.add(new Propriedade(Contratante.NOME_CONTRATANTE));
                propriedades.add(new Propriedade(Contratante.CIDADE));
                propriedades.add(new Propriedade(Contratante.UF));
                propriedades.add(new Propriedade(Contratante.CNPJ));
                propriedades.add(new Propriedade(Contratante.EXCLUIDO));

                NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Contratante.EXCLUIDO, true, Filtro.NOT_EQUAL));
                NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Contratante.ID, vo.getId(), Filtro.EQUAL));
                criterion = NxCriterion.and(criterion, criterionAux);

                Contratante contratante = dao.selectUnique(propriedades, Contratante.class, criterion);

                vo = ContratanteMapper.convertToVo(contratante);

                info = Info.GetSuccess(vo);
            } else {
                info = Info.GetError("Contratante não encontrado.");
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao buscar Contratante.");
        }
        return info;
    }
    public Info salvar(ContratanteVo vo) {
        Info info = null;
        try {
            List<Propriedade> propriedades;
            GenericDao<Contratante> dao = new GenericDao<>();
            Contratante contratante = ContratanteMapper.convertToEntity(vo);

            //Verifica se ja existe CNPJ
            if (vo.getCnpj() != null) {
                propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Contratante.ID));
                propriedades.add(new Propriedade(Contratante.CNPJ));
                propriedades.add(new Propriedade(Contratante.EXCLUIDO));

                NxCriterion criterion = NxCriterion.montaRestriction(new Filtro(Contratante.CNPJ, vo.getCnpj(), Filtro.EQUAL));
                NxCriterion criterionAux = NxCriterion.montaRestriction(new Filtro(Contratante.EXCLUIDO, false, Filtro.EQUAL));
                criterion = NxCriterion.and(criterion, criterionAux);
                if (contratante.getId() != null && contratante.getId() > 0) {
                    criterionAux = NxCriterion.montaRestriction(new Filtro(Contratante.ID, vo.getId(), Filtro.NOT_EQUAL));
                    criterion = NxCriterion.and(criterion, criterionAux);
                }

                List<Contratante> users = dao.listarByFilter(propriedades, null, Contratante.class, 1, criterion);
                if (users != null && users.size() > 0) {
                    return Info.GetError("Já existe um contratante cadastrado com o mesmo CNPJ.");
                }
            }

            if (contratante.getId() != null && contratante.getId() > 0) {
                propriedades = new ArrayList<>();
                propriedades.add(new Propriedade(Contratante.ID));
                propriedades.add(new Propriedade(Contratante.NOME_CONTRATANTE));
                propriedades.add(new Propriedade(Contratante.CIDADE));
                propriedades.add(new Propriedade(Contratante.UF));
                propriedades.add(new Propriedade(Contratante.CNPJ));

                propriedades.addAll(AuditoriaUtil.getCamposAlteracao());

                AuditoriaUtil.alteracao(contratante);
                dao.update(contratante, propriedades);
            } else {
                AuditoriaUtil.inclusao(contratante, null);
                dao.persist(contratante);
            }
            vo.setId(contratante.getId());

            info = Info.GetSuccess("Contratante salvo com sucesso.");
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao salvar Contratante.");
        }
        return info;
    }



 /** Faz a exclusão logica de um contratante
 *
 * @param vo
 * @return
 **/
    public Info excluir(ContratanteVo vo) {
        Info info = null;
        try {
            GenericDao<Contratante> dao = new GenericDao<>();
            Contratante contratante = ContratanteMapper.convertToEntity(vo);
            if (contratante.getId() > 0) {
                AuditoriaUtil.exclusao(contratante, null);
                dao.update(contratante, AuditoriaUtil.getCamposExclusao());
                info = Info.GetSuccess("Contratante inativado com sucesso!", ContratanteMapper.convertToVo(contratante));
            } else {
                info = Info.GetError("Não foi possivel inativar o Contratante.");
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao inativar o Contratante.");
        }
        return info;
    }

    /** Faz a ativacao logica de um contratante
     *
     * @param vo
     * @return
     **/
    public Info ativarContratante(ContratanteVo vo) {
        Info info = null;
        try {
            GenericDao<Contratante> dao = new GenericDao<>();
            Contratante contratante = ContratanteMapper.convertToEntity(vo);
            if (contratante.getId() > 0) {
                contratante.setExcluido(false);
                dao.update(contratante, AuditoriaUtil.getCamposExclusao());
                info = Info.GetSuccess("Contratante ativado com sucesso!", ContratanteMapper.convertToVo(contratante));
            } else {
                info = Info.GetError("Não foi possivel ativar o Contratante.");
            }

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Erro ao ativar o Contratante.");
        }
        return info;
    }

}

