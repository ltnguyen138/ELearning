package com.example.elearningbackend.exception;

public class AuthorizationDeniedException extends RuntimeException{

    private static final long serialVersionUID = 1L;

    public AuthorizationDeniedException(String msg) {
        super(msg);
    }
}
