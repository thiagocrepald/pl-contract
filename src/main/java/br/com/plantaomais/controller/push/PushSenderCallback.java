package br.com.plantaomais.controller.push;

/**
 * Created by deividi on 16/01/16.
 */
public interface PushSenderCallback {

    void onSuccess();

    void onError(String reason);

}
