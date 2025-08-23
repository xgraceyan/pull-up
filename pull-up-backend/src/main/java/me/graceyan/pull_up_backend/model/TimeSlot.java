package me.graceyan.pull_up_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "timeslots")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlot {
    @Id
    private ObjectId id;

    private ObjectId eventId;

    private ObjectId userId;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDate date;

    private DayOfWeek weekDay;

    private String status = "available"; // "available" | "not preferred"

    @LastModifiedDate
    private Instant updatedAt;

    public TimeSlot(ObjectId eventId, ObjectId userId, LocalTime startTime, LocalTime endTime, LocalDate date, DayOfWeek weekDay, String status) {
        this.eventId = eventId;
        this.userId = userId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.date = date;
        this.weekDay = weekDay;
        this.status = status;
    }

    // Constructor for date time
    public TimeSlot(ObjectId eventId, ObjectId userId, LocalTime startTime, LocalTime endTime, LocalDate date, String status) {
        this.eventId = eventId;
        this.userId = userId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.date = date;
        this.weekDay = null;
        this.status = status;
    }

    // Constructor for date only
    public TimeSlot(ObjectId eventId, ObjectId userId, LocalDate date, String status) {
        this.eventId = eventId;
        this.userId = userId;
        this.date = date;
        this.startTime = LocalTime.of(0, 0);
        this.endTime = LocalTime.of(23, 59);
        this.weekDay = null;
        this.status = status;
    }

    // Constructor for day of week
    public TimeSlot(ObjectId eventId, ObjectId userId, LocalTime startTime, LocalTime endTime, DayOfWeek weekDay, String status) {
        this.eventId = eventId;
        this.userId = userId;
        this.weekDay = weekDay;
        this.startTime = startTime;
        this.endTime = endTime;
        this.date = null;
        this.status = status;
    }
}
