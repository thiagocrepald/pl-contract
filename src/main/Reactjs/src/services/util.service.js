import saveAs from "file-saver";
import { Observable } from "rxjs";
import Api from "./api";

class UtilService {
  static post = (url, param) =>
    new Observable((observer) => {
      Api.post(url, param)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });

  static get = (url, param) =>
    new Observable((observer) => {
      Api.get(url, param)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });

  static put = (url, param) =>
    new Observable((observer) => {
      Api.put(url, param)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });

  static delete = (url, param) =>
    new Observable(observer => {
        Api.delete(url, param)
        .then(response => {
        observer.next(response.data);
    observer.complete();
    })
    .catch(error => {
        observer.error(error);
    });
  });

  //***********************************************************
  /**
   * Método faz o download de bytes passados por parametro
   * @param {type} obj seja o ArquivoVo ou o próprio arquivo o conteudo
   * @param {type} nome nome do arquivo
   * @param {type} tipo tipo do arquivo
   */

  static openPdfOrImageUrl(url) {
    window.open(url, "_blank");
  }

  static downloadPdfOrImage(base64Anexo, anexoNome, tipoAnexo) {
    if (
      (tipoAnexo != null && tipoAnexo.indexOf("pdf") !== -1) ||
      tipoAnexo.indexOf("jpeg") !== -1 ||
      tipoAnexo.indexOf("png") !== -1
    ) {
      const blobObject = UtilService.b64toBlob(base64Anexo, tipoAnexo);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobObject, anexoNome);
      } else {
        const url = URL.createObjectURL(blobObject);
        window.open(url, "_blank");
      }
    }
  }

  static download = (obj, nome, tipo) => {
    if (obj) {
      if (obj.arquivo && obj.nmAnexo) {
        nome = obj.nmAnexo;
        obj = obj.arquivo;
      }
      if (!tipo && nome.indexOf(".") > -1) {
        let tipoArr = nome.split(".");
        tipo = nome.split(".")[tipoArr.length - 1];
      }
      if ("doc,docx,xml,xls,xlsx,csv,txt,zip".indexOf(tipo) > -1) {
        tipo = "application/octet-stream";
      }
      let blobObject;
      try {
        blobObject = this.b64toBlob(obj, tipo, null);
      } catch (e) {
        blobObject = this.b64toBlob(obj, "application/octet-stream", null);
      }

      if (tipo != null && tipo.indexOf("pdf") !== -1) {
        const url = URL.createObjectURL(blobObject);
        window.open(url, "_blank");
      } else if (window.navigator.msSaveOrOpenBlob !== undefined) {
        window.navigator.msSaveOrOpenBlob(blobObject, nome);
      } else if (window.navigator.msSaveBlob !== undefined) {
        window.navigator.msSaveBlob(blobObject, nome);
      } else {
        //saveAs(blobObject, nome);
        saveAs(blobObject, nome);
      }
    }
  };

  /**
   * @param {type} b64Data
   * @param {type} contentType
   * @param {type} sliceSize
   * @returns {Blob}
   */
  static b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  static base64encode = (str) => {
    if (typeof btoa === "function") {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (m, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        })
      );
    }

    throw new Error(`Can not find window.btoa`);
  };

  static base64decode = (str) => {
    if (typeof atob === "function") {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(str), (c) => {
            // eslint-disable-next-line prefer-template
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    }

    throw new Error(`Can not find window.atob`);
  };
}

export default UtilService;
