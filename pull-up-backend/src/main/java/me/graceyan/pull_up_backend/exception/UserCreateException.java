package me.graceyan.pull_up_backend.exception;

public class UserCreateException extends RuntimeException {
    public UserCreateException(String message, Throwable cause) {
        super(message, cause);
    }
}
