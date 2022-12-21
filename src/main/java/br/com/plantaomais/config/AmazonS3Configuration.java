package br.com.plantaomais.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

public class AmazonS3Configuration {

    public static AmazonS3 getS3Instance() {

        
        BasicAWSCredentials credentials = new BasicAWSCredentials(
                ApplicationProperties.getInstance().getProperty("aws.key"),
                ApplicationProperties.getInstance().getProperty("aws.secret"));

        return AmazonS3ClientBuilder.standard()
                .withRegion(Regions.US_EAST_1)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }

    public static String getBucket() {
        return ApplicationProperties.getInstance().getProperty("aws.bucket");
    }
}
