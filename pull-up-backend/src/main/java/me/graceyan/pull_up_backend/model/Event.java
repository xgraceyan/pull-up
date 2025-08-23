package me.graceyan.pull_up_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
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

    @Indexed(unique = true)
    private String publicId;

    @Indexed(unique = true)
    private String urlAlias; // publicId by default

    private String name;

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

    public Event(
            String publicId, String urlAlias, String name, String type,
            String timezone, List<DayOfWeek> excludeDaysOfWeek, LocalTime startTime, LocalTime endTime,
            LocalDate startDate, LocalDate endDate)
    {
        this.publicId = publicId;
        this.urlAlias = urlAlias;
        this.name = name;
        this.type = type;
        this.timezone = timezone;
        this.excludeDaysOfWeek = excludeDaysOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
