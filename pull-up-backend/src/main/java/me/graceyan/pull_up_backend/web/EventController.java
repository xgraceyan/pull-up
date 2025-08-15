package me.graceyan.pull_up_backend.web;

import lombok.RequiredArgsConstructor;
import me.graceyan.pull_up_backend.model.Event;
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
        return new ResponseEntity<>(eventService.getByUrlAlias(urlAlias), HttpStatus.OK);
    }
}
