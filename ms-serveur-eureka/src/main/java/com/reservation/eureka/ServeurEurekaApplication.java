package com.reservation.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableEurekaServer
@EnableFeignClients
public class ServeurEurekaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServeurEurekaApplication.class, args);
    }
}
