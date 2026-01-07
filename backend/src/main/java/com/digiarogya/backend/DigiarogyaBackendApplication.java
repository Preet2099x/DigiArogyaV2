package com.digiarogya.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DigiarogyaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DigiarogyaBackendApplication.class, args);
	}

}
