package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.MedicoAnexo;
import br.com.plantaomais.entitybean.MedicoCurso;
import br.com.plantaomais.mapper.MedicoCursoMapper;
import br.com.plantaomais.mapper.UsuarioMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.MedicoAnexoVo;
import br.com.plantaomais.vo.MedicoCursoVo;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class MedicoCursoController extends Controller {

    private static final Logger logger = Logger.getLogger(MedicoCursoController.class.getName());

    private MedicoController medicoController;

    public <T extends Principal> MedicoCursoController(T vo) throws AuthenticationException {
        super(vo);
        medicoController = new MedicoController(vo);
    }

    public List<MedicoCursoVo> listarMedicoCursosComAnexo() throws Exception {
        if (this.medico == null) {
            throw new IllegalAccessException("medico context not found.");
        }

        GenericDao dao = new GenericDao<>();

        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(MedicoCurso.ID));
        propriedades.add(new Propriedade(MedicoCurso.CURSO));
        propriedades.add(new Propriedade(MedicoCurso.DATA_VENCIMENTO));

        String aliasMedico = NxCriterion.montaAlias(MedicoCurso.ALIAS_CLASSE, MedicoCurso.MEDICO);
        propriedades.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

        NxCriterion nxCriterionCurso = NxCriterion.montaRestriction(new Filtro(Medico.ID, this.medico.getId(), Filtro.EQUAL, aliasMedico));

        List<MedicoCurso> listaMedicoCurso = dao.listarByFilter(propriedades, null, MedicoCurso.class, Constants.NO_LIMIT, nxCriterionCurso);

        List<MedicoAnexoVo> listaAnexosCurso = medicoController.listarMedicoAnexoPorMedicoCampoAnexo(this.medico.getId(), 10, true);

        return MedicoCursoMapper.convertToListVo(listaMedicoCurso).stream()
                .peek(medicoCursoVo -> {
                    MedicoAnexoVo medicoAnexoVo = listaAnexosCurso.stream()
                            .filter(anexo -> anexo.getMedicoCurso().getCurso().equals(medicoCursoVo.getCurso()))
                            .findFirst().orElse(null);
                    medicoCursoVo.setMedicoAnexo(medicoAnexoVo);
                })
                .collect(Collectors.toList());
    }

    public List<MedicoCursoVo> findByMedic(Medico medico) throws Exception {

        if (medico == null || medico.getId() == null) return null;

        GenericDao<MedicoCurso> dao = new GenericDao<>();

        List<Propriedade> props = new ArrayList<>();
        props.add(new Propriedade(MedicoCurso.ID));
        props.add(new Propriedade(MedicoCurso.CURSO));
        props.add(new Propriedade(MedicoCurso.DATA_VENCIMENTO));
        props.add(new Propriedade(MedicoCurso.MEDICO));

        String aliasMedico = NxCriterion.montaAlias(MedicoCurso.ALIAS_CLASSE, MedicoCurso.MEDICO);
        props.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

        NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medico.getId(), Filtro.EQUAL, aliasMedico));

        List<MedicoCurso> medicoCurso = dao.listarByFilter(props, null, MedicoCurso.class, Constants.NO_LIMIT, nxCriterion);

        return MedicoCursoMapper.convertToListVo(medicoCurso);
    }

    public MedicoCurso salvar(MedicoCurso medicoCurso) throws Exception {

        GenericDao<MedicoCurso> genericDao = new GenericDao<>();
        genericDao.beginTransaction();

        if (medicoCurso.getMedico() == null) {
            medicoCurso.setMedico(this.medico);
        }

        if (medicoCurso.getId() != null) {
            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(MedicoCurso.ID));
            propriedades.add(new Propriedade(MedicoCurso.CURSO));
            propriedades.add(new Propriedade(MedicoCurso.MEDICO));
            propriedades.add(new Propriedade(MedicoCurso.DATA_VENCIMENTO));

            genericDao.updateWithCurrentTransaction(medicoCurso, propriedades);
        } else {
            genericDao.persistWithCurrentTransaction(medicoCurso);
        }

        genericDao.commitCurrentTransaction();

        return medicoCurso;
    }

    public MedicoCursoVo salvar(MedicoCursoVo vo) throws Exception {

        MedicoCurso medicoCurso = this.salvar(MedicoCursoMapper.convertToEntity(vo));

        vo.setId(medicoCurso.getId());

        return MedicoCursoMapper.convertToVo(medicoCurso);
    }

    public Info excluir(MedicoCursoVo vo) {

        GenericDao<MedicoCurso> dao = new GenericDao<>();

        List<Propriedade> propriedades = new ArrayList<>();
        propriedades.add(new Propriedade(MedicoCurso.ID));

        try {
            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(MedicoCurso.ID, vo.getId(), Filtro.EQUAL));
            MedicoCurso medicoCurso = dao.selectUnique(propriedades, MedicoCurso.class, nxCriterion);

            MedicAttachmentController medicAttachmentController = new MedicAttachmentController(UsuarioMapper.convertToVo(this.usuario));

            List<MedicoAnexo> medicoAnexos = medicAttachmentController.findByMedicoCurso(medicoCurso.getId());

            medicAttachmentController.excluir(medicoAnexos);
            dao.delete(medicoCurso);
        }
        catch (Exception e) {

            return Info.GetError("Erro ao excluir curso do médico.");
        }

        return Info.GetSuccess("Curso excluido.");
    }

}
