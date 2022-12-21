package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.City;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.entitybean.MobileVersion;
import br.com.plantaomais.mapper.MobileVersionMapper;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.MobileVersionVo;
import javassist.NotFoundException;
import org.hibernate.Session;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;

public class MobileVersionController {

    private static final Logger logger = Logger.getLogger(MobileVersionController.class.getName());

    public Info findVersion() throws Exception {
        try {
            var list = (List<MobileVersion>) getSession().createQuery(
                            "select mv from MobileVersion mv")
                    .list();
            var mobileVersionOptional = list.stream().findFirst();
            if (mobileVersionOptional.isPresent()) {
                var vo = MobileVersionMapper.convertToVo(mobileVersionOptional.get());
                return Info.GetSuccess(vo);
            } else {
                return Info.GetError("No versions found, please create one");
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            throw e;
        }

    }

    public Info createOrUpdateMobileVersion(MobileVersionVo vo) throws Exception {

        Info info;
        GenericDao<City> dao = new GenericDao<>();
        dao.beginTransaction();
        Session session = dao.getCurrentSession();

        try {
            var list = (List<MobileVersion>) dao.getCurrentSession().createQuery(
                            "select mv from MobileVersion mv")
                    .list();

            var mobileVersionOptional = list.stream().findFirst();

            List<Propriedade> propriedades = new ArrayList<>();

            propriedades.add(new Propriedade(MobileVersion.ID));
            if (vo.getIosVersion() != null) {
                propriedades.add(new Propriedade(MobileVersion.IOS_VERSION));
            }
            if (vo.getAndroidVersion() != null) {
                propriedades.add(new Propriedade(MobileVersion.ANDROID_VERSION));
            }

            if (mobileVersionOptional.isPresent()) {
                var mobileVersion = mobileVersionOptional.get();
                Optional.ofNullable(vo.getIosVersion()).ifPresent(mobileVersion::setIosVersion);
                Optional.ofNullable(vo.getAndroidVersion()).ifPresent(mobileVersion::setAndroidVersion);
                dao.updateWithCurrentTransaction(mobileVersion, propriedades);
                var newVo = MobileVersionMapper.convertToVo(mobileVersion);
                info = Info.GetSuccess(newVo);
            } else {
                var mobileVersion = new MobileVersion();
                Optional.ofNullable(vo.getIosVersion()).ifPresent(mobileVersion::setIosVersion);
                Optional.ofNullable(vo.getAndroidVersion()).ifPresent(mobileVersion::setAndroidVersion);
                dao.persistWithCurrentTransaction(mobileVersion);
                var newVo = MobileVersionMapper.convertToVo(mobileVersion);
                info = Info.GetSuccess(newVo);
            }

            dao.commitCurrentTransaction();
        } catch (Exception e) {
            logger.log(Level.SEVERE, e.toString(), e);
            info = Info.GetError("Error on saving mobile version");
        }

        return info;
    }
}
