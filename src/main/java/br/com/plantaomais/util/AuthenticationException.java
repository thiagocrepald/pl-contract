package br.com.plantaomais.util;

/**
 * Created by nextage on 01/04/2016.
 */
public class AuthenticationException extends Exception {
    public AuthenticationException(String message) {
        super(message);
    }

    public AuthenticationException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
