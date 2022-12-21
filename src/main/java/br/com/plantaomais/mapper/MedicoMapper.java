package br.com.plantaomais.mapper;

import br.com.plantaomais.entitybean.Address;
import br.com.plantaomais.entitybean.Medico;
import br.com.plantaomais.util.Util;
import br.com.plantaomais.vo.MedicoExportarVo;
import br.com.plantaomais.vo.MedicoSimpleVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.aplicativo.MedicoPlantaoSimpleVo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by nextage on 04/06/2019.
 */
public class MedicoMapper {

    /*
     **
     * Convert an entity to MedicoVo
     *
     * @param entity Medico
     * @return MedicoVo
     */
    public static MedicoVo convertToVo(Medico entity) {
        MedicoVo vo = null;
        if (entity != null) {
            vo = new MedicoVo();
            vo.setId(entity.getId());
            vo.setNome(entity.getNome());
            vo.setSenha(entity.getSenha());
            vo.setEmail(entity.getEmail());
            vo.setTelefone(entity.getTelefone());
            vo.setUfConselhoMedico(entity.getUfConselhoMedico());
            vo.setSexo(entity.getSexo());
            vo.setTokenPushNotification(entity.getTokenPushNotification());
            vo.setVersaoLogin(entity.getVersaoLogin());

            if (!Util.isNullOrEmpty(entity.getAnexoFoto())) {
                vo.setAnexoFoto(Util.byteToBase64String(entity.getAnexoFoto()));
            }
            vo.setNomeAnexoFoto(entity.getNomeAnexoFoto());
            vo.setTipoAnexoFoto(entity.getTipoAnexoFoto());

            vo.setValidado(entity.getValidado());
            vo.setObservacoesValidacao(entity.getObservacoesValidacao());
            vo.setEhContaEmpresa(entity.getEhContaEmpresa());
            vo.setTipoRecebimento(entity.getTipoRecebimento());

            vo.setBanco(entity.getBanco());
            vo.setAgencia(entity.getAgencia());
            vo.setOperacao(entity.getOperacao());
            vo.setConta(entity.getConta());
            vo.setCpf(entity.getCpf());
            vo.setCnpj(entity.getCnpj());
            vo.setNomeTitular(entity.getNomeTitular());
            vo.setNumeroPis(entity.getNumeroPis());
            vo.setStatus(entity.getStatus());
            vo.setCadastroCompleto(entity.getCadastroCompleto());

            vo.setEmailValidado(entity.getEmailValidado());
            vo.setNumeroCrm(entity.getNumeroCrm());
            vo.setStatus(entity.getStatus());
            vo.setDataUltimoLogin(entity.getDataUltimoLogin());

            vo.setDataAlteracaoSenha(entity.getDataAlteracaoSenha());
            vo.setDataExpiracaoToken(entity.getDataExpiracaoToken());
            vo.setMedicoAcesso(entity.getMedicoAcesso());
            vo.setAtivo(entity.getAtivo());

            vo.setBirthDate(entity.getBirthDate());
            vo.setCrmIssueDate(entity.getCrmIssueDate());
            vo.setCrmAdicionalIssueDate(entity.getCrmAdicionalIssueDate());
            vo.setNumeroCrmAdicional(entity.getNumeroCrmAdicional());
            vo.setUfConselhoMedicoAdicional(entity.getUfConselhoMedicoAdicional());

            vo.setAddress(AddressMapper.convertToVo(entity.getAddress()));

            vo.setAttachment(AttachmentMapper.convertToVo(entity.getAttachment()));

            vo.setPontuacao(entity.getPontuacao());
        }
        return vo;
    }

    /*
     **
     * Convert an entity to MedicoVo
     *
     * @param entity Medico
     * @return MedicoVo
     */
    public static MedicoSimpleVo convertToSimpleVo(Medico entity) {
        MedicoSimpleVo vo = null;
        if (entity != null) {
            vo = new MedicoSimpleVo();
            vo.setId(entity.getId());
            vo.setNome(entity.getNome());
        }
        return vo;
    }

    public static Medico convertToEntity(MedicoSimpleVo vo) {
        Medico entity = null;
        if (entity != null) {
            entity = new Medico();
            entity.setId(vo.getId());
            entity.setNome(vo.getNome());
        }
        return entity;
    }

    public static MedicoPlantaoSimpleVo convertToMedicoPlantaoSimpleVo(Medico entity) {
        MedicoPlantaoSimpleVo vo = null;
        if (entity != null) {
            vo = new MedicoPlantaoSimpleVo();
            vo.setId(entity.getId());
            vo.setNome(entity.getNome());

            if (!Util.isNullOrEmpty(entity.getAnexoFoto())) {
                vo.setAnexoFoto(Util.byteToBase64String(entity.getAnexoFoto()));
            }
            vo.setNumeroCrm(entity.getNumeroCrm());
            vo.setAttachment(AttachmentMapper.convertToVo(entity.getAttachment()));
            vo.setTelefone(entity.getTelefone());
        }
        return vo;
    }

    public static MedicoExportarVo convertoToMedicoExportaVo(Medico entity) {
        MedicoExportarVo vo = null;
        if (entity != null) {
            vo = new MedicoExportarVo();
            vo.setId(entity.getId());
            vo.setNome(entity.getNome());
            vo.setPontuacao(entity.getPontuacao());
            vo.setEmail(entity.getEmail());
            vo.setCrm(entity.getNumeroCrm());
            vo.setEstado(entity.getUfConselhoMedico());
            vo.setCrmAdicional(entity.getNumeroCrmAdicional());
            vo.setEstadoAdicional(entity.getUfConselhoMedicoAdicional());
            vo.setSexo(entity.getSexo());
            vo.setTipoRecebimento(entity.getTipoRecebimento());
            vo.setConta(entity.getConta());
            vo.setOperacao(entity.getOperacao());
            vo.setBanco(entity.getBanco());
            vo.setAgencia(entity.getAgencia());
            vo.setNumeroPis(entity.getNumeroPis());
            vo.setTelefone(entity.getTelefone());
            vo.setAtivo(entity.getAtivo() ? "Ativo" : "Inativo");
            vo.setBirthDate(Util.localDateToString(entity.getBirthDate()));
            vo.setCrmIssueDate(Util.localDateToString(entity.getCrmIssueDate()));
            vo.setCrmAdicionalIssueDate(Util.localDateToString(entity.getCrmAdicionalIssueDate()));
            vo.setAddress(convertAddress(entity.getAddress()));
        }
        return vo;
    }

    private static String convertAddress(Address address){
        if (address == null) return "";

        var sAddress = String.format("%s, ", address.getStreet());

        sAddress += !Util.isNullOrEmpty(address.getNumber()) ? String.format("%s, ", address.getNumber()) : "";
        sAddress += !Util.isNullOrEmpty(address.getDistrict()) ? String.format("%s, ", address.getDistrict()) : "";
        sAddress += !Util.isNullOrEmpty(address.getComplement()) ? String.format("%s, ", address.getComplement()) : "";
        sAddress += address.getCity() != null ?
                String.format("%s - %s", address.getCity().getName(), address.getCity().getState().getAcronym()) : "";

        return sAddress;
    }

    /**
     * Converte uma lista de UsuarioApps para uma lista de VOs
     *
     * @param listEntity List<Medico>
     * @return List<MedicoVo>
     */
    public static List<MedicoVo> convertToListVo(List<Medico> listEntity) {
        List<MedicoVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Medico entity : listEntity) {
                listVo.add(convertToVo(entity));
            }
        }

        return listVo;
    }

    public static List<MedicoExportarVo> convertToListExportarVo(List<Medico> listEntity) {
        List<MedicoExportarVo> listVo = null;
        if (listEntity != null) {
            listVo = new ArrayList<>();
            for (Medico entity : listEntity) {
                listVo.add(convertoToMedicoExportaVo(entity));
            }
        }

        return listVo;
    }

    /**
     * Converte o MedicoVo para Medico
     *
     * @param vo MedicoVo
     * @return Medico
     */
    public static Medico convertToEntity(MedicoVo vo) {
        Medico entity = null;
        if (vo != null) {
            entity = new Medico();
            entity.setId(vo.getId());
            entity.setNome(vo.getNome());
            entity.setSenha(vo.getSenha());
            entity.setEmail(vo.getEmail());
            entity.setTelefone(vo.getTelefone());
            entity.setUfConselhoMedico(vo.getUfConselhoMedico());
            entity.setSexo(vo.getSexo());
            entity.setTokenPushNotification(vo.getTokenPushNotification());
            if (!Util.isNullOrEmpty(vo.getAnexoFoto())) {
                entity.setAnexoFoto(Util.base64StringToByte(vo.getAnexoFoto()));
            }
            entity.setNomeAnexoFoto(vo.getNomeAnexoFoto());
            entity.setTipoAnexoFoto(vo.getTipoAnexoFoto());
            entity.setValidado(vo.getValidado());
            entity.setObservacoesValidacao(vo.getObservacoesValidacao());
            entity.setEhContaEmpresa(vo.getEhContaEmpresa());
            entity.setTipoRecebimento(vo.getTipoRecebimento());
            entity.setBanco(vo.getBanco());
            entity.setAgencia(vo.getAgencia());
            entity.setOperacao(vo.getOperacao());
            entity.setConta(vo.getConta());
            entity.setCpf(vo.getCpf());
            entity.setCnpj(vo.getCnpj());
            entity.setNomeTitular(vo.getNomeTitular());
            entity.setNumeroPis(vo.getNumeroPis());
            entity.setStatus(vo.getStatus());
            entity.setCadastroCompleto(vo.getCadastroCompleto());
            entity.setVersaoLogin(vo.getVersaoLogin());
            entity.setDataUltimoLogin(vo.getDataUltimoLogin());

            entity.setEmailValidado(vo.getEmailValidado());
            entity.setNumeroCrm(vo.getNumeroCrm());
            entity.setStatus(vo.getStatus());

            entity.setDataAlteracaoSenha(vo.getDataAlteracaoSenha());
            entity.setDataExpiracaoToken(vo.getDataExpiracaoToken());
            entity.setMedicoAcesso(vo.getMedicoAcesso());
            entity.setAtivo(vo.getAtivo());

            entity.setBirthDate(vo.getBirthDate());
            entity.setCrmIssueDate(vo.getCrmIssueDate());
            entity.setCrmAdicionalIssueDate(vo.getCrmAdicionalIssueDate());

            entity.setAddress(AddressMapper.convertToEntity(vo.getAddress()));
            entity.setNumeroCrmAdicional(vo.getNumeroCrmAdicional());
            entity.setUfConselhoMedicoAdicional(vo.getUfConselhoMedicoAdicional());

            entity.setPontuacao(vo.getPontuacao());

            entity.setAttachment(AttachmentMapper.convertToEntity(vo.getAttachment()));

            AuditoriaMapper.preencheEntity(entity, vo);
        }
        return entity;
    }

    /**
     * Converte uma lista de UsuarioAppVos para uma lista de UsuarioApps
     *
     * @param listVo List<MedicoVo>
     * @return List<Medico>
     */
    public static List<Medico> convertToListEntity(List<MedicoVo> listVo) {
        List<Medico> listEntity = null;
        if (listVo != null) {
            listEntity = new ArrayList<>();
            for (MedicoVo vo : listVo) {
                listEntity.add(convertToEntity(vo));
            }
        }
        return listEntity;
    }
}
