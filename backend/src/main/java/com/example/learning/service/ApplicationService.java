package com.example.learning.service;

import com.example.learning.entity.JobApplication;
import com.example.learning.entity.PaymentDetails;
import com.example.learning.repository.JobApplicationRepository;
import com.example.learning.repository.PaymentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApplicationService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private PaymentDetailsRepository paymentDetailsRepository;

    public JobApplication submitApplication(JobApplication application, Long paymentId) {
        PaymentDetails payment = paymentDetailsRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"SUCCESS".equals(payment.getStatus())) {
            throw new RuntimeException("Payment is not successful");
        }

        application.setPaymentDetails(payment);
        return applicationRepository.save(application);
    }
}
