package me.graceyan.pull_up_backend.repository;

import me.graceyan.pull_up_backend.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    Optional<User> findUserByNameAndEventId(String name, ObjectId eventId);
}
