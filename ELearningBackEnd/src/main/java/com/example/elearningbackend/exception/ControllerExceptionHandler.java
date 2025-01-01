package com.example.elearningbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionMessage> NotFoundExceptionHandler(
            ResourceNotFoundException e, WebRequest webRequest) {

        ExceptionMessage exceptionMessage =
                new ExceptionMessage(
                        HttpStatus.NOT_FOUND.value(),
                        LocalDateTime.now(),
                        e.getMessage(),
                        webRequest.getDescription(false));

        return new ResponseEntity<>(exceptionMessage, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ExceptionMessage> businessExceptionHandler(
            BusinessException e, WebRequest webRequest) {

        ExceptionMessage exceptionMessage =
                new ExceptionMessage(
                        HttpStatus.BAD_REQUEST.value(),
                        LocalDateTime.now(),
                        e.getMessage(),
                        webRequest.getDescription(false));

        return new ResponseEntity<>(exceptionMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ExceptionMessage> authenticationExceptionHandler(
            AuthenticationException e, WebRequest webRequest) {

        ExceptionMessage exceptionMessage =
                new ExceptionMessage(
                        HttpStatus.UNAUTHORIZED.value(),
                        LocalDateTime.now(),
                        e.getMessage(),
                        webRequest.getDescription(false));

        return new ResponseEntity<>(exceptionMessage, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ExceptionMessage> forbiddenExceptionHandler(
            ForbiddenException e, WebRequest webRequest) {

        ExceptionMessage exceptionMessage =
                new ExceptionMessage(
                        HttpStatus.FORBIDDEN.value(),
                        LocalDateTime.now(),
                        e.getMessage(),
                        webRequest.getDescription(false));

        return new ResponseEntity<>(exceptionMessage, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ExceptionMessage> authorizationDeniedExceptionHandler(
            AuthorizationDeniedException e, WebRequest webRequest) {

        ExceptionMessage exceptionMessage =
                new ExceptionMessage(
                        HttpStatus.UNAUTHORIZED.value(),
                        LocalDateTime.now(),
                        "Authorization denied",
                        webRequest.getDescription(false));

        return new ResponseEntity<>(exceptionMessage, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionMessage> globalExceptionHandler(
            Exception e, WebRequest webRequest) {

        ExceptionMessage exceptionMessage =
                new ExceptionMessage(
                        HttpStatus.BAD_REQUEST.value(),
                        LocalDateTime.now(),
                        e.getMessage(),
                        webRequest.getDescription(false));

        return new ResponseEntity<>(exceptionMessage, HttpStatus.BAD_REQUEST);
    }
}
