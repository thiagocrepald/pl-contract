package br.com.plantaomais.controller.aplicativo;

import br.com.nextage.persistence_2.classes.Filtro;
import br.com.nextage.persistence_2.classes.NxCriterion;
import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.controller.Controller;
import br.com.plantaomais.controller.MedicAttachmentController;
import br.com.plantaomais.controller.PaymentDataController;
import br.com.plantaomais.controller.PreferencesMedicController;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.mapper.MedicoMapper;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Constants;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.MedicoAnexoVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.PaymentDataVo;
import br.com.plantaomais.vo.PreferencesMedicVo;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MeuPerfilController extends Controller {
    private static final Logger logger = Logger.getLogger(br.com.plantaomais.controller.EspecialidadeController.class.getName());

    private MedicAttachmentController medicAttachmentController;

    private PreferencesMedicController preferencesMedicController;

    private PaymentDataController paymentDataController;

    public <T extends Principal> MeuPerfilController(T vo) throws AuthenticationException {
        super(vo);
        medicAttachmentController = new MedicAttachmentController(vo);
        preferencesMedicController = new PreferencesMedicController(vo);
        paymentDataController = new PaymentDataController(vo);
    }

    public Info obterInfosCadastro(MedicoVo medicoVo) {
        Info info;
        try {
            if (medicoVo == null || medicoVo.getId() == null) {
                return Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            }
            GenericDao genericDao = new GenericDao();
            MedicoVo retorno = new MedicoVo();

            List<Propriedade> propriedades = new ArrayList<>();
            propriedades.add(new Propriedade(Medico.ID));
            propriedades.add(new Propriedade(Medico.NOME));
            propriedades.add(new Propriedade(Medico.BIRTH_DATE));
            propriedades.add(new Propriedade(Medico.EMAIL));
            propriedades.add(new Propriedade(Medico.TELEFONE));
            propriedades.add(new Propriedade(Medico.SEXO));
            propriedades.add(new Propriedade(Medico.ANEXO_FOTO));
            propriedades.add(new Propriedade(Medico.CADASTRO_COMPLETO));
            propriedades.add(new Propriedade(Medico.OBSERVACOES_VALIDACAO));
//            propriedades.add(new Propriedade(Medico.VALIDADO));
            propriedades.add(new Propriedade(Medico.EMAIL_VALIDADO));
            propriedades.add(new Propriedade(Medico.STATUS));
            propriedades.add(new Propriedade(Medico.TIPO_RECEBIMENTO));
            propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO));
            propriedades.add(new Propriedade(Medico.NUMERO_CRM));
            propriedades.add(new Propriedade(Medico.CRM_ISSUE_DATE));
            propriedades.add(new Propriedade(Medico.BANCO));
            propriedades.add(new Propriedade(Medico.AGENCIA));
            propriedades.add(new Propriedade(Medico.OPERACAO));
            propriedades.add(new Propriedade(Medico.CONTA));
            propriedades.add(new Propriedade(Medico.CPF));
            propriedades.add(new Propriedade(Medico.CNPJ));
            propriedades.add(new Propriedade(Medico.NOME_TITULAR));
            propriedades.add(new Propriedade(Medico.NUMERO_PIS));
            propriedades.add(new Propriedade(Medico.EH_CONTA_EMPRESA));
            propriedades.add(new Propriedade(Medico.ADDRESS));
            propriedades.add(new Propriedade(Medico.NUMERO_CRM_ADICIONAL));
            propriedades.add(new Propriedade(Medico.UF_CONSELHO_MEDICO_ADICIONAL));
            propriedades.add(new Propriedade(Medico.CRM_ADICIONAL_ISSUE_DATE));
            propriedades.add(new Propriedade(Medico.ATTACHMENT));

            NxCriterion nxCriterion = NxCriterion.montaRestriction(new Filtro(Medico.ID, medicoVo.getId(), Filtro.EQUAL));

            Medico medico = (Medico) genericDao.selectUnique(propriedades, Medico.class, nxCriterion);

            if (medico != null) {

                retorno = MedicoMapper.convertToVo(medico);

                List<MedicoAnexoVo> anexos = medicAttachmentController.findAllForCurrentMedic(null);

                //todo check the need of BASE64_ANEXO in this object
                if (anexos != null) {
                    for (MedicoAnexoVo vo: anexos) {
                        vo.setMedico(null);
                        vo.setBase64Anexo(null);
                    }
                    retorno.setListaMedicoAnexo(anexos);
                }

                PreferencesMedicVo preferencesMedic = preferencesMedicController.findByMedic(medico);
                retorno.setPreferencesMedic(preferencesMedic);

                List<PaymentDataVo> paymentDataVo = paymentDataController.findByMedic(medico);
                retorno.setPaymentsData(paymentDataVo);

            } else {
                return Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            }

            info = Info.GetSuccess(Constants.SUCESSO, retorno);
        } catch (Exception e) {
            info = Info.GetError(Constants.ERRO_INTERNO_SISTEMA);
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return info;
    }
}
