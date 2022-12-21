package br.com.plantaomais.config;

import javax.ws.rs.NameBinding;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * @author Matheus Toledo
 */
@NameBinding
@Retention(RUNTIME)
@Target({TYPE, METHOD})
public @interface SecuredApp {
}
