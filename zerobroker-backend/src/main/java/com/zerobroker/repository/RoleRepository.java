package com.zerobroker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerobroker.entity.Roles;

//"User","Admin","Owner" tyapaiki rolename shodanysati
public interface RoleRepository extends JpaRepository<Roles, Long> {
	Optional<Roles> findByRoleName(String roleName);

}
