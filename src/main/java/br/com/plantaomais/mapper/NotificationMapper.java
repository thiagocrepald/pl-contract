package br.com.plantaomais.mapper;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Especialidade;
import br.com.plantaomais.entitybean.Notification;
import br.com.plantaomais.entitybean.Plantao;
import br.com.plantaomais.entitybean.PlantaoEspecialidade;
import br.com.plantaomais.entitybean.PlantaoSetor;
import br.com.plantaomais.entitybean.Setor;
import br.com.plantaomais.mapper.aplicativo.TrocaVagaMapper;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.ContratoVo;
import br.com.plantaomais.vo.EscalaVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.NotificationVo;
import br.com.plantaomais.vo.PlantaoVo;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class NotificationMapper {

    private static final Logger logger = Logger.getLogger(Notification.class.getName());

    public static NotificationVo convertToVo(Notification entity) {
        NotificationVo vo = null;
        if (entity != null) {
            vo = new NotificationVo.Builder()
                    .setId(entity.getId())
                    .setMessage(entity.getMessage())
                    .setDate(Util.converterDataTimeZone(entity.getDate()))
                    .setType(entity.getType())
                    .setStatus(entity.getStatus())
                    .create();


            if (entity.getEscala() != null) {
                EscalaVo escala = EscalaMapper.convertToVo(entity.getEscala());
                ContratoVo contratoVo = new ContratoVo();
                contratoVo.setId(escala.getContrato().getId());
//                contratoVo.setLocal(escala.getContrato().getLocal());
//                contratoVo.setCidade(escala.getContrato().getCidade());
//                contratoVo.setEstado(escala.getContrato().getEstado());

                escala.setContrato(contratoVo);
                escala.setCoordenador(null);
                vo.setEscala(escala);
            }

            if (entity.getPlantao() != null) {
                PlantaoVo plantao = PlantaoMapper.convertToVo(entity.getPlantao());
                if (plantao.getMedico() != null) {
                    MedicoVo medicoVo = new MedicoVo();
                    medicoVo.setId(plantao.getMedico().getId());
                    medicoVo.setNome(plantao.getMedico().getNome());
                    plantao.setMedico(medicoVo);
                }

                ContratoVo contratoVo = new ContratoVo();
                contratoVo.setId(plantao.getEscala().getContrato().getId());
//                contratoVo.setLocal(plantao.getEscala().getContrato().getLocal());
//                contratoVo.setCidade(plantao.getEscala().getContrato().getCidade());
//                contratoVo.setEstado(plantao.getEscala().getContrato().getEstado());

                plantao.getEscala().setContrato(contratoVo);
                plantao.getEscala().setCoordenador(null);

                List<PlantaoSetor> setoresPlantao = obterSetoresPlantao(entity.getPlantao());
                List<Especialidade> especialidadesPlantao = obterEspecialidadesPlantao(entity.getPlantao());
                plantao.setListaSetores(PlantaoSetorMapper.convertToListVo(setoresPlantao));
                plantao.setListaEspecialidades(EspecialidadeMapper.convertToListVo(especialidadesPlantao));

                vo.setPlantao(plantao);
            }

            vo.setTrocaVaga(TrocaVagaMapper.convertToVo(entity.getTrocaVaga()));

            //mapper verifies nullability
            vo.setEvent(EventMapper.toVO(entity.getEvent()));

            vo.setCandidatoPlantao(CandidatoPlantaoMapper.convertToVo(entity.getCandidatoPlantao()));
        }
        return vo;
    }


    public static List<NotificationVo> convertToListVo(List<Notification> listEntity) {
        List<NotificationVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Notification entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    public static Notification convertToEntity(NotificationVo vo) {
        Notification entity = null;
        if (vo != null) {
            entity = new Notification();

            entity.setId(vo.getId());
            entity.setMedico(MedicoMapper.convertToEntity(vo.getMedico()));
            entity.setMessage(vo.getMessage());
            entity.setDate(vo.getDate());
            entity.setType(vo.getType());
            entity.setStatus(vo.getStatus());
            entity.setEscala(EscalaMapper.convertToEntity(vo.getEscala()));
            entity.setPlantao(PlantaoMapper.convertToEntity(vo.getPlantao()));
            entity.setCandidatoPlantao(CandidatoPlantaoMapper.convertToEntity(vo.getCandidatoPlantao()));
            entity.setEvent(EventMapper.toEntity(vo.getEvent()));
            entity.setTrocaVaga(TrocaVagaMapper.convertToEntity(vo.getTrocaVaga()));
        }
        return entity;
    }

    public static List<Notification> convertToListEntity(List<NotificationVo> listVo) {
        List<Notification> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (NotificationVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }


    private static List<Especialidade> obterEspecialidadesPlantao(Plantao plantao) {
        List<Especialidade> listaEspecialidades = new ArrayList<>();
        try {
            GenericDao<PlantaoEspecialidade> dao = new GenericDao();
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(PlantaoEspecialidade.ID));

            String aliasPlantao = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            String aliasEspecialidade = NxCriterion.montaAlias(PlantaoEspecialidade.ALIAS_CLASSE, PlantaoEspecialidade.ESPECIALIDADE);
            propriedades.add(new Propriedade(Especialidade.ID, Especialidade.class, aliasEspecialidade));
            propriedades.add(new Propriedade(Especialidade.DESCRICAO, Especialidade.class, aliasEspecialidade));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantao.getId(), Filtro.EQUAL, aliasPlantao));

            List<PlantaoEspecialidade> lista = dao.listarByFilter(propriedades, null, PlantaoEspecialidade.class, Constants.NO_LIMIT, nxCriterion);

            for (PlantaoEspecialidade plantaoEspecialidade : lista) {
                listaEspecialidades.add(plantaoEspecialidade.getEspecialidade());
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
        }
        return listaEspecialidades;
    }

    private static List<PlantaoSetor> obterSetoresPlantao(Plantao plantao) {
        List<PlantaoSetor> listaPlantaoSetor = new ArrayList<>();
        try {
            GenericDao<PlantaoSetor> genericDao = new GenericDao<>();

            List<Propriedade> propriedades = new ArrayList<>();

            propriedades.add(new Propriedade(PlantaoSetor.ID));

            String aliasPlantao = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.PLANTAO);
            propriedades.add(new Propriedade(Plantao.ID, Plantao.class, aliasPlantao));

            String aliasSetor = NxCriterion.montaAlias(PlantaoSetor.ALIAS_CLASSE, PlantaoSetor.SETOR);
            propriedades.add(new Propriedade(Setor.ID, Setor.class, aliasSetor));
            propriedades.add(new Propriedade(Setor.DESCRICAO, Setor.class, aliasSetor));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Plantao.ID, plantao.getId(), Filtro.EQUAL, aliasPlantao));

            listaPlantaoSetor = genericDao.listarByFilter(propriedades, null, PlantaoSetor.class, -1, nxCriterion);

        } catch (Exception e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return listaPlantaoSetor;
    }
}
