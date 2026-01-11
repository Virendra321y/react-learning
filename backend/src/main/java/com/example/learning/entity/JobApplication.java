package com.example.learning.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "job_application")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Info
    private String fullName;
    private String dob;
    private String gender;
    private String nationality;

    @Column(length = 1000)
    private String address;

    private String mobile;
    private String email;

    // ID Proof
    private String idType;
    private String idNumber;

    // Qualification
    private String qualification;
    private String institution;

    // Physical
    private String height;
    private String weight;
    private String chest;

    // Documents
    private String photoUrl;
    private String signatureUrl;

    // Status
    private String applicationStatus; // SUBMITTED, REVIEW, ACCEPTED, REJECTED

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id", referencedColumnName = "id")
    private PaymentDetails paymentDetails;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.applicationStatus == null) {
            this.applicationStatus = "SUBMITTED";
        }
    }
}
