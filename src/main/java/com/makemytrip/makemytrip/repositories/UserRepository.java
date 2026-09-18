package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Users;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users,String>{
    Users findByEmail(String email);
    Optional<Users> findById(Long id);
}