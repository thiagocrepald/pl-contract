package br.com.plantaomais.util.criptografia;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;

/**
 * Created by nextage
 * on 11/08/2017.
 */
public class JWT {

    private static final String USER = "ROLE_USER";
    private static final String DOCTOR = "ROLE_DOCTOR";
    private static final String AUTHORITIES_KEY = "auth";
    private static final String DOCTOR_KEY = "doctor";
    private static final String USER_KEY = "user";



    public static String createJWT(String id, String issuer, String subject, long ttlMillis, Integer userId, Integer doctorId) {

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);


        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS512;


        //We will sign our JWT with our ApiKey secret
        byte[] apiKeySecretBytes = Decoders.BASE64.decode(Criptografia.passfrase);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        long expMillis = nowMillis + (ttlMillis > 0 ? ttlMillis : 1000L * 60 * 60 * 25 * 30);
        Date exp = new Date(expMillis);

        JwtBuilder builder = Jwts.builder().setId(id)
                .setIssuedAt(now)
                .setSubject(subject)
                .claim(AUTHORITIES_KEY, userId != null ? USER : DOCTOR)
                .claim("id", userId != null ? userId : doctorId)
                .claim(USER_KEY, userId)
                .claim(DOCTOR_KEY, doctorId)
                .setIssuer(issuer)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS512, signingKey);

        return builder.compact();
    }

    public static Claims parseJWT(String jwt) {

        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS512;
        byte[] apiKeySecretBytes = Decoders.BASE64.decode(Criptografia.passfrase);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        return Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(jwt).getBody();
    }

}
