package me.graceyan.pull_up_backend.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@CompoundIndex(name = "unique_name_event", def = "{'name': 1, 'eventId': 1}", unique = true)
public class User {
    @Id
    private ObjectId id;

    private String name;

    private String passwordHash;

    @CreatedDate
    private Instant createdAt;

    private ObjectId eventId;

    public User(String name, String passwordHash, ObjectId eventId) {
        this.name = name;
        this.passwordHash = passwordHash;
        this.eventId = eventId;
    }
}
