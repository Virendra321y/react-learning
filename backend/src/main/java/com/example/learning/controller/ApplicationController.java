package com.example.learning.controller;

import com.example.learning.entity.JobApplication;
import com.example.learning.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/application")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody Map<String, Object> payload) {
        try {
            // Extract payment ID
            Long paymentId = Long.parseLong(payload.get("paymentId").toString());

            // Extract application data
            Map<String, Object> formData = (Map<String, Object>) payload.get("formData");

            JobApplication application = new JobApplication();
            application.setFullName((String) formData.get("fullName"));
            application.setDob((String) formData.get("dob"));
            application.setGender((String) formData.get("gender"));
            application.setNationality((String) formData.get("nationality"));
            application.setAddress((String) formData.get("address"));
            application.setMobile((String) formData.get("mobile"));
            application.setEmail((String) formData.get("email"));
            application.setIdType((String) formData.get("idType"));
            application.setIdNumber((String) formData.get("idNumber"));
            application.setQualification((String) formData.get("qualification"));
            application.setInstitution((String) formData.get("institution"));
            application.setHeight((String) formData.get("height"));
            application.setWeight((String) formData.get("weight"));
            application.setChest((String) formData.get("chest"));
            application.setPhotoUrl((String) formData.get("photoUrl"));
            application.setSignatureUrl((String) formData.get("signatureUrl"));
            application.setMarksheetUrl((String) formData.get("marksheetUrl"));
            application.setCategoryCertUrl((String) formData.get("categoryCertUrl"));

            JobApplication savedApp = applicationService.submitApplication(application, paymentId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Application submitted successfully",
                    "applicationId", savedApp.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", e.getMessage()));
        }
    }
}
