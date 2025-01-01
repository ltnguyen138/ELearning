package com.example.elearningbackend.user;

import com.example.elearningbackend.aws.S3Service;
import com.example.elearningbackend.exception.AuthenticationException;
import com.example.elearningbackend.exception.BusinessException;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.mail.MailService;
import com.example.elearningbackend.role.Role;
import com.example.elearningbackend.role.RoleRepository;
import com.example.elearningbackend.role.UserRole;
import com.example.elearningbackend.util.AuthUtil;
import com.example.elearningbackend.util.JwtTokenUtil;
import com.example.elearningbackend.util.MultipartfileUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.querydsl.core.types.Predicate;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final S3Service s3Service;
    private final MailService mailService;


    private final String uploadDir = "uploads/users";
    private final String awsUploadDir = "users";
    private final String notFoundImage = "uploads/404.jpg";
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String idClient;
    @Value("${amazonProperties.bucketName}")
    private String bucketName;
    @Value("${amazonProperties.region}")
    private String region;

    @Transactional
    @Override
    public UserRes register(RegisterReq registerReq) throws MessagingException, IOException {
        if(userRepository.existsByEmailAndIsDeletedIsTrue(registerReq.getEmail())){
            throw new BusinessException("Email đã bị cấm sử dụng");
        }
        Optional<User> userNotVerified = userRepository.findByEmailAndIsDeletedIsFalseAndIsVerifiedIsFalse(registerReq.getEmail());
        if(userNotVerified.isPresent()){
            userRepository.delete(userNotVerified.get());
        }
        Optional<User> userOptional = userRepository.findByEmailAndIsDeletedIsFalse(registerReq.getEmail());
        if (userOptional.isPresent()) {
            throw new BusinessException("Email đã được sử dụng");
        }

        User user = userMapper.toUser(registerReq);
        user.setPassword(passwordEncoder.encode(registerReq.getPassword()));
        user.setRole(roleRepository.findByName("LEARNER").orElseThrow(()->new ResourceNotFoundException("Role not found")));
        user.setActivated(true);
        user.setIsVerified(false);
        User savedUser = userRepository.save(user);
        sendVerificationEmail(savedUser.getEmail());
        return userMapper.toUserRes(savedUser);
    }

    @Override
    public TokenRes login(LoginReq loginReq) {

    User user =
        userRepository
            .findByEmailAndIsDeletedIsFalse(loginReq.getEmail())
            .orElseThrow(() -> new AuthenticationException("User not found"));
    if (!user.getIsVerified()){
        return new TokenRes(null, false);
    }
        if(!passwordEncoder.matches(loginReq.getPassword(), user.getPassword())){
      throw new AuthenticationException("Mật khẩu hoặc email không chính xác");
        }
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginReq.getEmail(), loginReq.getPassword());
        authenticationManager.authenticate(token);
        String tokenString = jwtTokenUtil.generateToken(user);
        return new TokenRes(tokenString, user.getIsVerified());
    }

    @Override
    public UserRes getCurrentLoggedInUser() {
        User user = (User) AuthUtil.getCurrentUser();
        if(user == null){
            throw new AuthenticationException("User not found");
        }
        return userMapper.toUserRes(user);
    }

    @Transactional
    @Override
    public UserRes updateAccount(UserReq userReq) {
        User user = (User) AuthUtil.getCurrentUser();
        if(user == null){
            throw new AuthenticationException("User not found");
        }
        userMapper.updateUser(userReq, user);
        if(userReq.getRoleId() != null && user.getRole().getId() != userReq.getRoleId()){
            Role role = roleRepository.findById(userReq.getRoleId()).orElseThrow(()->new ResourceNotFoundException("Role not found"));
            if(role.getName().toUpperCase().equals(UserRole.ADMIN.name())){
                throw new BusinessException("Admin cannot be updated");
            }
            user.setRole(role);
        }
        user.setActivated(true);
        return userMapper.toUserRes(userRepository.save(user));
    }

    @Transactional
    @Override
    public UserRes changePassword(ChangePasswordReq changePasswordReq) {
        User user = (User) AuthUtil.getCurrentUser();
        if(user == null){
            throw new AuthenticationException("User not found");
        }
        if(user.getPassword() == null && (changePasswordReq.getOldPassword() == null || changePasswordReq.getOldPassword().isEmpty())){
            user.setPassword(passwordEncoder.encode(changePasswordReq.getNewPassword()));
            return userMapper.toUserRes(userRepository.save(user));
        }
        if(!passwordEncoder.matches(changePasswordReq.getOldPassword(), user.getPassword())){
            throw new BusinessException("Mật khẩu cũ không đúng");
        }
        user.setPassword(passwordEncoder.encode(changePasswordReq.getNewPassword()));
        return userMapper.toUserRes(userRepository.save(user));
    }

    @Override
    public Page<UserRes> getUsers(Pageable pageable, UserQuery userQuery) {
        Predicate predicate = userQuery.toPredicate();
        return userRepository.findAll(predicate, pageable).map(userMapper::toUserRes);
    }

    @Override
    public UserRes getById(long id) {
        return userRepository.findById(id).map(userMapper::toUserRes).orElseThrow(()->new ResourceNotFoundException("User not found"));
    }

    @Transactional
    @Override
    public UserRes updateUser(UserReq userReq, long id) {
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        if(loggedInUser.getId() == id){
            throw new BusinessException("You cannot update yourself");
        }
        User user = userRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));
        if(user.getRole().getName().toUpperCase().equals(UserRole.ROOT.name())){
            throw new BusinessException("Root user cannot be updated");
        }

        if(!loggedInUser.getRole().getName().toUpperCase().equals(UserRole.ROOT.name())){

            if(user.getRole().getName().toUpperCase().equals(UserRole.ADMIN.name())){
                throw new BusinessException("Admin cannot be updated");
            }
        }
        userMapper.updateUser(userReq, user);
        return userMapper.toUserRes(userRepository.save(user));
    }

    @Transactional
    @Override
    public UserRes toggleActivation(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        if(loggedInUser.getId() == id){
            throw new BusinessException("You cannot update your own activation status");
        }
        User user = userRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));
        if(user.getRole().getName().toUpperCase().equals(UserRole.ROOT.name())){
            throw new BusinessException("Root user cannot be updated activation status");
        }

        if(!loggedInUser.getRole().getName().toUpperCase().equals(UserRole.ROOT.name())){

            if(user.getRole().getName().toUpperCase().equals(UserRole.ADMIN.name())){
                throw new BusinessException("Admin cannot be updated activation status");
            }
        }

        user.setActivated(!user.isActivated());
        return userMapper.toUserRes(userRepository.save(user));
    }

    @Transactional
    @Override
    public void deleteUser(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        if(loggedInUser.getId() == id){
            throw new BusinessException("You cannot delete yourself");
        }

        User user = userRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));
        if(user.getRole().getName().toUpperCase().equals(UserRole.ROOT.name())){
            throw new BusinessException("Root user cannot be deleted");
        }

        if(!loggedInUser.getRole().getName().toUpperCase().equals(UserRole.ROOT.name())){

            if(user.getRole().getName().toUpperCase().equals(UserRole.ADMIN.name())){
                throw new BusinessException("Admin cannot be deleted");
            }
        }

        user.setDeleted(true);
        userRepository.save(user);
    }

    @Transactional
    @Override
    public UserRes UploadProfilePicture(long userId, MultipartFile file) throws IOException {
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        if(loggedInUser.getId() != userId){
            throw new BusinessException("You cannot update other user's profile picture");
        }
        String oldImage = loggedInUser.getProfilePicture();
        MultipartfileUtil.checkImage(file);
        String uniqueFileName = MultipartfileUtil.saveFile(file, uploadDir);
        if(oldImage != null){
            MultipartfileUtil.deleteFile(oldImage, uploadDir);
        }
        loggedInUser.setProfilePicture(uniqueFileName);
//        String oldImage = loggedInUser.getProfilePicture();
//        String  uniqueFileName = s3Service.uploadPublicFile(awsUploadDir, file);
//        MultipartfileUtil.saveFile(file, uploadDir, uniqueFileName);
//        loggedInUser.setProfilePicture(uniqueFileName);
//        if(oldImage != null){
//            String oldKey = awsUploadDir + "/" + oldImage;
//            s3Service.deleteFile(oldKey);
//            MultipartfileUtil.deleteFile(oldImage, uploadDir);
//        }
        return userMapper.toUserRes(userRepository.save(loggedInUser));
    }

    @Override
    public UrlResource getProfilePicture(String imageName) throws IOException {

        return MultipartfileUtil.loadImageFile(imageName, uploadDir);
    }

    @Transactional
    @Override
    public UserRes updateRole(long userId, long roleId) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        if(loggedInUser.getId() == userId){
            throw new BusinessException("You cannot update your own role");
        }
        User user = userRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("User not found"));

        Role role = roleRepository.findById(roleId).orElseThrow(()->new ResourceNotFoundException("Role not found"));
        if(role.getName().toUpperCase().equals(UserRole.ROOT.name())){
            throw new BusinessException("Root role cannot be assigned");
        }
        user.setRole(role);
        return userMapper.toUserRes(userRepository.save(user));
    }

    @Override
    public TokenRes loginWithOAuth2Google(OAuthLoginReq oAuthLoginReq) throws IOException {
        NetHttpTransport transport = new NetHttpTransport();
        JacksonFactory jsonFactory = new JacksonFactory();
        GoogleIdTokenVerifier.Builder ver = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(idClient));
        GoogleIdToken googleIdToken = GoogleIdToken.parse(ver.getJsonFactory(), oAuthLoginReq.getToken());
        GoogleIdToken.Payload payload = googleIdToken.getPayload();
        String email = payload.getEmail();
        if(userRepository.existsByEmailAndIsDeletedIsFalse(email)){
            User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            user.setIsVerified(true);
            userRepository.save(user);
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                    user.getEmail(), user.getPassword());

            String tokenString = jwtTokenUtil.generateToken(user);

            return TokenRes.builder()
                    .token(tokenString)
                    .verified(user.getIsVerified())
                    .build();

        }else{
            User user = new User();
            user.setEmail(email);
            user.setFullName((String) payload.get("name"));
            user.setActivated(true);
            user.setRole(roleRepository.findByName(UserRole.LEARNER.name()).orElseThrow(()->new ResourceNotFoundException("Role not found")));
            userRepository.save(user);
            String tokenString = jwtTokenUtil.generateToken(user);

            return TokenRes.builder()
                    .token(tokenString)
                    .build();

        }
    }

    @Override
    public String getProfilePictureUrl(String imageName) {

        String url = String.format("https://%s.s3.%s.amazonaws.com/%s/%s", bucketName, region, awsUploadDir, imageName);
        return url.replaceAll("\\s+", "");
    }

    @Override
    public String generateResetPasswordToken(String email) throws MessagingException, IOException {

        User user = userRepository.findByEmailAndIsDeletedIsFalse(email).orElseThrow(()->new ResourceNotFoundException("User not found"));
        LocalDateTime now = LocalDateTime.now();
        if(user.getTimeGeneratedResetPasswordToken() != null && user.getTimeGeneratedResetPasswordToken().plusMinutes(3).isAfter(now)){
            throw new BusinessException("Vui lòng chờ 3 phút trước khi yêu cầu lại");
        }
        String token = jwtTokenUtil.generateResetPasswordToken(user);
        mailService.sendEmailResetPassword(user.getEmail(), user.getId(), token);
        user.setTimeGeneratedResetPasswordToken(now);
        userRepository.save(user);
        return token;
    }

    @Override
    public void resetPassword(ResetPasswordReq resetPasswordReq) {

        String email = jwtTokenUtil.extractEmail(resetPasswordReq.getToken());
        User user = userRepository.findByEmailAndIsDeletedIsFalse(email).orElseThrow(()->new ResourceNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(resetPasswordReq.getPassword()));
        userRepository.save(user);

    }

    @Override
    public void validateResetPasswordToken(String token, long userId) {

        User user = userRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("Yêu cầu không hợp lệ"));
        if(!jwtTokenUtil.validateToken(token, user)){
            throw new BusinessException("Yêu cầu không hợp lệ");
        }
    }

    @Override
    @Transactional
    public UserRes updateRoleInstruction() {

        User loggedInUser = (User) AuthUtil.getCurrentUser();


        Role role = roleRepository.findByName(UserRole.INSTRUCTOR.name()).orElseThrow(()->new ResourceNotFoundException("Role not found"));
        loggedInUser.setRole(role);
        return userMapper.toUserRes(userRepository.save(loggedInUser));
    }

    @Override
    public UserRes updateRoleAdmin(long userId) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        if(loggedInUser.getId() == userId){
            throw new BusinessException("You cannot update your own role");
        }
        User user = userRepository.findByIdAndIsDeletedIsFalse(userId).orElseThrow(()->new ResourceNotFoundException("User not found"));
        if(user.getRole().getName().equals(UserRole.ADMIN.name())){
            Role role = roleRepository.findByName(UserRole.LEARNER.name()).orElseThrow(()->new ResourceNotFoundException("Role not found"));
            user.setRole(role);
        }else if ( !user.getRole().getName().equals(UserRole.ROOT.name())){
            Role role = roleRepository.findByName(UserRole.ADMIN.name()).orElseThrow(()->new ResourceNotFoundException("Role not found"));
            user.setRole(role);
        }
        return userMapper.toUserRes(userRepository.save(user));
    }

    @Override
    public TokenRes validateEmailVerificationToken(String token, long userId) {

        User user = userRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("Yêu cầu không hợp lệ"));
        if(!jwtTokenUtil.validateToken(token, user)){
            throw new BusinessException("Yêu cầu không hợp lệ");
        }
        user.setIsVerified(true);
        userRepository.save(user);
        String tokenString = jwtTokenUtil.generateToken(user);
        return new TokenRes(tokenString, user.getIsVerified());
    }

    @Override
    public void sendVerificationEmail(String email) throws MessagingException, IOException {

        User user = userRepository.findByEmailAndIsDeletedIsFalse(email).orElseThrow(()->new ResourceNotFoundException("User not found"));
        LocalDateTime now = LocalDateTime.now();
        if(user.getTimeGeneratedVerificationToken() != null && user.getTimeGeneratedVerificationToken().plusMinutes(3).isAfter(now)){
            throw new BusinessException("Vui lòng chờ 3 phút trước khi yêu cầu lại");
        }
        String token = jwtTokenUtil.generateEmailVerificationToken(user);
        user.setTimeGeneratedVerificationToken(LocalDateTime.now());
        mailService.sendEmailVerification(user.getEmail(), user.getId(), token);
    }

  @Override
  public void backUpDatabase() throws IOException, InterruptedException {
        // Kiểm tra thư mục backup
        File backupDir = new File("D:/backup");
        if (!backupDir.exists() && !backupDir.mkdirs()) {
            throw new IOException("Không thể tạo thư mục backup tại: D:/backup");
        }

        String backupPath = "D:/backup/backup_" + System.currentTimeMillis() + ".dump";
        String command = "pg_dump -h localhost -U ltnguyen -F c -f " + backupPath + " ELearningDB";

        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command("cmd.exe", "/c", command);
        processBuilder.environment().put("PGPASSWORD", "000889");

        Process process = processBuilder.start();

        // Đọc lỗi từ stderr
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        StringBuilder errorOutput = new StringBuilder();
        String line;
        while ((line = errorReader.readLine()) != null) {
            errorOutput.append(line).append("\n");
        }

        int exitCode = process.waitFor();
        if (exitCode == 0) {
            System.out.println("Backup thành công tại: " + backupPath);
        } else {
            System.out.println("Backup thất bại.");
            System.err.println("Lỗi chi tiết: " + errorOutput.toString());
        }
    }



}
