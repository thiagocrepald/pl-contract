package br.com.plantaomais.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;

public class AmazonSESConfiguration {

    public static AmazonSimpleEmailService getS3Instance() {


        BasicAWSCredentials credentials = new BasicAWSCredentials(
                ApplicationProperties.getInstance().getProperty("aws.key"),
                ApplicationProperties.getInstance().getProperty("aws.secret"));

        return AmazonSimpleEmailServiceClientBuilder.standard()
                .withRegion(Regions.US_EAST_1)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }

}