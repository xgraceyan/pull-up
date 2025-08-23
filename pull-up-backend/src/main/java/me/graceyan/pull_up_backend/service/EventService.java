package me.graceyan.pull_up_backend.service;

import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.model.Event;
import me.graceyan.pull_up_backend.repository.EventRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getByUrlAlias(String urlAlias) {
        return eventRepository.findEventByUrlAlias(urlAlias);
    }

    public Optional<Event> getById(ObjectId id) {
        return eventRepository.findById(id);
    }

    public Optional<Event> getByPublicId(String publicId) {
        return eventRepository.findEventByPublicId(publicId);
    }

    public String generatePublicId() {
        String publicId;
        do {
            publicId = RandomStringUtils.randomAlphanumeric(8);
        } while(this.getByPublicId(publicId).isPresent());
        return publicId;
    }

    public Event createEvent(
            String urlAlias, String name, String type,
            String timezone, List<DayOfWeek> excludeDaysOfWeek, LocalTime startTime, LocalTime endTime,
            LocalDate startDate, LocalDate endDate
    ) {
        String publicId = this.generatePublicId();
        if(urlAlias == null || urlAlias.isEmpty()) urlAlias = publicId;
        return eventRepository.insert(new Event(publicId, urlAlias, name, type, timezone, excludeDaysOfWeek, startTime, endTime, startDate, endDate));
    }
}
