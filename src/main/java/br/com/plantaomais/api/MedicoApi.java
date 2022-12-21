package br.com.plantaomais.api;


import br.com.plantaomais.config.Secured;
import br.com.plantaomais.config.SecuredApp;
import br.com.plantaomais.controller.MedicoController;
import br.com.plantaomais.controller.MedicoCursoController;
import br.com.plantaomais.filtro.FiltroMedico;
import br.com.plantaomais.util.AuthenticationException;
import br.com.plantaomais.util.Info;
import br.com.plantaomais.vo.ArquivoVo;
import br.com.plantaomais.vo.BloqueioMedicoEscalaVo;
import br.com.plantaomais.vo.MedicoAnexoVo;
import br.com.plantaomais.vo.MedicoCursoVo;
import br.com.plantaomais.vo.MedicoEspecialidadeVo;
import br.com.plantaomais.vo.MedicoVo;
import br.com.plantaomais.vo.PlantaoVo;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.Date;
import java.util.List;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path("medico")
public class MedicoApi {

    @Context
    private SecurityContext context;

    @POST
    @Path("listar")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public List<MedicoVo> listar(@QueryParam("ativo") String ativo,
                                 @QueryParam("status") String status,
                                 @QueryParam("medicos") List<Integer> medicosId,
                                 @QueryParam("estado") String estado,
                                 @QueryParam("especialidade") Integer especialidadeId,
                                 @QueryParam("offset") Integer offset,
                                 @QueryParam("limit") Integer limit,
                                 @QueryParam("startDate") String startDate,
                                 @QueryParam("endDate") String endDate) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.listar(ativo, status, medicosId, estado, especialidadeId, offset, limit, startDate, endDate);
    }

    @POST
    @Path("listarMedicoEspecialidade")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public List<MedicoEspecialidadeVo> listarMedicoEspecialidade(FiltroMedico filtro) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.listarMedicoEspecialidade(filtro);
    }

    @POST
    @Path("listarMedicoMinhasEspecialidades")
    @SecuredApp
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public List<MedicoEspecialidadeVo> listarMedicoEspecialidade() throws AuthenticationException {
        MedicoVo medicoVo = (MedicoVo) context.getUserPrincipal();
        MedicoController controller = new MedicoController(medicoVo);
        FiltroMedico filtro = new FiltroMedico();
        filtro.setId(medicoVo.getId());
        return controller.listarMedicoEspecialidade(filtro);
    }

    @POST
    @Path("getById")
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    @Secured
    public Info getById(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.getMedicoById(vo);
    }

    @POST
    @Path("getMedicStatus")
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    @SecuredApp
    public Info getMedicStatus(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.getMedicoStatus(vo.getId());
    }

    @POST
    @Path("getByIdVisualizar")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info getByIdVisualizar(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.getMedicoByIdVisualizar(vo);
    }

    @POST
    @Path("salvar")
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    @Secured
    public Info salvar(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.salvar(vo);
    }

    @POST
    @Path("salvarCadastroCompleto")
    @Consumes(APPLICATION_JSON)
    @SecuredApp
    @Produces(APPLICATION_JSON)
    public Info salvarCadastroCompleto(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.salvarCadastroCompleto(vo);
    }

    @POST
    @Path("excluir")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info excluir(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.excluir(vo);
    }

    @POST
    @Path("listarComboMedico")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public List<MedicoVo> listarComboMedico() throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.listarComboMedico();
    }


    @POST
    @Path("validar")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info validar(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.validar(vo);
    }

    @POST
    @Path("excluirUsuarioAppEspecialidade")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info excluirMedicoEspecialidade(MedicoEspecialidadeVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.excluirMedicoEspecialidade(vo);
    }

    @POST
    @Path("excluirUsuarioAppCurso")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info excluirMedicoCurso(MedicoCursoVo vo) throws AuthenticationException {
        MedicoCursoController controller = new MedicoCursoController(context.getUserPrincipal());
        return controller.excluir(vo);
    }

    @POST
    @Path("verificarPossibilidadeCandidatura")
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    @SecuredApp
    public Info verificarPossibilidadeCandidatura(FiltroMedico vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.verificarPossibilidadeCandidatura(vo);
    }

    @POST
    @Path("candidatarMedico")
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info candidatarMedico(PlantaoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.candidatarMedico(vo);
    }

    @POST
    @Path("adicionarBiometria")
    @SecuredApp
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info adicionarBiometria(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.adicionarBiometria(vo);
    }

    @POST
    @Path("carregarCampoAnexo")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info carregarCampoAnexo(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.carregarCampoAnexo(vo);
    }

    @POST
    @Path("getAnexosMedico")
    @SecuredApp
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info carregarAnexosMedico(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.getAnexosByMedico(vo);
    }

    @POST
    @Path("salvarAlteracoesMeuPerfil")
    @SecuredApp
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info salvarAlteracoesMeuPerfil(MedicoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.salvarInformacoesMeuPerfil(vo);
    }

    @POST
    @Path("excluirBloqueioMedicoEscala")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info excluirBloqueioMedicoEscala(BloqueioMedicoEscalaVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.excluirBloqueioMedicoEscala(vo);
    }

    @POST
    @Path("listarComboMedicoNaoBloqueados")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public List<MedicoVo> listarComboMedicoNaoBloqueados(PlantaoVo plantaoVo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.findMedicOfContractWithSpecialty(plantaoVo);
    }

    @POST
    @Path("excluirMedicoAnexo")
    @Secured
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    public Info excluirMedicoAnexo(MedicoAnexoVo vo) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.excluirMedicoAnexo(vo);
    }

    @POST
    @Secured
    @Path("gerarExcel")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ArquivoVo gerarExcel(@QueryParam("ativo") String ativo,
                                @QueryParam("status") String status,
                                @QueryParam("medicos") List<Integer> medicosId,
                                @QueryParam("estado") String estado,
                                @QueryParam("especialidade") String especialidade,
                                @QueryParam("startDate")  String startDate,
                                @QueryParam("endDate") String endDate) throws AuthenticationException {
        MedicoController controller = new MedicoController(context.getUserPrincipal());
        return controller.gerarExcel(ativo, status, medicosId, estado, especialidade, startDate, endDate);
    }

}
