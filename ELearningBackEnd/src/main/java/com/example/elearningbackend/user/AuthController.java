package com.example.elearningbackend.user;

import com.example.elearningbackend.util.JwtTokenUtil;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    @PostMapping("/register")
    public UserRes register(@RequestBody RegisterReq registerReq) throws MessagingException, IOException {
        return userService.register(registerReq);
    }

    @PostMapping("/login")
    public TokenRes login( @RequestBody LoginReq loginReq) {
        return userService.login(loginReq);
    }

    @GetMapping("/account")
    public UserRes getCurrentLoggedInUser() {
        return userService.getCurrentLoggedInUser();
    }

    @PutMapping("/account")
    public UserRes updateAccount(@RequestBody @Valid UserReq userReq) {
        return userService.updateAccount(userReq);
    }

    @PutMapping("/account/change-password")
    public UserRes changePassword(@RequestBody ChangePasswordReq changePasswordReq) {
        return userService.changePassword(changePasswordReq);
    }

    @PostMapping("/google")
    public TokenRes googleLogin(@RequestBody OAuthLoginReq token) throws IOException {

        return userService.loginWithOAuth2Google(token);
    }

    @GetMapping("/forgot-password")
    public void generateResetPasswordToken(@RequestParam String email) throws IOException, MessagingException {
        userService.generateResetPasswordToken(email);
    }

    @GetMapping("/validate-reset-password-token")
    public void validateResetPasswordToken(@RequestParam String token, @RequestParam long userId) {
        userService.validateResetPasswordToken(token, userId);
    }

    @PostMapping("/reset-password")
    public void resetPassword(@RequestBody ResetPasswordReq resetPasswordReq) {
        userService.resetPassword(resetPasswordReq);
    }

    @PutMapping("/update-role-instruction")
    public UserRes updateRoleInstruction() {
        return userService.updateRoleInstruction();
    }

    @PutMapping("/update-role-admin/{userId}")
    public UserRes updateRoleAdmin(@PathVariable long userId) {
        return userService.updateRoleAdmin(userId);
    }

    @GetMapping("/send-verification-email")
    public void sendVerificationEmail(@RequestParam String email) throws IOException, MessagingException {
        userService.sendVerificationEmail(email);
    }

    @GetMapping("/validate-email-verification-token")
    public TokenRes validateEmailVerificationToken(@RequestParam String token, @RequestParam long userId) {
        return userService.validateEmailVerificationToken(token, userId);
    }
}
