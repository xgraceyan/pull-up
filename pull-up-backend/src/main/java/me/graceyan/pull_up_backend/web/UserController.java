package me.graceyan.pull_up_backend.web;

import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.exception.UserCreateException;
import me.graceyan.pull_up_backend.exception.UserLoginException;
import me.graceyan.pull_up_backend.model.User;
import me.graceyan.pull_up_backend.request.UserLoginRequest;
import me.graceyan.pull_up_backend.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    // For testing only, exposes db id
    @GetMapping("/users/{id}")
    public ResponseEntity<Optional<User>> getById(@PathVariable ObjectId id) {
        return new ResponseEntity<>(userService.getById(id), HttpStatus.OK);
    }

    @PostMapping("/events/{eventId}/users/login")
    public ResponseEntity<User> loginUser(@PathVariable ObjectId eventId, @RequestBody UserLoginRequest loginRequest) {
        return new ResponseEntity<>(userService.login(loginRequest.getName(), loginRequest.getPasswordRaw(), eventId), HttpStatus.OK);
    }

    @PostMapping("/events/{eventId}/users/create")
    public ResponseEntity<User> createUser(@PathVariable ObjectId eventId, @RequestBody Map<String, String> payload) {
        return new ResponseEntity<>(userService.createUser(payload.get("name"), payload.get("passwordRaw"), eventId), HttpStatus.CREATED);
    }

    @DeleteMapping("/events/{eventId}/users/{userId}/delete")
    public ResponseEntity<String> deleteUserAndTimeslots(@PathVariable ObjectId eventId, @PathVariable ObjectId userId) {
        userService.deleteUserAndTimeslots(userId, eventId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(UserCreateException.class)
    public ResponseEntity<String> handleUserCreateError(UserCreateException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserLoginException.class)
    public ResponseEntity<String> handleUserLoginError(UserLoginException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
    }
}
