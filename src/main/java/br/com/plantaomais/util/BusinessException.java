package br.com.plantaomais.util;

/**
 * Created by nextage on 01/04/2016.
 */
public class BusinessException extends Exception {
    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
