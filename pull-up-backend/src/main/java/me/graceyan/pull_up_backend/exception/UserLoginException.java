package me.graceyan.pull_up_backend.exception;

public class UserLoginException extends RuntimeException {
    public UserLoginException(String message) {
        super("User login error: " + message);
    }

    public UserLoginException(String message, Throwable cause) {
        super("User login error: " + message, cause);
    }
}
