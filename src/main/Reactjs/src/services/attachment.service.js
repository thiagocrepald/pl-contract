import UtilService from './util.service';

class AttachmentService {

    static compress = (type, id = '', ativo = '', status, ufConselhoMedico, especialidade, medicosSelecionados) =>{
        return UtilService.post(`attachments/compress/${type}/${id}?${ativo != null ? `ativo=${ativo}&` : ""}${
            status != null ? `status=${status}&` : ""}${
            ufConselhoMedico != null ? `estado=${ufConselhoMedico}&` : ""}${
            especialidade != null ? `especialidade=${especialidade}&` : ""}${
            medicosSelecionados != null ? `${medicosSelecionados}` : ""}`
        )
    };

    static get = (id) =>{
        return UtilService.get(`attachments/${id}`);
    };
}

export default AttachmentService;