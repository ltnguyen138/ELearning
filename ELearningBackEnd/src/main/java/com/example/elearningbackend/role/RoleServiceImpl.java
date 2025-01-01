package com.example.elearningbackend.role;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;
    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role addRole(RoleReq roleReq) {
        return roleRepository.save(roleMapper.toRole(roleReq));
    }
}
