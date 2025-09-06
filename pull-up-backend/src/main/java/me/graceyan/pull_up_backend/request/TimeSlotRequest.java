package me.graceyan.pull_up_backend.request;

import lombok.Data;
import org.bson.types.ObjectId;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TimeSlotRequest {
    private ObjectId eventId;
    private ObjectId userId;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate date;
    private DayOfWeek weekDay;
    private String status;
}
