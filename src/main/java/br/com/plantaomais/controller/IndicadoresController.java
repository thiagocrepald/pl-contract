package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.CandidatoPlantao;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.MedicoEspecialidade;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.aplicativo.TrocaVaga;
import br.com.plantaomais.entitybean.view.VwIndicadoresEspecialidades;
import br.com.plantaomais.filtro.FiltroPlantao;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.IndicadoresEstadosVo;
import br.com.plantaomais.vo.IndicadoresProfissionaisVo;
import br.com.plantaomais.vo.IndicadoresVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.PlantaoVo;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.transform.Transformers;
import org.hibernate.type.StandardBasicTypes;

import java.security.Principal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.util.Comparator.comparingInt;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toMap;

public class IndicadoresController extends Controller {

    private static final Logger logger = Logger.getLogger(FechamentoController.class.getName());

    public enum CoresEstado {
        AC("#a5eebc"),
        AL("#ffa46e"),
        AM("#009a49"),
        AP("#1a5e37"),
        BA("#ffa327"),
        CE("#ff8b00"),
        DF("#fefe9d"),
        ES("#e97f7e"),
        GO("#fefe9d"),
        MA("#ff7200"),
        MG("#fb7271"),
        MS("#fefe63"),
        MT("#a3920a"),
        PA("#a0f1bb"),
        PB("#ff7200"),
        PE("#ff7200"),
        PI("#b27131"),
        PR("#54c8e1"),
        RJ("#f65e5d"),
        RN("#ce6200"),
        RO("#00be7c"),
        RR("#007e2c"),
        RS("#3a7ba0"),
        SC("#018896"),
        SE("#ff892a"),
        SP("#ce5858"),
        TO("#00a300");


        public String valorCor;

        CoresEstado(String cor) {
            valorCor = cor;
        }

    }

    public <T extends Principal> IndicadoresController(T vo) throws AuthenticationException {
        super(vo);
    }

    public Info criarIndicadores(FiltroPlantao filtro) {
        Info info;

        try {
            List<MedicoVo> listaVo;
            IndicadoresVo indicadoresVo = new IndicadoresVo();

//            List<VwIndicadoresEspecialidades> especialidades = montaCardEspecialidades();
            List<VwIndicadoresEspecialidades> especialidades = new ArrayList<>();
            List<IndicadoresEstadosVo> estados = montaCardEstados(filtro);

            listaVo = MedicoMapper.convertToListVo(obterMedicos(null));
            double masculino = 0d;
            double feminino = 0d;
            for (MedicoVo medicoVo : listaVo) {
                if (medicoVo.getSexo().equals("M")) {
                    masculino++;
                } else if (medicoVo.getSexo().equals("F")) {
                    feminino++;
                }

            }
            indicadoresVo.setSexoMasculino((masculino / listaVo.size()) * 100);
            indicadoresVo.setSexoFeminino((feminino / listaVo.size()) * 100);
            indicadoresVo.setEspecialidades(especialidades);
            indicadoresVo.setEstados(estados);
            indicadoresVo.setTrocasPlantao(obterQtdTrocas(filtro));
            indicadoresVo.setFaltasPlantao(obterQtdDoacoes(filtro));

            info = Info.GetSuccess(indicadoresVo);
        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    /**
     * @param filtroPlantao
     * @return
     */
    public Info criarIndicadorPoporcaoSexo(FiltroPlantao filtroPlantao) {
        Info info;
        try {
            IndicadoresVo indicadoresVo = new IndicadoresVo();

            List<Medico> lista = obterMedicos(filtroPlantao);
            double masculino = 0d;
            double feminino = 0d;
            for (Medico medico : lista) {
                if (medico.getSexo().equals("M")) {
                    masculino++;
                } else if (medico.getSexo().equals("F")) {
                    feminino++;
                }

            }
            indicadoresVo.setSexoMasculino((masculino / lista.size()) * 100);
            indicadoresVo.setSexoFeminino((feminino / lista.size()) * 100);

            info = Info.GetSuccess(indicadoresVo);
        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    private List<Medico> obterMedicos(FiltroPlantao filtroPlantao) throws Exception {
        // % da quantidade de medicos do sexo feminino e masculino
        GenericDao<Medico> dao = new GenericDao();

        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(Medico.ID));
        propriedades.add(new Propriedade(Medico.SEXO));
        propriedades.add(new Propriedade(Medico.DATA_USUARIO_INC));
        propriedades.add(new Propriedade(Medico.EXCLUIDO));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.EXCLUIDO, false, Filtro.EQUAL));

        if (filtroPlantao != null) {
            if (filtroPlantao.getDataInicio() != null && filtroPlantao.getDataFim() != null) {
                nxCriterion = NxCriterion.and(nxCriterion,
                        NxCriterion.montaRestriction(
                                new Filtro(Medico.DATA_USUARIO_INC, filtroPlantao.getDataInicio(), filtroPlantao.getDataFim(), true, Filtro.BETWEEN, null)));
            }
        }
        return dao.listarByFilter(propriedades, null, Medico.class, Constants.NO_LIMIT, nxCriterion);
    }

    private List<IndicadoresEstadosVo> montaCardEstados(FiltroPlantao filtro) {
        GenericDao genericDao = new GenericDao<>();

        Session session = genericDao.getCurrentSession();
        Transaction trx = session.beginTransaction();
        StringBuilder query = new StringBuilder();

        query.append("SELECT c.ESTADO AS \"estado\",       \n" +
                "     ROUND( SUM( TIME_TO_SEC(p.HORA_FIM)/ (60 * 60) - TIME_TO_SEC(p.HORA_INICIO)/ (60 * 60) ), 2 ) AS \"cargaHoraria\"\n" +
                "     FROM PLANTAO AS p\n" +
                "     JOIN ESCALA AS e ON p.ESCALA_ID = e.ID \n" +
                "     JOIN Contract AS c ON e.CONTRATO_ID = c.ID\n" +
                "     WHERE p.MEDICO_ID IS NOT NULL\n" +
                "     AND (e.EXCLUIDO is null or e.EXCLUIDO = false) "
        );
        if (filtro != null && filtro.getDataInicio() != null && filtro.getDataInicio() != null) {
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            String inicio = df.format(filtro.getDataInicio());
            DateFormat df1 = new SimpleDateFormat("yyyy-MM-dd");
            String fim = df.format(filtro.getDataFim());


            query.append("AND p.DATA BETWEEN '" + inicio + "' AND '" + fim + "'");
        }
        query.append("\nGROUP BY c.ESTADO\n" +
                "ORDER BY cargaHoraria DESC\n" +
                "LIMIT 5;\n");


        Query q = session.createSQLQuery(query.toString())
                .addScalar("estado", StandardBasicTypes.STRING)
                .addScalar("cargaHoraria", StandardBasicTypes.DOUBLE)
                .setResultTransformer(Transformers.aliasToBean(IndicadoresEstadosVo.class));

        List<IndicadoresEstadosVo> estados = (List<IndicadoresEstadosVo>) q.list();

        for (IndicadoresEstadosVo estado : estados) {
            CoresEstado coresEstado = CoresEstado.valueOf(CoresEstado.class, estado.getEstado());
            estado.setCor(coresEstado.valorCor);

            if (estado.getCargaHoraria() < 0) {
                estado.setCargaHoraria(estado.getCargaHoraria() * -1);
            }

            int decimal = estado.getCargaHoraria().intValue();
            double fractional = estado.getCargaHoraria() - decimal;

            estado.setCargaHoraria((fractional != 0d && fractional != 0.5) ? Math.ceil(estado.getCargaHoraria()) : estado.getCargaHoraria());

        }

        trx.commit();

        return estados;
    }


    private List<VwIndicadoresEspecialidades> montaCardEspecialidades() throws Exception {

        List<VwIndicadoresEspecialidades> lista;

        GenericDao<VwIndicadoresEspecialidades> genericDao = new GenericDao<>();

        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(VwIndicadoresEspecialidades.ESPECIALIDADE));
        propriedades.add(new Propriedade(VwIndicadoresEspecialidades.QUANTIDADE));

        Object obj = genericDao.listarByFilter(propriedades, null, VwIndicadoresEspecialidades.class, 10, null);

        lista = (List<VwIndicadoresEspecialidades>) obj;

        return lista;
    }

    public Info profissionaisMaisAtivos(FiltroPlantao filtro) {
        Info info;
        List<PlantaoVo> listaVo;
        IndicadoresVo indicadoresVo = new IndicadoresVo();
        try {

            GenericDao<Plantao> dao = new GenericDao();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.DATA));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.EXCLUIDO));

            String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.TELEFONE, Medico.class, aliasMedico));

            Date data = new Date();
            Calendar filtroDataInicial = Calendar.getInstance();
            filtroDataInicial.add(Calendar.DATE, -30);
            Date dataInicial = filtroDataInicial.getTime();

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL));


            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.MEDICO, null, Filtro.NOT_NULL)));

            NxCriterion nxCriterionAux = NxCriterion.or(
                    NxCriterion.montaRestriction(new Filtro(Plantao.STATUS, Constants.STATUS_PLANTAO_FIXO, Filtro.EQUAL)),
                    NxCriterion.montaRestriction(new Filtro(Plantao.STATUS, Constants.STATUS_PLANTAO_CONFIRMADO, Filtro.EQUAL)));

            nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);

            //Filtro por período
            if (filtro != null && filtro.getDataInicio() != null && filtro.getDataFim() != null) {
                nxCriterion = NxCriterion.and(nxCriterion,
                        NxCriterion.montaRestriction(new Filtro(Plantao.DATA, filtro.getDataInicio(), filtro.getDataFim(), true, Filtro.BETWEEN, null)));
            } else {
                nxCriterion = NxCriterion.and(nxCriterion,
                        NxCriterion.montaRestriction(new Filtro(Plantao.DATA, dataInicial, data, true, Filtro.BETWEEN, null)));
            }

            List<Plantao> lista = dao.listarByFilter(propriedades, null, Plantao.class, Constants.NO_LIMIT, nxCriterion);
            listaVo = PlantaoMapper.convertToListVo(lista);
            double totalPlantao = listaVo.size();
            List<IndicadoresProfissionaisVo> listIndicadoresProfissionais = new ArrayList<>();
            List<IndicadoresProfissionaisVo> listIndicadoresProfissionaisOrd = new ArrayList<>();

            Map<MedicoVo, List<PlantaoVo>> plantoesPorMedico =
                    listaVo.stream()
                            .collect(groupingBy(PlantaoVo::getMedico));


            plantoesPorMedico = plantoesPorMedico.entrySet().stream()
                    .sorted(Map.Entry.comparingByValue(comparingInt(List::size))).limit(10)
                    .collect(toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> {
                        throw new AssertionError();
                    }, LinkedHashMap::new));


            plantoesPorMedico.forEach((k, v) -> {
                IndicadoresProfissionaisVo indicadoresProfissionais = new IndicadoresProfissionaisVo();
                indicadoresProfissionais.setQndPlantoes(v.size());
                indicadoresProfissionais.setMedico(k);
                indicadoresProfissionais.setPorcentagem((v.size() / totalPlantao) * 100);

                try {
                    GenericDao<MedicoEspecialidade> daoMedicoEspecialidade = new GenericDao();
                    List<Propriedade> propriedadesMedicoEspecialidade = new ArrayList<>();
                    propriedadesMedicoEspecialidade.add(new Propriedade(MedicoEspecialidade.ID));

                    String aliasEspecialidade = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.ESPECIALIDADE);
                    propriedadesMedicoEspecialidade.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
                    propriedadesMedicoEspecialidade.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));

                    String aliasMedico1 = NxCriterion.montaAlias(MedicoEspecialidade.ALIAS_CLASSE, MedicoEspecialidade.MEDICO);
                    propriedadesMedicoEspecialidade.add(new Propriedade(Medico.ID, Medico.class, aliasMedico1));
                    propriedadesMedicoEspecialidade.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico1));

                    NxCriterion nxCriterion1 = NxCriterion.montaRestriction(new Filtro(Medico.ID, k.getId(), Filtro.EQUAL, aliasMedico1));

                    List<MedicoEspecialidade> listMedicoEspecialidade = daoMedicoEspecialidade.listarByFilter(propriedadesMedicoEspecialidade, null, MedicoEspecialidade.class, Constants.NO_LIMIT, nxCriterion1);

                    StringBuilder especialidades = new StringBuilder();
                    if (listMedicoEspecialidade != null && listMedicoEspecialidade.size() > 0) {
                        for (MedicoEspecialidade medicoEspecialidade : listMedicoEspecialidade) {
                            if (medicoEspecialidade.getEspecialidade() != null) {
                                especialidades.append(medicoEspecialidade.getEspecialidade().getDescricao());
                                especialidades.append("; ");
                            }

                        }
                    }
                    indicadoresProfissionais.setEspecialidade(especialidades.toString());
                } catch (Exception e) {
                    logger.log(Level.SEVERE, e.getMessage(), e);
                }


                listIndicadoresProfissionais.add(indicadoresProfissionais);
            });

            listIndicadoresProfissionaisOrd = reverseList(listIndicadoresProfissionais);

            indicadoresVo.setProfissionais(listIndicadoresProfissionaisOrd);
            info = Info.GetSuccess(indicadoresVo);
        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    private static <T> List<T> reverseList(List<T> list) {
        return IntStream.range(0, list.size())
                .map(i -> (list.size() - 1 - i))    // IntStream
                .mapToObj(list::get)                // Stream<T>
                .collect(Collectors.toCollection(ArrayList::new));
    }

    /**
     * @param filtroPlantao
     * @return
     */
    public Info criarIndicadoGestaoEscala(FiltroPlantao filtroPlantao) {
        Info info;
        try {

            IndicadoresVo indicadoresVo = new IndicadoresVo();

            indicadoresVo.setTrocasPlantao(obterQtdTrocas(filtroPlantao));
            indicadoresVo.setFaltasPlantao(obterQtdDoacoes(filtroPlantao));

            info = Info.GetSuccess(indicadoresVo);

        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }

    private Integer obterQtdTrocas(FiltroPlantao filtroPlantao) throws Exception {
        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(TrocaVaga.ID));
        propriedades.add(new Propriedade(TrocaVaga.TROCA_EFETUADA));
        propriedades.add(new Propriedade(TrocaVaga.DATA_USUARIO_INC));


        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(TrocaVaga.TROCA_EFETUADA, true, Filtro.EQUAL));


        if (filtroPlantao != null) {
            if (filtroPlantao.getDataInicioIndicadorGestao() != null && filtroPlantao.getDataFimIndicadorGestao() != null) {
                nxCriterion = NxCriterion.and(nxCriterion,
                        NxCriterion.montaRestriction(new Filtro(TrocaVaga.DATA_USUARIO_INC, filtroPlantao.getDataInicioIndicadorGestao(), filtroPlantao.getDataFimIndicadorGestao(), true, Filtro.BETWEEN, null)));
            }
        }

        GenericDao<TrocaVaga> genericDao = new GenericDao<>();

        return genericDao.selectCountByFilter(nxCriterion, TrocaVaga.class, propriedades);

    }

    /**
     * @return
     * @throws Exception
     */
    private Integer obterQtdDoacoes(FiltroPlantao filtroPlantao) throws Exception {

        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(CandidatoPlantao.ID));
        propriedades.add(new Propriedade(CandidatoPlantao.DOACAO));
        propriedades.add(new Propriedade(CandidatoPlantao.DATA_USUARIO_INC));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.DOACAO, true, Filtro.EQUAL));

        if (filtroPlantao != null) {
            if (filtroPlantao.getDataInicioIndicadorGestao() != null && filtroPlantao.getDataFimIndicadorGestao() != null) {
                nxCriterion = NxCriterion.and(nxCriterion,
                        NxCriterion.montaRestriction(new Filtro(CandidatoPlantao.DATA_USUARIO_INC, filtroPlantao.getDataInicioIndicadorGestao(), filtroPlantao.getDataFimIndicadorGestao(), true, Filtro.BETWEEN, null)));
            }
        }
        GenericDao<CandidatoPlantao> genericDao = new GenericDao<>();

        return genericDao.selectCountByFilter(nxCriterion, CandidatoPlantao.class, propriedades);

    }
}
