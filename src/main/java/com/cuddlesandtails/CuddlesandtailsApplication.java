package com.cuddlesandtails;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;


@RestController
@SpringBootApplication
public class CuddlesandtailsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CuddlesandtailsApplication.class, args);
		System.out.println("cuddles and tails pet care clinic");
	}

	
}
