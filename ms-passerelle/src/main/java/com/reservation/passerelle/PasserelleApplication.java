package com.reservation.passerelle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PasserelleApplication {

    public static void main(String[] args) {
        SpringApplication.run(PasserelleApplication.class, args);
    }
}
