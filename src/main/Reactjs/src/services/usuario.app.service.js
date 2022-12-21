import UtilService from "./util.service";

class UsuarioAppService {

  static listar = (ativo, status, ufConselhoMedico, especialidade) => {
    return UtilService.post(
      `medico/listar?${ativo != null ? `ativo=${ativo}&` : ""}${
        status != null ? `status=${status}&` : ""}${
        ufConselhoMedico != null ? `estado=${ufConselhoMedico}&` : ""}${
        especialidade != null ? `especialidade=${especialidade}&` : ""}`
    );
  };

  static gerarExcel = (ativo, status, ufConselhoMedico, especialidade, medicosSelecionados) => {
    return UtilService.post(
      `medico/gerarExcel?${ativo != null ? `ativo=${ativo}&` : ""}${
        status != null ? `status=${status}&` : ""}${
          ufConselhoMedico != null ? `estado=${ufConselhoMedico}&` : ""}${
          especialidade != null ? `especialidade=${especialidade}&` : ""}${
          medicosSelecionados != null ? `${medicosSelecionados}` : ""}`
    );
  };

  static getById = (medicoVo) => {
    return UtilService.post("medico/getById/", medicoVo);
  };

  static getByIdVisualizar = (medicoVo) => {
    return UtilService.post("medico/getByIdVisualizar/", medicoVo);
  };

  static salvar = (medicoVo) => {
    return UtilService.post("medico/salvar/", medicoVo);
  };

  static excluir = (medicoVo) => {
    return UtilService.post("medico/excluir/", medicoVo);
  };

  static listarComboMedico = (medicoVo) => {
    return UtilService.post("medico/listarComboMedico/", medicoVo);
  };

  static validar = (medicoVo) => {
    return UtilService.post("medico/validar/", medicoVo);
  };

  static excluirUsuarioAppEspecialidade = (UsuarioAppEspecialidadeVo) => {
    return UtilService.post(
      "medico/excluirUsuarioAppEspecialidade/",
      UsuarioAppEspecialidadeVo
    );
  };

  static excluirUsuarioAppCurso = (UsuarioAppCursoVo) => {
    return UtilService.post(
      "medico/excluirUsuarioAppCurso/",
      UsuarioAppCursoVo
    );
  };

  static carregarCampoAnexo = (medicoVo) => {
    return UtilService.post("medico/carregarCampoAnexo/", medicoVo);
  };

  static excluirBloqueioMedicoEscala = (BloqueioMedicoEscalaVo) => {
    return UtilService.post(
      "medico/excluirBloqueioMedicoEscala/",
      BloqueioMedicoEscalaVo
    );
  };

  static listarComboMedicoNaoBloqueados = (plantaoVo) => {
    return UtilService.post(
      "medico/listarComboMedicoNaoBloqueados/",
      plantaoVo
    );
  };

  static confirmarEmail = (medicoVo) => {
    return UtilService.post("auth/confirmarEmail/", medicoVo);
  };

  static atualizarSenha = (medicoVo) => {
    return UtilService.post("auth/atualizarSenha/", medicoVo);
  };

  static excluirMedicoAnexo = (medicoAnexoVo) => {
    return UtilService.post("medico/excluirMedicoAnexo/", medicoAnexoVo);
  };
}

export default UsuarioAppService;
