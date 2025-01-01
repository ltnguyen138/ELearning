package com.example.elearningbackend.history.action;

import com.example.elearningbackend.action.ActionHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/actions")
public class ActionController {

    private final ActionService actionService;

    @GetMapping
    public Page<ActionHistory> getActionHistory(Pageable pageable, ActionQuery actionQuery) {
        return actionService.getActionHistory(pageable, actionQuery);
    }

    @GetMapping("/{id}")
    public ActionHistory getById(@PathVariable Long id) {
        return actionService.getById(id);
    }
}
