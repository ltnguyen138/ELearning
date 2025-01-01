package com.example.elearningbackend.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public Page<NotificationRes> getPage(Pageable pageable) {

        return notificationService.getByUser(pageable);
    }

    @GetMapping("/top8")
    public List<NotificationRes> getTop8() {

        return notificationService.getTop8ByUser();
    }

    @GetMapping("/top4")
    public List<NotificationRes> getTop4() {

        return notificationService.getTop4ByUser();
    }

    @GetMapping("/top8/unread")
    public List<NotificationRes> getTop8Unread() {

        return notificationService.getTop8UnreadByUser();
    }

    @GetMapping("/top4/unread")
    public List<NotificationRes> getTop4Unread() {

        return notificationService.getTop4UnreadByUser();
    }

    @PutMapping("/read/{id}")
    public NotificationRes read(@PathVariable long id) {

        return notificationService.readNotification(id);
    }

    @DeleteMapping
    public void deleteAll() {

        notificationService.deleteAllByUser();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {

        notificationService.deleteNotification(id);
    }

    @PutMapping("/read/all")
    public void readAll() {

        notificationService.readAllByUser();
    }
}
