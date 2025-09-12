package me.graceyan.pull_up_backend.service;

import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.exception.UserCreateException;
import me.graceyan.pull_up_backend.exception.UserLoginException;
import me.graceyan.pull_up_backend.model.Event;
import me.graceyan.pull_up_backend.model.User;
import me.graceyan.pull_up_backend.repository.TimeSlotRepository;
import me.graceyan.pull_up_backend.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;
    private final TimeSlotRepository timeSlotRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getById(ObjectId id) {
        return userRepository.findById(id);
    }

    public User login(String name, String passwordRaw, ObjectId eventId) {
        User user = userRepository.findUserByNameAndEventId(name, eventId).orElseThrow(() -> new UserLoginException("User not found"));
        if(!passwordEncoder.matches(passwordRaw, user.getPasswordHash())) {
            throw new UserLoginException("Invalid password");
        }
        return user;
    }

    public User createUser(String name, String passwordRaw, ObjectId eventId) {
        try {
            String password = passwordRaw;
            if(!passwordRaw.isEmpty()) password = passwordEncoder.encode(passwordRaw);
            User user = userRepository.insert(new User(name, password, eventId));
            mongoTemplate.update(Event.class)
                    .matching(Criteria.where("_id").is(eventId))
                    .apply(new Update().addToSet("userIds").value(user))
                    .first();
            return user;
        } catch(DuplicateKeyException e) {
            throw new UserCreateException("Duplicate user found", e);
        }
    }

    @Transactional
    public void deleteUserAndTimeslots(ObjectId userId, ObjectId eventId) {
        timeSlotRepository.deleteTimeSlotsByEventIdAndUserId(eventId, userId);
        userRepository.deleteUserByIdAndEventId(userId, eventId);
    }
}
