package com.example.elearningbackend.role;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoleService {

    List<Role> getRoles();

    Role addRole(RoleReq roleReq);
}
