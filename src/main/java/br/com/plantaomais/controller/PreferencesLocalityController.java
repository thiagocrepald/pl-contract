package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.PreferencesLocality;
import br.com.plantaomais.entitybean.PreferencesMedic;
import br.com.plantaomais.mapper.PreferencesLocalityMappper;
import br.com.plantaomais.mapper.PreferencesMedicMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.vo.PreferencesLocalityVo;
import br.com.plantaomais.vo.PreferencesMedicVo;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class PreferencesLocalityController extends Controller {

    private static final Logger logger = Logger.getLogger(PreferencesLocalityController.class.getName());

    public <T extends Principal> PreferencesLocalityController(T vo) throws AuthenticationException {
        super(vo);
    }

    public void saveByPreferencesMedic(PreferencesMedicVo preferencesMedicVo) throws Exception {
        if (preferencesMedicVo == null || preferencesMedicVo.getPreferencesLocalities() == null) {
            throw new IllegalArgumentException("PreferencesLocality not valid");
        }

        PreferencesMedic preferencesMedic = PreferencesMedicMapper.convertToEntity(preferencesMedicVo);
        List<PreferencesLocality> oldLocalities  = this.findByPreferencesMedic(preferencesMedic);

        List<PreferencesLocalityVo> preferencesLocalitiesVo = preferencesMedicVo.getPreferencesLocalities();

        GenericDao<PreferencesLocality> dao = new GenericDao<>();

        dao.beginTransaction();

        for (PreferencesLocalityVo localityVo : preferencesLocalitiesVo) {

            PreferencesLocality locality = oldLocalities.stream()
                    .filter(l -> l.getState().getAcronym().equals(localityVo.getState().getAcronym()))
                    .findFirst()
                    .orElse(null);

            if (locality != null) {
                locality.setCountryside(localityVo.getCountryside());
                locality.setCoastal(localityVo.getCoastal());
                locality.setCapital(localityVo.getCapital());

                List<Propriedade> props = new ArrayList<>();
                props.add(new Propriedade(PreferencesLocality.CAPITAL));
                props.add(new Propriedade(PreferencesLocality.COASTAL));
                props.add(new Propriedade(PreferencesLocality.COUNTRYSIDE));

                dao.updateWithCurrentTransaction(locality, props);
            }
            else {
                PreferencesLocality newLocality = PreferencesLocalityMappper.convertToEntity(localityVo);

                newLocality.setPreferencesMedic(preferencesMedic);

                dao.persistWithCurrentTransaction(newLocality);
            }
        }

        for (PreferencesLocality oldLocality : oldLocalities) {
            boolean contains = preferencesLocalitiesVo.stream().anyMatch(newLocality ->
                    newLocality.getState().getAcronym().equals(oldLocality.getState().getAcronym()));

            if (!contains) {
                dao.deleteWithCurrentTransaction(oldLocality);
            }

        }

        dao.commitCurrentTransaction();
    }

    public List<PreferencesLocalityVo> findVoByPreferencesMedic(PreferencesMedic preferencesMedic) throws Exception {
        return PreferencesLocalityMappper.convertToListVo(
                this.findByPreferencesMedic(preferencesMedic));
    }

    public List<PreferencesLocality> findByPreferencesMedic(PreferencesMedic preferencesMedic) throws Exception {

        if (preferencesMedic == null || preferencesMedic.getId() == null) return null;

        GenericDao<PreferencesLocality> dao = new GenericDao<>();

        try {
            List<Propriedade> props = new ArrayList<>();
            props.add(new Propriedade(PreferencesLocality.ID));
            props.add(new Propriedade(PreferencesLocality.CAPITAL));
            props.add(new Propriedade(PreferencesLocality.COASTAL));
            props.add(new Propriedade(PreferencesLocality.COUNTRYSIDE));
            props.add(new Propriedade(PreferencesLocality.STATE));

            String alias = NxCriterion.montaAlias(PreferencesLocality.ALIAS_CLASSE, PreferencesLocality.PREFERENCES_MEDIC);
            props.add(new Propriedade(PreferencesMedic.ID, PreferencesMedic.class, alias));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(PreferencesMedic.ID, preferencesMedic.getId(), Filtro.EQUAL, alias));

            return dao.listarByFilter(props, null, PreferencesLocality.class, Constants.NO_LIMIT, nxCriterion);
        }
        catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }
    }

}
