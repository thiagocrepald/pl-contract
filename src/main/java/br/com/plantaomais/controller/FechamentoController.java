package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.NxOrder;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.nextage.util.RelatorioBean;
import br.com.nextage.util.RelatorioUtil;
import br.com.nextage.util.Util;
import br.com.plantaomais.entitybean.Escala;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.filtro.FiltroFechamento;
import br.com.plantaomais.mapper.PlantaoMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.ArquivoVo;
import br.com.plantaomais.vo.FechamentBaseVO;
import br.com.plantaomais.vo.FechamentoPorEscalaVo;
import br.com.plantaomais.vo.FechamentoPorMedicoVo;
import br.com.plantaomais.vo.FechamentoVo;
import br.com.plantaomais.vo.PlantaoVo;
import br.com.plantaomais.vo.UsuarioVo;
import org.joda.time.LocalDate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.Principal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by nextage on 04/07/2019.
 */
public class FechamentoController extends Controller {

    private static final Logger logger = Logger.getLogger(FechamentoController.class.getName());

    private final PlantaoSetorController plantaoSetorController;

    public <T extends Principal> FechamentoController(T vo) throws AuthenticationException {
        super(vo);
        plantaoSetorController = new PlantaoSetorController();
    }

    public FechamentoController(UsuarioVo vo) throws AuthenticationException {
        super(vo);
        plantaoSetorController = new PlantaoSetorController();
    }

    public FechamentoVo listar(FiltroFechamento filtro) {
        List<PlantaoVo> listaVo;
        FechamentoVo fechamentoVo = new FechamentoVo();
        fechamentoVo.setCargaHorariaTotal(0d);
        fechamentoVo.setValorBrutoTotal(0d);

        if (filtro == null) {
            return fechamentoVo;
        }

        if (filtro.getEscala() != null) {
            fechamentoVo.setLayout(1);
        } else {
            fechamentoVo.setLayout(2);
        }

        try {
            GenericDao<Plantao> dao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Plantao.ID));
            propriedades.add(new Propriedade(Plantao.VALOR));
            propriedades.add(new Propriedade(Plantao.HORA_FIM));
            propriedades.add(new Propriedade(Plantao.HORA_INICIO));
            propriedades.add(new Propriedade(Plantao.DATA));
            propriedades.add(new Propriedade(Plantao.VALOR));
            propriedades.add(new Propriedade(Plantao.STATUS));
            propriedades.add(new Propriedade(Plantao.TURNO));

            String aliasMedico = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.MEDICO);
            propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));
            propriedades.add(new Propriedade(Medico.NOME, Medico.class, aliasMedico));

            String aliasEscala = NxCriterion.montaAlias(Plantao.ALIAS_CLASSE, Plantao.ESCALA);
            propriedades.add(new Propriedade(Escala.ID, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.PERIODO_INICIO, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.PERIODO_FIM, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.NOME_ESCALA, Escala.class, aliasEscala));
            propriedades.add(new Propriedade(Escala.EXCLUIDO, Escala.class, aliasEscala));

            NxCriterion nxCriterion = NxCriterion.or(
                    NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, false, Filtro.EQUAL)),
                    NxCriterion.montaRestriction(new Filtro(Plantao.EXCLUIDO, null, Filtro.IS_NULL)));

            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.or(
                    NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, false, Filtro.EQUAL, aliasEscala)),
                    NxCriterion.montaRestriction(new Filtro(Escala.EXCLUIDO, null, Filtro.IS_NULL, aliasEscala))));

            if (filtro.getEscala() != null && filtro.getEscala().getId() != null) {
                nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Escala.ID, filtro.getEscala().getId(), Filtro.EQUAL, aliasEscala)));
            }

            NxCriterion nxCriterionAux;
            if (filtro.getMedico() != null) {
                nxCriterionAux = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.ID, filtro.getMedico().getId(), Filtro.EQUAL, aliasMedico)));
            } else {
                nxCriterionAux = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Medico.ID, null, Filtro.NOT_NULL, aliasMedico)));
            }

            nxCriterion = NxCriterion.and(nxCriterion, nxCriterionAux);

            nxCriterion = NxCriterion.and(nxCriterion, NxCriterion.montaRestriction(new Filtro(Plantao.STATUS, Constants.STATUS_PLANTAO_A_CONFIRMAR, Filtro.NOT_EQUAL)));

            //Filtro por período
            if (filtro.getDataInicio() != null && filtro.getDataFim() != null) {
                nxCriterion = NxCriterion.and(nxCriterion,
                        NxCriterion.montaRestriction(new Filtro(Plantao.DATA, filtro.getDataInicio(), filtro.getDataFim(), true, Filtro.BETWEEN, null)));

            }

            List<NxOrder> nxOrders = Arrays.asList(new NxOrder(Plantao.DATA, NxOrder.NX_ORDER.DESC), new NxOrder(Plantao.MEDICO, NxOrder.NX_ORDER.ASC));

            List<Plantao> lista = dao.listarByFilter(propriedades, nxOrders, Plantao.class, Constants.NO_LIMIT, nxCriterion);
            listaVo = PlantaoMapper.convertToListVo(lista);

            double valorBrutoTotal = 0;
            double totalCargaHoraria = 0;
            List<FechamentoPorMedicoVo> listFechamentoPorMedico = new ArrayList<>();
            List<FechamentoPorEscalaVo> listFechamentoPorEscala = new ArrayList<>();

            for (PlantaoVo plantaoVo : listaVo) {

                Date horaInicioDate = br.com.plantaomais.util.Util.copyTimeToDate(LocalDate.now().toDate(), plantaoVo.getHoraInicio());
                Date horaFimDate = br.com.plantaomais.util.Util.copyTimeToDate(LocalDate.now().toDate(), plantaoVo.getHoraFim());
                double numberOfMinuts;
                if (Util.compareDateTo(horaFimDate, horaInicioDate) == -1) {
                    numberOfMinuts = Duration.between(horaInicioDate.toInstant(), horaFimDate.toInstant()).toMinutes() + 1440;
                } else {
                    numberOfMinuts = Duration.between(horaInicioDate.toInstant(), horaFimDate.toInstant()).toMinutes();
                }

                Double horas = (numberOfMinuts / 60);
                // arredonda a 1 casa depois da virgula para cima
                BigDecimal bd = new BigDecimal(Double.toString(horas));
                bd = bd.setScale(1, RoundingMode.HALF_UP);
                //converte para double
                Double cargaHorariaArredondado = bd.doubleValue();

                DateFormat df = new SimpleDateFormat("hh:mm a");
                String horaInicio = df.format(plantaoVo.getHoraInicio());
                DateFormat df1 = new SimpleDateFormat("hh:mm a");
                String horaFim = df1.format(plantaoVo.getHoraFim());


                totalCargaHoraria += cargaHorariaArredondado;
                valorBrutoTotal += plantaoVo.getValor();


                FechamentBaseVO baseVO = new FechamentBaseVO();
                baseVO.setValorBruto(plantaoVo.getValor());
                baseVO.setTurno(plantaoVo.getTurno());
                baseVO.setSetor(getSetorString(plantaoVo));
                baseVO.setHoraInicio(horaInicio);
                baseVO.setHoraFim(horaFim);

                if (filtro.getEscala() != null) {
                    /*
                     * Escala
                     */
                    FechamentoPorEscalaVo fechamentoPorEscala = new FechamentoPorEscalaVo(baseVO);
                    fechamentoPorEscala.setMedico(plantaoVo.getMedico());
                    fechamentoPorEscala.setData(plantaoVo.getData());
                    fechamentoPorEscala.setCargaHoraria(cargaHorariaArredondado);

                    listFechamentoPorEscala.add(fechamentoPorEscala);


                } else {
                    /*
                     * Medico
                     */
                    FechamentoPorMedicoVo fechamentoPorMedico = new FechamentoPorMedicoVo(baseVO);
                    fechamentoPorMedico.setNomeEscala(plantaoVo.getEscala().getNomeEscala());
                    fechamentoPorMedico.setPlantao(plantaoVo);
                    fechamentoPorMedico.setData(plantaoVo.getData());
                    fechamentoPorMedico.setDuracaoPlantao(cargaHorariaArredondado);

                    listFechamentoPorMedico.add(fechamentoPorMedico);
                }
            }

            fechamentoVo.setCargaHorariaTotal(totalCargaHoraria);
            fechamentoVo.setValorBrutoTotal(valorBrutoTotal);
            fechamentoVo.setListaFechamentoPorMedico(listFechamentoPorMedico);
            fechamentoVo.setListaFechamentoPorEscala(listFechamentoPorEscala);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }

        return fechamentoVo;
    }

    private String getSetorString(PlantaoVo vo) throws Exception {
        List<String> setores = new ArrayList<>();

        plantaoSetorController
                .getSetoresDoPlantao(vo.getId())
                .forEach(s -> {
                    if (!setores.contains(s.getDescricao())) {
                        setores.add(s.getDescricao());
                    }
                });

        return String.join(", ", setores);
    }

    /**
     * @param filtro
     * @return
     */
    public ArquivoVo gerarExcel(FiltroFechamento filtro) {
        ArquivoVo arquivoVo = new ArquivoVo();

        FechamentoVo fechamentoVo = listar(filtro);

        if (!br.com.plantaomais.util.Util.isNullOrEmpty(fechamentoVo.getListaFechamentoPorMedico())) {
            Map<String, String> mapItens = new HashMap<>();
            int cont = 0;


            mapItens.put(FechamentoPorMedicoVo.NOME_ESCALA, cont++ + ":" + "Nome da Escala:");
            mapItens.put(FechamentoPorMedicoVo.DATA, cont++ + ":" + "Data:");
            mapItens.put(FechamentoPorMedicoVo.HORA_INICIO, cont++ + ":" + "Horário de Início:");
            mapItens.put(FechamentoPorMedicoVo.HORA_FIM, cont++ + ":" + "Horário Fim:");
            mapItens.put(FechamentoPorMedicoVo.DURACAO_PLANTAO, cont++ + ":" + "Duração Plantão:");
            mapItens.put(FechamentoPorMedicoVo.VALOR_BRUTO, cont++ + ":" + "Valor:");


            Map<String, Boolean> mapTotais = new HashMap<>();
            mapTotais.put(FechamentoPorMedicoVo.DURACAO_PLANTAO, true);
            mapTotais.put(FechamentoPorMedicoVo.VALOR_BRUTO, true);


            RelatorioBean relatorioBean = new RelatorioBean();
            relatorioBean.setItens(fechamentoVo.getListaFechamentoPorMedico());
            relatorioBean.setItem(fechamentoVo);
            relatorioBean.setMapaTemTotal(mapTotais);
            relatorioBean.setTemTotal(true);
            relatorioBean.setMapaListaItens(mapItens);
            relatorioBean.setTitulo("MÉDICO: " + filtro.getNomeMedico());
            relatorioBean.setTipo(RelatorioBean.TipoRelatorio.XLS);
            relatorioBean.setNome("FECHAMENTO_MÉDICO_" + filtro.getNomeMedico() + ".xls");

            RelatorioUtil relatorioUtil = new RelatorioUtil();
            byte[] conteudoRelatorio = relatorioUtil.geraRelatorio(relatorioBean);
            arquivoVo.setArquivo(conteudoRelatorio);
            arquivoVo.setNmAnexo(relatorioBean.getNome());

        } else if (!br.com.plantaomais.util.Util.isNullOrEmpty(fechamentoVo.getListaFechamentoPorEscala())) {
            Map<String, String> mapItens = new HashMap<>();
            int cont = 0;


            mapItens.put(FechamentoPorEscalaVo.MEDICO, cont++ + ":" + "Médico:");
            mapItens.put(FechamentoPorEscalaVo.CARGA_HORARIA, cont++ + ":" + "Carga Horária:");
            mapItens.put(FechamentoPorEscalaVo.VALOR_BRUTO, cont++ + ":" + "Valor Bruto:");

            Map<String, Boolean> mapTotais = new HashMap<>();
            mapTotais.put(FechamentoPorEscalaVo.CARGA_HORARIA, true);
            mapTotais.put(FechamentoPorEscalaVo.VALOR_BRUTO, true);


            RelatorioBean relatorioBean = new RelatorioBean();
            relatorioBean.setItens(fechamentoVo.getListaFechamentoPorEscala());
            relatorioBean.setItem(fechamentoVo);
            relatorioBean.setMapaTemTotal(mapTotais);
            relatorioBean.setTemTotal(true);
            relatorioBean.setMapaListaItens(mapItens);
            relatorioBean.setTitulo("ESCALA: " + filtro.getEscala().getNomeEscala());
            relatorioBean.setTipo(RelatorioBean.TipoRelatorio.XLS);
            relatorioBean.setNome("ESCALA_" + filtro.getEscala().getNomeEscala() + ".xls");

            RelatorioUtil relatorioUtil = new RelatorioUtil();
            byte[] conteudoRelatorio = relatorioUtil.geraRelatorio(relatorioBean);
            arquivoVo.setArquivo(conteudoRelatorio);
            arquivoVo.setNmAnexo(relatorioBean.getNome());
        }
        return arquivoVo;
    }
}
