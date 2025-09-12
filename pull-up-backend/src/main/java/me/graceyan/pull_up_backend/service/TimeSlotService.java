package me.graceyan.pull_up_backend.service;

import com.mongodb.client.result.DeleteResult;
import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.model.TimeSlot;
import me.graceyan.pull_up_backend.repository.TimeSlotRepository;
import me.graceyan.pull_up_backend.request.TimeSlotRequest;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TimeSlotService {
    private final TimeSlotRepository timeSlotRepository;
    private final MongoTemplate mongoTemplate;

    public List<TimeSlot> getAllByEventId(ObjectId eventId) {
        return timeSlotRepository.findTimeSlotsByEventId(eventId);
    }

    public List<TimeSlot> getAllByEventAndUserId(ObjectId eventId, ObjectId userId) {
        return timeSlotRepository.findTimeSlotsByEventIdAndUserId(eventId, userId);
    }

    public List<TimeSlot> getByUserDate(ObjectId eventId, ObjectId userId, LocalDate date) {
        return timeSlotRepository.findTimeSlotsByUserDate(eventId, userId, date);
    }

    public List<TimeSlot> getByUserDateTime(ObjectId eventId, ObjectId userId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        return timeSlotRepository.findTimeSlotsByUserDateTime(eventId, userId, date, startTime, endTime);
    }

    public List<TimeSlot> getByUserWeekDayTime(ObjectId eventId, ObjectId userId, DayOfWeek weekDay, LocalTime startTime, LocalTime endTime) {
        return timeSlotRepository.findTimeSlotsByUserWeekDayTime(eventId, userId, weekDay, startTime, endTime);
    }

    public List<TimeSlot> getByWeekDayTime(ObjectId eventId, DayOfWeek weekDay, LocalTime startTime, LocalTime endTime) {
        return timeSlotRepository.findTimeSlotsByWeekDayTime(eventId, weekDay, startTime, endTime);
    }

    public Criteria buildTimeSlotCriteria(TimeSlot timeSlot) {
        Criteria timeSlotCriteria = Criteria.where("eventId").is(timeSlot.getEventId())
                .and("userId").is(timeSlot.getUserId());

        if(timeSlot.getDate() != null) timeSlotCriteria.and("date").is(timeSlot.getDate());
        if(timeSlot.getStartTime() != null && timeSlot.getEndTime() != null)
            timeSlotCriteria.and("startTime").is(timeSlot.getStartTime())
                    .and("endTime").is(timeSlot.getEndTime());
        if(timeSlot.getWeekDay() != null) timeSlotCriteria.and("weekDay").is(timeSlot.getWeekDay());
        return timeSlotCriteria;
    }

    public void createTimeSlots(List<TimeSlot> timeSlots) {
        if(timeSlots.isEmpty()) return;
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, TimeSlot.class);
        for(TimeSlot timeSlot : timeSlots) {
            Query timeSlotQuery = new Query(this.buildTimeSlotCriteria(timeSlot));

            Update update = new Update()
                    .set("status", timeSlot.getStatus())
                    .currentDate("updatedAt");

            bulkOperations.upsert(timeSlotQuery, update);
        }
        bulkOperations.execute();
    }

    private String buildKey(TimeSlot timeSlot) {
        String key = "";
        if(timeSlot.getDate() != null) {
            key += timeSlot.getDate() + "|";
        } else if(timeSlot.getWeekDay() != null) {
            key += timeSlot.getWeekDay() + "|";
        }
        if(timeSlot.getStartTime() != null && timeSlot.getEndTime() != null) {
            key += timeSlot.getStartTime() + "_" + timeSlot.getEndTime();
        }
        return key;
    }

    public void setTimeSlots(ObjectId eventId, ObjectId userId, List<TimeSlot> timeSlots) {
        // Remove any existing not in timeSlots
        BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, TimeSlot.class);
        List<TimeSlot> existingTimeSlots = this.getAllByEventAndUserId(eventId, userId);

        Set<String> newKeys = new HashSet<>();
        for (TimeSlot timeSlot : timeSlots) {
            newKeys.add(buildKey(timeSlot));
        }

        boolean hasOperations = false;
        for(TimeSlot existing : existingTimeSlots) {
            if(!newKeys.contains(buildKey(existing))) {
                hasOperations = true;
                bulkOps.remove(new Query(buildTimeSlotCriteria(existing)));
            }
        }
        if(hasOperations) {
            bulkOps.execute();
        }

        this.createTimeSlots(timeSlots);
    }


    public long deleteTimeSlotsById(List<ObjectId> ids) {
        Query deleteQuery = new Query(Criteria.where("_id").in(ids));
        DeleteResult deleteResult =  mongoTemplate.remove(deleteQuery, TimeSlot.class);
        return deleteResult.getDeletedCount();
    }

    public long deleteTimeSlotsByUser(ObjectId eventId, ObjectId userId) {
        return timeSlotRepository.deleteTimeSlotsByEventIdAndUserId(eventId, userId);
    }

    public List<TimeSlot> requestToTimeSlot(List<TimeSlotRequest> timeSlotRequests) {
        List<TimeSlot> timeSlots = new ArrayList<>();
        for(TimeSlotRequest req : timeSlotRequests) {
            TimeSlot ts = new TimeSlot(
                    req.getEventId(),
                    req.getUserId(),
                    req.getStartTime(),
                    req.getEndTime(),
                    req.getDate(),
                    req.getWeekDay(),
                    req.getStatus()
            );
            timeSlots.add(ts);
        }
        return timeSlots;
    }
}
