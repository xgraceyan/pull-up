package me.graceyan.pull_up_backend.web;

import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.model.Event;
import me.graceyan.pull_up_backend.request.EventRequest;
import me.graceyan.pull_up_backend.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return new ResponseEntity<>(eventService.getAllEvents(), HttpStatus.OK);
    }

    @GetMapping("/{urlAlias}")
    public ResponseEntity<Optional<Event>> getByUrlAlias(@PathVariable String urlAlias) {
        Optional<Event> event = eventService.getByUrlAlias(urlAlias);
        if(event.isPresent()) {
            return new ResponseEntity<>(event, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{urlAlias}/exists")
    public ResponseEntity<Boolean> checkIfUrlAliasExists(@PathVariable String urlAlias) {
        Optional<Event> event = eventService.getByUrlAlias(urlAlias);
        return ResponseEntity.ok(event.isPresent());
    }

    @PostMapping("/create")
    public ResponseEntity<Event> createEvent(@RequestBody EventRequest eventRequest) {
        // TODO: Make event request
        Event event = eventService.createEvent(
                eventRequest.getUrlAlias(),
                eventRequest.getName(),
                eventRequest.getType(),
                eventRequest.getTimezone(),
                eventRequest.getExcludeDaysOfWeek(),
                eventRequest.getStartTime(),
                eventRequest.getEndTime(),
                eventRequest.getStartDate(),
                eventRequest.getEndDate()
        );
        return new ResponseEntity<>(event, HttpStatus.OK);
    }
}
