package br.com.plantaomais.vo.aplicativo;

import br.com.plantaomais.vo.EspecialidadeVo;
import br.com.plantaomais.vo.SetorVo;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by nextage on 14/05/2019.
 */
@Getter
@Setter
@Builder
public class PlantaoUrlVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;

    private String plantaoInfo;
}
