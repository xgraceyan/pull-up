package me.graceyan.pull_up_backend.service;

import com.mongodb.DuplicateKeyException;
import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.exception.UserCreateException;
import me.graceyan.pull_up_backend.model.Event;
import me.graceyan.pull_up_backend.model.User;
import me.graceyan.pull_up_backend.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getById(@PathVariable ObjectId id) {
        return userRepository.findById(id);
    }

    public User createUser(String name, String passwordRaw, String eventId) {
        try {
            User user = userRepository.insert(new User(name, passwordEncoder.encode(passwordRaw)));
            mongoTemplate.update(Event.class)
                    .matching(Criteria.where("_id").is(eventId))
                    .apply(new Update().push("userIds").value(user))
                    .first();
            return user;
        } catch(DuplicateKeyException e) {
            throw new UserCreateException("Duplicate user found", e);
        }
    }
}
