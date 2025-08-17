package me.graceyan.pull_up_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Document(collection = "events")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Event {
    @Id
    private ObjectId id;

    private String publicId;

    private String name;

    private String urlAlias; // publicId by default

    private String type; // Weekly, DayTime, Day Only

    private String timezone; // Default timezone

    private List<DayOfWeek> excludeDaysOfWeek;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDate startDate; // "2025-08-15"

    private LocalDate endDate;

    @CreatedDate
    private Instant createdAt;

    @DocumentReference
    private List<User> userIds;
}
