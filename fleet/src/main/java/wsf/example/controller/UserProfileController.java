package wsf.example.controller;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController

public class UserProfileController {

    
    @GetMapping("/api/me")
     public Map<String, Object> getTokenClaims(@AuthenticationPrincipal Jwt jwt) {
        return jwt.getClaims();
    }

}
