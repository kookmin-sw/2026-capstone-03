package com.stamptour.backend.repository;

import com.stamptour.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // 💡 JpaRepository<엔티티타입, PK타입>만 상속받으면 끝!
    // 기본적인 CRUD(저장, 조회, 수정, 삭제) 메서드가 자동으로 생겨.
}