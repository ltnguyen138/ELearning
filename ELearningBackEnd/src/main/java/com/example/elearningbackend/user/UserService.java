package com.example.elearningbackend.user;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public interface UserService {

    UserRes register(RegisterReq registerReq) throws MessagingException, IOException;

    TokenRes login(LoginReq loginReq);

    UserRes getCurrentLoggedInUser();

    UserRes updateAccount(UserReq userReq);

    UserRes changePassword(ChangePasswordReq changePasswordReq);

    Page<UserRes> getUsers(Pageable pageable, UserQuery userQuery);

    UserRes getById(long id);

    UserRes updateUser(UserReq userReq, long id);

    UserRes toggleActivation(long id);

    void deleteUser(long id);

    UserRes UploadProfilePicture(long userId, MultipartFile file) throws IOException;

    UrlResource getProfilePicture(String imageName) throws IOException;

    UserRes updateRole(long userId, long roleId);

    TokenRes loginWithOAuth2Google(OAuthLoginReq oAuthLoginReq) throws IOException;

    String getProfilePictureUrl(String imageName);



    String generateResetPasswordToken(String email) throws MessagingException, IOException;

    void resetPassword(ResetPasswordReq resetPasswordReq);

    void validateResetPasswordToken(String token, long userId);

    UserRes updateRoleInstruction();

    UserRes updateRoleAdmin(long userId);

    TokenRes validateEmailVerificationToken(String token, long userId);

    void sendVerificationEmail(String email) throws MessagingException, IOException;

  void backUpDatabase() throws IOException, InterruptedException;
}
