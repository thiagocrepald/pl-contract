import UtilService from "./util.service";

class EventoService {

    static get = (id, active, order) => {
        var finalUrl = "evento?";
        if (id != null) {
            finalUrl = finalUrl + "id=" + id + "&";
        }
        if (active != null) {
            finalUrl = finalUrl + "active=" + active + "&";
        }
        if (order != null) {
            finalUrl = finalUrl + "order=" + order;
        }
        return UtilService.get(finalUrl);
    };

    static save = (eventoVo) => {
        return UtilService.post("evento/", eventoVo);
    };

    static update = (eventoVo) => {
        return UtilService.put("evento/", eventoVo);
    };

    static delete = (id) => {
        return UtilService.delete("evento?id=" + id);
    };
}

export default EventoService;