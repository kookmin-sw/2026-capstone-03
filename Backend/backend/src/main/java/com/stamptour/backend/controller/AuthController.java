package com.stamptour.backend.controller;

import com.stamptour.backend.entity.User;
import com.stamptour.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/kakao
    @PostMapping("/kakao")
    public ResponseEntity<Map<String, Object>> kakaoLogin(@RequestBody Map<String, String> body) {
        try {
            User user = authService.kakaoLogin(body.get("code"));
            return createSuccessResponse("카카오 로그인 성공", user);
        } catch (Exception e) {
            e.printStackTrace();
            return createErrorResponse("카카오 서버 통신 실패");
        }
    }

    // POST /api/auth/naver
    @PostMapping("/naver")
    public ResponseEntity<Map<String, Object>> naverLogin(@RequestBody Map<String, String> body) {
        try {
            User user = authService.naverLogin(body.get("code"), body.get("state"));
            return createSuccessResponse("네이버 로그인 성공", user);
        } catch (Exception e) {
            e.printStackTrace();
            return createErrorResponse("네이버 서버 통신 실패");
        }
    }

    // POST /api/auth/google
    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody Map<String, String> body) {
        try {
            User user = authService.googleLogin(body.get("code"));
            return createSuccessResponse("구글 로그인 성공", user);
        } catch (Exception e) {
            e.printStackTrace();
            return createErrorResponse("구글 서버 통신 실패");
        }
    }

    // JSON 형태로 포장하는 함수
    private ResponseEntity<Map<String, Object>> createSuccessResponse(String message, User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(String errorMsg) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", errorMsg);
        return ResponseEntity.status(500).body(response);
    }
}