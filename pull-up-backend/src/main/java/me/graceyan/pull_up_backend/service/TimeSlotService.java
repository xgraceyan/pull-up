package me.graceyan.pull_up_backend.service;

import com.mongodb.client.result.DeleteResult;
import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.model.TimeSlot;
import me.graceyan.pull_up_backend.repository.TimeSlotRepository;
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
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TimeSlotService {
    private final TimeSlotRepository timeSlotRepository;
    private final MongoTemplate mongoTemplate;

    public Optional<List<TimeSlot>> getAllByEventId(ObjectId eventId) {
        return timeSlotRepository.findTimeSlotsByEventId(eventId);
    }

    public Optional<List<TimeSlot>> getAllByEventAndUserId(ObjectId eventId, ObjectId userId) {
        return timeSlotRepository.findTimeSlotsByEventIdAndUserId(eventId, userId);
    }

    public Optional<List<TimeSlot>> getByDate(ObjectId eventId, ObjectId userId, LocalDate date) {
        return timeSlotRepository.findTimeSlotsByDate(eventId, userId, date);
    }

    public Optional<List<TimeSlot>> getByDateTime(ObjectId eventId, ObjectId userId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        return timeSlotRepository.findTimeSlotsByDateTime(eventId, userId, date, startTime, endTime);
    }

    public Optional<List<TimeSlot>> getByWeekDayTime(ObjectId eventId, ObjectId userId, DayOfWeek weekDay, LocalTime startTime, LocalTime endTime) {
        return timeSlotRepository.findTimeSlotsByWeekDayTime(eventId, userId, weekDay, startTime, endTime);
    }

    public void createTimeSlots(List<TimeSlot> timeSlots) {
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, TimeSlot.class);
        for(TimeSlot timeSlot : timeSlots) {
            Criteria timeSlotCriteria = Criteria.where("eventId").is(timeSlot.getEventId())
                    .and("userId").is(timeSlot.getUserId());

            if(timeSlot.getDate() != null) timeSlotCriteria.and("date").is(timeSlot.getDate());
            if(timeSlot.getStartTime() != null && timeSlot.getEndTime() != null)
                    timeSlotCriteria.and("startTime").is(timeSlot.getStartTime())
                            .and("endTime").is(timeSlot.getEndTime());
            if(timeSlot.getWeekDay() != null) timeSlotCriteria.and("weekDay").is(timeSlot.getWeekDay());

            Query timeSlotQuery = new Query(timeSlotCriteria);

            Update update = new Update()
                    .set("status", timeSlot.getStatus())
                    .currentDate("updatedAt");

            bulkOperations.upsert(timeSlotQuery, update);
        }
        bulkOperations.execute();
    }

    public long deleteTimeSlots(List<ObjectId> ids) {
        Query deleteQuery = new Query(Criteria.where("_id").in(ids));
        DeleteResult deleteResult =  mongoTemplate.remove(deleteQuery, TimeSlot.class);
        return deleteResult.getDeletedCount();
    }

}
