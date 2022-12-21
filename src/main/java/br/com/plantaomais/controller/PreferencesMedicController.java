package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.PreferencesMedic;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.mapper.PreferencesMedicMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.PreferencesMedicVo;
import org.hibernate.Session;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class PreferencesMedicController extends Controller {

    private static final Logger logger = Logger.getLogger(PreferencesMedicController.class.getName());

    private PreferencesLocalityController preferencesLocalityController;

    public <T extends Principal> PreferencesMedicController(T vo) throws AuthenticationException {
        super(vo);
        preferencesLocalityController = new PreferencesLocalityController(vo);
    }

    public PreferencesMedic saveByMedicVo(MedicoVo medicoVo, GenericDao dao) throws Exception {

        if (medicoVo == null || medicoVo.getPreferencesMedic() == null) {
            throw new IllegalArgumentException("PreferencesMedic not valid");
        }

        PreferencesMedicVo preferencesMedicVo = medicoVo.getPreferencesMedic();

        PreferencesMedic preferencesMedic = PreferencesMedicMapper.convertToEntity(preferencesMedicVo);
        Medico medico = MedicoMapper.convertToEntity(medicoVo);

        var vo = findByMedic(medico);
        Session session = dao.getCurrentSession();
        if (vo != null) {
            var preferencesMedicSaved = PreferencesMedicMapper.convertToEntity(vo);
            preferencesMedicSaved.setMedico(medico);
            preferencesMedicSaved.setPreferencesSetor(preferencesMedic.getPreferencesSetor());
            preferencesMedicSaved.setPreferencesWeekday(preferencesMedic.getPreferencesWeekday());
            preferencesMedicSaved.setPreferencesPeriodo(preferencesMedic.getPreferencesPeriodo());

            PreferencesWeekdayController.save(preferencesMedicSaved.getPreferencesWeekday(), dao);
            PreferencesSetorController.save(preferencesMedicSaved.getPreferencesSetor(), dao);
            PreferencesPeriodoController.save(preferencesMedicSaved.getPreferencesPeriodo(), dao);


            session.update(preferencesMedicSaved);

            vo = PreferencesMedicMapper.convertToVo(preferencesMedicSaved);
            vo.setPreferencesLocalities(preferencesMedicVo.getPreferencesLocalities());
            preferencesLocalityController.saveByPreferencesMedic(vo);

        } else {
            preferencesMedic.setMedico(medico);

            PreferencesWeekdayController.save(preferencesMedic.getPreferencesWeekday(), dao);
            PreferencesSetorController.save(preferencesMedic.getPreferencesSetor(), dao);
            PreferencesPeriodoController.save(preferencesMedic.getPreferencesPeriodo(), dao);

            session.save(preferencesMedic);
            preferencesMedicVo.setId(preferencesMedic.getId());
            preferencesLocalityController.saveByPreferencesMedic(preferencesMedicVo);
        }

        return preferencesMedic;
    }

    public PreferencesMedicVo findByMedic(Medico medico) throws Exception {

        if (medico == null || medico.getId() == null) return null;

        GenericDao<PreferencesMedic> dao = new GenericDao<>();

        try {
            List<Propriedade> props = new ArrayList<>();
            props.add(new Propriedade(PreferencesMedic.ID));
            props.add(new Propriedade(PreferencesMedic.PREFERENCES_PERIODO));
            props.add(new Propriedade(PreferencesMedic.PREFERENCES_SETOR));
            props.add(new Propriedade(PreferencesMedic.PREFERENCES_WEEKDAY));

            String aliasMedico = NxCriterion.montaAlias(PreferencesMedic.ALIAS_CLASSE, PreferencesMedic.MEDICO);
            props.add(new Propriedade(Medico.ID, Medico.class, aliasMedico));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medico.getId(), Filtro.EQUAL, aliasMedico));

            PreferencesMedic preferencesMedic = dao.selectUnique(props, PreferencesMedic.class, nxCriterion);
            if (preferencesMedic == null) {
                return null;
            }

            PreferencesMedicVo preferencesMedicVo = PreferencesMedicMapper.convertToVo(preferencesMedic);

            preferencesMedicVo.setPreferencesLocalities(
                    preferencesLocalityController.findVoByPreferencesMedic(preferencesMedic));

            return preferencesMedicVo;
        }
        catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

}
