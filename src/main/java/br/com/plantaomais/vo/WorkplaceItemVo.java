package br.com.plantaomais.vo;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by nextage on 14/05/2019.
 */
public class WorkplaceItemVo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Integer item;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getItem() {
        return item;
    }

    public void setItem(Integer item) {
        this.item = item;
    }
}
