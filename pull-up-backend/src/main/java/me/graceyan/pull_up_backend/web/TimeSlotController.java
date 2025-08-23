package me.graceyan.pull_up_backend.web;

import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.model.TimeSlot;
import me.graceyan.pull_up_backend.service.TimeSlotService;
import org.bson.types.ObjectId;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/timeslots")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TimeSlotController {
    private final TimeSlotService timeSlotService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Optional<List<TimeSlot>>> getAllByEventId(@PathVariable ObjectId eventId) {
        return new ResponseEntity<>(timeSlotService.getAllByEventId(eventId), HttpStatus.OK);
    }

    @GetMapping("/event/{eventId}/user/{userId}")
    public ResponseEntity<Optional<List<TimeSlot>>> getAllByEventAndUserId(@PathVariable ObjectId eventId, @PathVariable ObjectId userId) {
        return new ResponseEntity<>(timeSlotService.getAllByEventAndUserId(eventId, userId), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<List<TimeSlot>> createTimeSlots(@RequestBody List<Map<String, String>> payload) {
        List<TimeSlot> timeSlots = new ArrayList<>();
        for(Map<String, String> entry : payload) {
            TimeSlot ts = new TimeSlot(
                    new ObjectId(entry.get("eventId")),
                    new ObjectId(entry.get("userId")),
                    LocalTime.parse(entry.get("startTime")),
                    LocalTime.parse(entry.get("endTime")),
                    LocalDate.parse(entry.get("date")),
                    DayOfWeek.valueOf(entry.get("weekDay")),
                    entry.get("status")
            );
            timeSlots.add(ts);
        }
        timeSlotService.createTimeSlots(timeSlots);
        return new ResponseEntity<>(timeSlots, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Long> deleteTimeSlots(@RequestBody List<String> idPayload) {
        List<ObjectId> timeSlotIds = idPayload.stream().map(ObjectId::new).toList();
        return new ResponseEntity<>(timeSlotService.deleteTimeSlots(timeSlotIds), HttpStatus.OK);
    }
}
