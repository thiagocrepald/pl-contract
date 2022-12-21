package br.com.plantaomais.util;

import br.com.plantaomais.vo.ArquivoVo;
import br.com.plantaomais.vo.EscalaReportVo;
import br.com.plantaomais.vo.layoutEscala.LayoutEscalaVo;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.joda.time.DateTime;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class ReportUtils {

    public static ArquivoVo createFromWorkbook(XSSFWorkbook workbook, String name, boolean isNewPdf, boolean isOldPdf, int numberOfColumns, List<LayoutEscalaVo> layoutEscala, DateTime date, String scheduleName) throws Exception {
        ArquivoVo arquivoVo = new ArquivoVo();

        byte[] bytes;
        if (isNewPdf) {
            byte[] bytesPdf = Util.convertResultToPDF(layoutEscala, date, scheduleName);
            bytes = bytesPdf;
            arquivoVo.setPdf(true);
        } else if(isOldPdf) {
            byte[] bytesPdf = Util.convertWorkbookToPDF(workbook, numberOfColumns);
            bytes = bytesPdf;
            arquivoVo.setPdf(true);
        } else {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            workbook.write(bos);
            byte[] bytesXls = bos.toByteArray();
            bytes = bytesXls;
            bos.close();
            arquivoVo.setPdf(false);
        }

        arquivoVo.setArquivo(bytes);
        arquivoVo.setNmAnexo(name);

        return arquivoVo;
    }
}
