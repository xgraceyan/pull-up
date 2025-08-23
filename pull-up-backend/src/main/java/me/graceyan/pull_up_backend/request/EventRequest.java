package me.graceyan.pull_up_backend.request;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class EventRequest {
    private String urlAlias;
    private String name;
    private String type;
    private String timezone;
    private List<DayOfWeek> excludeDaysOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate startDate;
    private LocalDate endDate;
}
