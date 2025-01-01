package com.example.elearningbackend.notification;

import com.example.elearningbackend.user.User;
import com.example.elearningbackend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;
    public Page<NotificationRes> getByUser(Pageable pageable){

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        return notificationRepository.findByUserId(loggedInUser.getId(), pageable).map(notificationMapper::toNotificationRes);
    }

    public List<NotificationRes> getTop8ByUser(){
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        List<Notification> notifications = notificationRepository.findTop8ByUserIdOrderByTimestampDesc(loggedInUser.getId());
        return notifications.stream().map(notificationMapper::toNotificationRes).toList();
    }

    List<NotificationRes> getTop4ByUser(){
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        List<Notification> notifications = notificationRepository.findTop4ByUserIdOrderByTimestampDesc(loggedInUser.getId());
        return notifications.stream().map(notificationMapper::toNotificationRes).toList();
    }

    public Notification saveNotification(Notification notification){
        return notificationRepository.save(notification);
    }

    public List<Notification> saveNotifications(List<Notification> notifications){
        return notificationRepository.saveAll(notifications);
    }

    public void sendNotification(Notification notification){
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(notification.getUser().getId()), "/notification", notificationMapper.toNotificationRes(notification));
    }

    public void sendNotifications(List<Notification> notifications){

        saveNotifications(notifications).forEach(this::sendNotification);
    }

    public NotificationRes readNotification(long id){
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setRead(true);
        notificationRepository.save(notification);
        return notificationMapper.toNotificationRes(notification);
    }

    public List<NotificationRes> getTop8UnreadByUser(){
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        List<Notification> notifications = notificationRepository.findTop8ByUserIdAndReadOrderByTimestampDesc(loggedInUser.getId(), false);
        return notifications.stream().map(notificationMapper::toNotificationRes).toList();
    }

    public List<NotificationRes>getTop4UnreadByUser(){
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        List<Notification> notifications = notificationRepository.findTop4ByUserIdAndReadOrderByTimestampDesc(loggedInUser.getId(), false);
        return notifications.stream().map(notificationMapper::toNotificationRes).toList();
    }

    public void deleteNotification(long id){
        notificationRepository.deleteById(id);
    }

    public void deleteAllByUser(){
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        notificationRepository.deleteAllByUserId(loggedInUser.getId());
    }

    public void readAllByUser(){
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        List<Notification> notifications = notificationRepository.findAllByReadIsFalseAndUserId(loggedInUser.getId());
        notifications.stream().forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
}

