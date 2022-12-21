import UtilService from "./util.service";

class PermissionService {

    static userContainPermission = (permissionType) => {
        return UtilService.get("permissao/usuario?tipo=" + permissionType);
    };
}

export default PermissionService;