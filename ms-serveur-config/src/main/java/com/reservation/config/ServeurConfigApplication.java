package com.reservation.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableConfigServer
@EnableFeignClients
public class ServeurConfigApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServeurConfigApplication.class, args);
    }
}
