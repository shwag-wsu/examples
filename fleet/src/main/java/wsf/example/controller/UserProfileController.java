package wsf.example.controller;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class UserProfileController {

    
    @GetMapping("/profile")
    public OAuth2User getUserProfile(@AuthenticationPrincipal OAuth2User principal) {
        return principal; // Returns all attributes coming from Cognito
    }

}
