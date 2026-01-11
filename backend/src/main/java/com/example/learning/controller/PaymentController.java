package com.example.learning.controller;

import com.example.learning.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            // Default to 1 RS if not provided
            double amount = 1.0;
            if (data.containsKey("amount")) {
                amount = Double.parseDouble(data.get("amount").toString());
            }

            String order = paymentService.createOrder(amount);

            // Return both order details and the keyId used
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("order", order); // This is a JSON string
            response.put("keyId", paymentService.getActiveKeyId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            String orderId = data.get("razorpay_order_id");
            String paymentId = data.get("razorpay_payment_id");
            String signature = data.get("razorpay_signature");

            var paymentDetails = paymentService.verifyAndSavePayment(orderId, paymentId, signature);

            if (paymentDetails != null) {
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", "Payment verified and saved successfully",
                        "paymentId", paymentDetails.getId()));
            } else {
                return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Invalid signature"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error verifying payment");
        }
    }
}
