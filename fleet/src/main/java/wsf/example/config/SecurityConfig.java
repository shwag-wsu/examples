package wsf.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.web.SecurityFilterChain;


@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
        return http.build();
    }
}
/* 

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
       .csrf(csrf -> csrf.disable()) // <--- This should be replaced for production
         .authorizeHttpRequests(authz -> authz
              .requestMatchers("/", "/public/**").permitAll()
              .anyRequest().authenticated()
          )
          .oauth2Login(); // Enable OAuth2 login
        return http.build();
   }
   //  @Bean
   // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
   //     http
    //        .authorizeHttpRequests(auth -> auth
    //            .anyRequest().authenticated()
    //        )
    //        .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
    //    return http.build();
   // }
} */