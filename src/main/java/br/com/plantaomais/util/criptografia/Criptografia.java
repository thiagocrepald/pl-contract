package br.com.plantaomais.util.criptografia;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;

public final class Criptografia {

    public static String passfrase = "a/DxEJd6yQ/7LQButlfirRGTDkzD0nHQ0LOLNA2Dr2JALWHJYG4NJI7KzdRjptzW7wi9PCpfvc5EJ5fm89/3CfDMvaA+XNLaB1sCCpl1ETkPrCdCWyNH0PUmsaTRPT379fRJkKNB7Hv2ivlNfP4ZKXkNrvC79cK/e2MACos01Co=";

    /**
     * Criptografa o parâmetro recebido utilizando a técnica Blowfish.
     *
     * @param str
     * @return String
     */
    public static String cript(String str) {
        String strCript = str;

        try {
            Cipher ch = Cipher.getInstance("Blowfish");
            SecretKey k1 = new SecretKeySpec(passfrase.getBytes(), "Blowfish");

            ch.init(Cipher.ENCRYPT_MODE, k1);
            byte b[] = ch.doFinal(strCript.getBytes());
            String s1 = Conversion.byteArrayToBase64String(b);
            strCript = s1;
        } catch (Exception e) {

            e.printStackTrace();
        }

        //Remove o "=" por que esta sobrando.
        strCript = strCript.replaceAll("\\=", "");
        return strCript;
    }

    /**
     * Descriptografa o parâmetro recebido utilizando a técnica Blowfish.
     *
     * @param str
     * @return
     */
    public static final String decript(String str) {
        String strDecript = str;

        try {
            Cipher ch = Cipher.getInstance("Blowfish");
            SecretKey k1 = new SecretKeySpec(passfrase.getBytes(), "Blowfish");

            //decriptografando
            ch.init(Cipher.DECRYPT_MODE, k1);
            byte b[] = Conversion.base64StringToByteArray(strDecript);
            byte b1[] = ch.doFinal(b);
            String s1 = new String(b1);
            strDecript = s1;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return strDecript;
    }

    /**
     * <PRE>
     * <b>author:</b>  Marlos M. Novo
     * <b>date  :</b>  04/07/2012
     * <b>param :</b>  String
     * <b>return:</b>  String
     * </PRE>
     * <p/>
     * <p/>
     * Criptografa em MD5 a String passada como parametro, retornando a string
     * já criptografada.
     */
    public static String criptMD5(String str) {
        String strCript = str;

        try {
            if (strCript != null && !strCript.equals("")) {
                MessageDigest md = MessageDigest.getInstance("MD5");

                md.update(strCript.getBytes());
                byte[] hash = md.digest();
                StringBuilder hexString = new StringBuilder();
                for (int i = 0; i < hash.length; i++) {
                    if ((0xff & hash[i]) < 0x10) {
                        hexString.append("0").append(
                                Integer.toHexString((0xFF & hash[i])));
                    } else {
                        hexString.append(Integer.toHexString(0xFF & hash[i]));
                    }
                }
                strCript = hexString.toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return strCript;
    }
}
