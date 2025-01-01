package com.example.elearningbackend.history.action;

import com.example.elearningbackend.action.ActionHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActionService {

    private final ActionHistoryRepository actionHistoryRepository;

    public Page<ActionHistory> getActionHistory(Pageable pageable, ActionQuery actionQuery) {
        return actionHistoryRepository.findAll(actionQuery.toPredicate(), pageable);
    }

    public ActionHistory getById(Long id) {
        return actionHistoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Action not found"));
    }
}
