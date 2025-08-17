package me.graceyan.pull_up_backend.service;

import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.model.Event;
import me.graceyan.pull_up_backend.repository.EventRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

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
}
