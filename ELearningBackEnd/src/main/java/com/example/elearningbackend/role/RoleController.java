package com.example.elearningbackend.role;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/roles")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public List<Role> getRoles() {
        return roleService.getRoles();
    }

    @PostMapping
    public Role addRole(@RequestBody RoleReq roleReq) {
        return roleService.addRole(roleReq);
    }
}
