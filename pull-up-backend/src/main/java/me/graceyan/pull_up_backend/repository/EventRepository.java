package me.graceyan.pull_up_backend.repository;

import me.graceyan.pull_up_backend.model.Event;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, ObjectId> {
    Optional<Event> findEventByUrlAlias(String urlAlias);
    Optional<Event> findEventByPublicId(String publicId);
}
