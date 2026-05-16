package com.stamptour.backend.controller;

import com.stamptour.backend.entity.User;
import com.stamptour.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // jwt때문에 mapping을 /me로 변경
    @GetMapping("/me")
    public User getUser(@AuthenticationPrincipal String userId) {
        return userService.getUserById(userId);
    }
}