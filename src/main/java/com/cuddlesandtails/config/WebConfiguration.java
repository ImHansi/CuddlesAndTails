package com.cuddlesandtails.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity.authorizeHttpRequests(auth -> {
            auth
            .requestMatchers("resources/**").permitAll()
            .requestMatchers("/createadmin").permitAll()
            .requestMatchers("/login").permitAll()
            .requestMatchers("/error").permitAll()
            .requestMatchers("/cuddlesandtails").permitAll()
            .requestMatchers("/index").hasAnyAuthority("Admin","manager","receptionist","staff-member","doctor")
            .requestMatchers("/employee/**").hasAnyAuthority("Admin","manager")
            .requestMatchers("/user").hasAnyAuthority("Admin","manager","doctor")
            .requestMatchers("/payment").hasAnyAuthority("Admin","manager","receptionist")
            .requestMatchers("/pet").hasAnyAuthority("Admin","manager","receptionist")
            .requestMatchers("/doctor").hasAnyAuthority("Admin","manager","receptionist")
            .requestMatchers("/appointment").hasAnyAuthority("Admin","manager","receptionist")
            .requestMatchers("/vaccinationrecord").hasAnyAuthority("Admin","manager","receptionist","doctor")
            .requestMatchers("/consultation").hasAnyAuthority("Admin","manager","doctor")
            .requestMatchers("/announcement").hasAnyAuthority("Admin","manager","receptionist")
            .requestMatchers("/order").hasAnyAuthority("Admin","manager")
            .requestMatchers("/vaccine").hasAnyAuthority("Admin","manager")
            .requestMatchers("/receive").hasAnyAuthority("Admin","manager")
            .requestMatchers("/supplier").hasAnyAuthority("Admin","manager")
            .requestMatchers("/supplierpayment").hasAnyAuthority("Admin","manager")
            .requestMatchers("/privilege").hasAnyAuthority("Admin","manager")
            
            .anyRequest().authenticated();
        })

        //login form details
        .formLogin(login ->{
            login.loginPage("/login")
            .defaultSuccessUrl("/index",true)
            .failureUrl("/login?error=usernamepassworderror")
            .usernameParameter("username")
            .passwordParameter("password");
        })


        //logout
        .logout(logout ->{
            logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/login");
        })

        //exception
        .exceptionHandling(exception ->{
            exception.accessDeniedPage("/error");
        })
        .csrf(csrf -> {
            csrf.disable();
        });

        return httpSecurity.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
    
}
