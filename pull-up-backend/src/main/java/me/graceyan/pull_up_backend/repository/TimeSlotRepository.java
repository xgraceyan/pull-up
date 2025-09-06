package me.graceyan.pull_up_backend.repository;

import me.graceyan.pull_up_backend.model.TimeSlot;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends MongoRepository<TimeSlot, ObjectId> {
    List<TimeSlot> findTimeSlotsByEventId(ObjectId eventId);
    List<TimeSlot> findTimeSlotsByEventIdAndUserId(ObjectId eventId, ObjectId userId);

    @Query("{ 'eventId': ?0, 'userId': ?1, 'date': ?2 }")
    List<TimeSlot> findTimeSlotsByDate(ObjectId eventId, ObjectId userId, LocalDate date);

    @Query("{ 'eventId': ?0, 'userId': ?1, 'date': ?2, 'startTime': { $lte: ?4 }, 'endTime': { $gte: ?3 } }")
    List<TimeSlot> findTimeSlotsByDateTime(ObjectId eventId, ObjectId userId, LocalDate date, LocalTime startTime, LocalTime endTime);

    @Query("{ 'eventId': ?0, 'userId': ?1, 'weekDay': ?2, 'startTime': { $lte: ?4 }, 'endTime': { $gte: ?3 } }")
    List<TimeSlot> findTimeSlotsByWeekDayTime(ObjectId eventId, ObjectId userId, DayOfWeek weekDay, LocalTime startTime, LocalTime endTime);

    void deleteTimeSlotById(ObjectId id);
    void deleteTimeSlotByEventIdAndUserIdAndDate(ObjectId eventId, ObjectId userId, LocalDate date);
    void deleteTimeSlotByEventIdAndUserIdAndDateAndStartTimeGreaterThanEqualAndEndTimeIsLessThanEqual(ObjectId eventId, ObjectId userId, LocalDate date, LocalTime startTime, LocalTime endTime);
    void deleteTimeSlotByEventIdAndUserIdAndWeekDayAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(ObjectId eventId, ObjectId userId, DayOfWeek weekDay, LocalTime startTime, LocalTime endTime);

}

