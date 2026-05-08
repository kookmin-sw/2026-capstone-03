package com.stamptour.backend.controller;

import com.stamptour.backend.dto.LandmarkDTO;
import com.stamptour.backend.service.LandmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/landmarks")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LandmarkController {

    private final LandmarkService landmarkService;

    @GetMapping
    public List<LandmarkDTO> getLandmarks(@RequestParam("userId") String userId) {
        return landmarkService.getLandmarksWithStampInfo(userId);
    }
}