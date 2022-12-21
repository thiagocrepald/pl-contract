package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.entitybean.BloqueioMedicoContrato;
import br.com.plantaomais.entitybean.Contract;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.PlantaoVo;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;

/**
 * Created by gmribas on 09/04/20.
 */
public class BloqueioMedicoContratoController {

    private static final Logger logger = Logger.getLogger(BloqueioMedicoContratoController.class.getName());

    public boolean isMedicRelatedToContract(int medicId, int contractId) throws Exception {
        GenericDao<BloqueioMedicoContrato> dao = new GenericDao<>();
        List<Propriedade> props = new ArrayList<>();

        try {
            String aliasContract = NxCriterion.montaAlias(BloqueioMedicoContrato.ALIAS_CLASSE, BloqueioMedicoContrato.CONTRATO);
            props.add(new Propriedade(BloqueioMedicoContrato.ID, BloqueioMedicoContrato.class, aliasContract));
            NxCriterion nxCriterionContract = NxCriterion.montaRestriction(new Filtro(Contract.ID, contractId, Filtro.EQUAL, aliasContract));

            String aliasMedic = NxCriterion.montaAlias(BloqueioMedicoContrato.ALIAS_CLASSE, BloqueioMedicoContrato.MEDICO);
            props.add(new Propriedade(Medico.ID, Medico.class, aliasMedic));
            NxCriterion nxCriterionMedic = NxCriterion.montaRestriction(new Filtro(Medico.ID, medicId, Filtro.EQUAL, aliasMedic));

            NxCriterion nxCriterion = NxCriterion.and(nxCriterionContract, nxCriterionMedic);

            List<BloqueioMedicoContrato> result = dao.listarByFilter(props, null, BloqueioMedicoContrato.class, Constants.NO_LIMIT, nxCriterion);
            return result.size() > 0;
        } catch (Exception e) {
            logger.severe(e.getMessage());
            throw e;
        }
    }


    public List<Medico> getMedicToShift(Integer shiftId) {

        var sqlMedicsOfContract =
                "select m from BloqueioMedicoContrato as bmc inner join bmc.medico as m where " +
                "m.excluido = :excluido and m.excluido <> null and " +
                "m.status like :status and m.cadastroCompleto = :cadastroCompleto and " +
                "bmc.medico.id = m.id and bmc.contrato.id = (" +
                    "select e.contrato.id from Escala e where id = :shiftId" +
                ")";

        return (List<Medico>) getSession()
                .createQuery(sqlMedicsOfContract)
                .setInteger("shiftId", shiftId)
                .setBoolean("excluido", false)
                .setBoolean("cadastroCompleto", true)
                .setString("status", Constants.COMPLETO)
                .list();
    }

    public List<Medico> getMedicsOfContract(Integer contractId) {

        var sqlMedicsOfContract =
                "select m from BloqueioMedicoContrato as bmc inner join bmc.medico as m where " +
                "m.excluido = :excluido and m.excluido <> null and " +
                "m.status like :status and m.cadastroCompleto = :cadastroCompleto and " +
                "bmc.medico.id = m.id and bmc.contrato.id = :contractId order by m.nome";

        return (List<Medico>) getSession()
                .createQuery(sqlMedicsOfContract)
                .setInteger("contractId", contractId)
                .setBoolean("excluido", false)
                .setBoolean("cadastroCompleto", true)
                .setString("status", Constants.COMPLETO)
                .list();
    }

    public List<Medico> getMedicIdsOfContractWithSpecialty(Integer contractId, List<Integer> specialtyId) {

        List<Integer> medicIds = this.getMedicsOfContract(contractId)
                .stream()
                .map(Medico::getId)
                .collect(Collectors.toList());

        if (Util.isNullOrEmpty(medicIds)) {

            return new ArrayList<>();
        }

        var sqlMedicsOfContractWithSpecialty =
                "select me.medico from MedicoEspecialidade me where " +
                "me.especialidade.id in (:specialtyId) and " +
                "me.medico.id in (:medicIds) order by me.medico.nome";;

        var medicsWithSpecialty = (List<Medico>) getSession()
                .createQuery(sqlMedicsOfContractWithSpecialty)
                .setParameterList("specialtyId", specialtyId)
                .setParameterList("medicIds", medicIds)
                .list();

        return medicsWithSpecialty;
    }

    public List<MedicoVo> findMedicOfContractWithSpecialty(PlantaoVo plantaoVo) {
        Long contractId = (long) getSession().createQuery("select e.contrato.id from Escala e where e.id = :id")
                .setInteger("id", plantaoVo.getEscala().getId())
                .uniqueResult();

        List<Integer> specialtyId = (List<Integer>) getSession()
                .createQuery("select pe.especialidade.id from PlantaoEspecialidade pe where pe.plantao.id = :id")
                .setInteger("id", plantaoVo.getId())
                .list();

        List<Integer> specialtiesDefault = (List<Integer>) getSession()
                .createQuery("select e.id from Especialidade e where e.descricao = :desc or e.descricao = :desc2 or e.descricao = :desc3")
                .setString("desc", "CLÍNICO GERAL")
                .setString("desc2", "CLÍNICO GERAL/PEDIATRIA")
                .setString("desc3", "CLÍNICO GERAL/GINECOLOGIA")
                .list();

        List<Medico> medics = specialtyId.stream().anyMatch(it -> specialtiesDefault.contains(it))
                ? this.getMedicsOfContract(contractId.intValue())
                : this.getMedicIdsOfContractWithSpecialty(contractId.intValue(), specialtyId);

        return medics.stream()
                .map(m -> {
                    MedicoVo medicoVo = new MedicoVo();
                    medicoVo.setId(m.getId());
                    medicoVo.setNome(m.getNome());

                    return medicoVo;
                })
                .collect(Collectors.toList());
    }
}
