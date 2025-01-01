package com.example.elearningbackend.note;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/notes")
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public Page<NoteRes> getNote(Pageable pageable, NoteQuery noteQuery){
        return noteService.getNote(pageable, noteQuery);
    }

    @PostMapping
    public NoteRes create(@RequestBody NoteReq noteReq){
        return noteService.create(noteReq);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id){
        noteService.delete(id);
    }

    @PutMapping("/{id}")
    public NoteRes update(@PathVariable long id, @RequestBody NoteReq noteReq){
        return noteService.update(id, noteReq);
    }
}
