package me.graceyan.pull_up_backend.web;

import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.model.TimeSlot;
import me.graceyan.pull_up_backend.model.User;
import me.graceyan.pull_up_backend.repository.UserRepository;
import me.graceyan.pull_up_backend.request.TimeSlotRequest;
import me.graceyan.pull_up_backend.service.TimeSlotService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/timeslots")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TimeSlotController {
    private final TimeSlotService timeSlotService;
    private final UserRepository userRepository;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<TimeSlot>> getAllByEventId(@PathVariable ObjectId eventId) {
        return new ResponseEntity<>(timeSlotService.getAllByEventId(eventId), HttpStatus.OK);
    }

    @GetMapping("/event/{eventId}/user/{userId}")
    public ResponseEntity<List<TimeSlot>> getAllByEventAndUserId(@PathVariable ObjectId eventId, @PathVariable ObjectId userId) {
        return new ResponseEntity<>(timeSlotService.getAllByEventAndUserId(eventId, userId), HttpStatus.OK);
    }

    @GetMapping("/event/{eventId}/user/{userId}/date")
    public ResponseEntity<List<TimeSlot>> getByUserDate(
            @PathVariable ObjectId eventId, @PathVariable ObjectId userId,
            @RequestParam LocalDate date
    ) {
        return new ResponseEntity<>(timeSlotService.getByUserDate(eventId, userId, date), HttpStatus.OK);
    }

    @GetMapping("/event/{eventId}/user/{userId}/datetime")
    public ResponseEntity<List<TimeSlot>> getByUserDateTime(
            @PathVariable ObjectId eventId, @PathVariable ObjectId userId,
            @RequestParam LocalDate date, @RequestParam LocalTime startTime, @RequestParam LocalTime endTime
    ) {
        return new ResponseEntity<>(timeSlotService.getByUserDateTime(eventId, userId, date, startTime, endTime), HttpStatus.OK);
    }

    @GetMapping("/event/{eventId}/user/{userId}/weekdaytime")
    public ResponseEntity<List<TimeSlot>> getByUserWeekDayTime(
            @PathVariable ObjectId eventId, @PathVariable ObjectId userId,
            @RequestParam DayOfWeek weekDay, @RequestParam LocalTime startTime, @RequestParam LocalTime endTime
    ) {
        return new ResponseEntity<>(timeSlotService.getByUserWeekDayTime(eventId, userId, weekDay, startTime, endTime), HttpStatus.OK);
    }

    @GetMapping("/event/{eventId}/weekdaytime")
    public ResponseEntity<List<TimeSlot>> getByWeekDayTime(
            @PathVariable ObjectId eventId,
            @RequestParam DayOfWeek weekDay, @RequestParam LocalTime startTime, @RequestParam LocalTime endTime
    ) {
        return new ResponseEntity<>(timeSlotService.getByWeekDayTime(eventId, weekDay, startTime, endTime), HttpStatus.OK);
    }

    @GetMapping("/event/{eventId}/weekdaytime/users")
    public ResponseEntity<List<User>> getUsersByWeekDayTime(
            @PathVariable ObjectId eventId,
            @RequestParam DayOfWeek weekDay, @RequestParam LocalTime startTime, @RequestParam LocalTime endTime
    ) {
        List<TimeSlot> timeSlots = timeSlotService.getByWeekDayTime(eventId, weekDay, startTime, endTime);
        Set<ObjectId> userIds = timeSlots.stream().map(TimeSlot::getUserId).collect(Collectors.toSet());
        return new ResponseEntity<>(userRepository.findAllById(userIds), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<List<TimeSlot>> createTimeSlots(@RequestBody List<TimeSlotRequest> timeSlotRequests) {
        List<TimeSlot> timeSlots = timeSlotService.requestToTimeSlot(timeSlotRequests);
        timeSlotService.createTimeSlots(timeSlots);
        return new ResponseEntity<>(timeSlots, HttpStatus.OK);
    }

    @PutMapping("/event/{eventId}/user/{userId}/set")
    public ResponseEntity<List<TimeSlot>> setTimeSlots(@PathVariable ObjectId eventId, @PathVariable ObjectId userId, @RequestBody List<TimeSlotRequest> timeSlotRequests) {
        List<TimeSlot> timeSlots = timeSlotService.requestToTimeSlot(timeSlotRequests);
        timeSlotService.setTimeSlots(eventId, userId, timeSlots);
        return new ResponseEntity<>(timeSlots, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Long> deleteTimeSlots(@RequestBody List<String> idPayload) {
        List<ObjectId> timeSlotIds = idPayload.stream().map(ObjectId::new).toList();
        return new ResponseEntity<>(timeSlotService.deleteTimeSlotsById(timeSlotIds), HttpStatus.OK);
    }


}
