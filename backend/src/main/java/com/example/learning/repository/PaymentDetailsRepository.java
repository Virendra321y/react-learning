package com.example.learning.repository;

import com.example.learning.entity.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, Long> {
    Optional<PaymentDetails> findByRazorpayOrderId(String orderId);
}
