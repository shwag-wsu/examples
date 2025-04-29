package wsf.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

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
}