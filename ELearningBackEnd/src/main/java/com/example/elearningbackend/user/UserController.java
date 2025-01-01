package com.example.elearningbackend.user;

import com.example.elearningbackend.user.user_course.UserCourseService;
import com.example.elearningbackend.user.user_course.UserCourseShortRes;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserCourseService userCourseService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public Page<UserRes> getUsers(Pageable pageable, UserQuery userQuery) {
        return userService.getUsers(pageable, userQuery);
    }

    @GetMapping("/public/{id}")
    public UserRes getUserById(@PathVariable long id) {
        return userService.getById(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public UserRes updateUser(@RequestBody UserReq userReq, @PathVariable long id) {
        return userService.updateUser(userReq, id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public void deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
    }

    @PatchMapping("/{id}/toggle-activation")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public UserRes toggleActivation(@PathVariable long id) {
        return userService.toggleActivation(id);
    }

    @PostMapping("/upload-profile-picture/{userId}")
    public UserRes uploadProfilePicture(@PathVariable long userId, @RequestPart("image") MultipartFile image) throws IOException {

        return userService.UploadProfilePicture(userId, image);
    }

    @GetMapping("/profile-picture/{imageName}")
    public ResponseEntity<UrlResource> getProfilePicture(@PathVariable String imageName) throws IOException {

        return ResponseEntity.ok()
                .contentType(imageName.endsWith(".png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG)
                .body(userService.getProfilePicture(imageName));
    }


    @PutMapping("/{userId}/update-role/{roleId}")
    @PreAuthorize("hasRole('ROOT')")
    public UserRes updateRole(@PathVariable long userId, @PathVariable long roleId) {
        return userService.updateRole(userId, roleId);
    }

    @GetMapping("/profile-picture-url/{imageName}")
    public ResponseEntity<String> getProfilePictureUrl(@PathVariable String imageName) {

        return ResponseEntity.ok(userService.getProfilePictureUrl(imageName));
    }

  @GetMapping("/backup-database")
  public void backUpDatabase() throws IOException, InterruptedException {
        userService.backUpDatabase();
    }
}
