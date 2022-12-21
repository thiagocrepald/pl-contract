import UtilService from "./util.service";

class CursoService {

    static listarComboCurso = () => {
        return UtilService.get('cursos/listar');
    };

    static salvarCurso = (cursoVo) => {
        return UtilService.post('cursos/salvar', cursoVo);
    }
}

export default CursoService;
