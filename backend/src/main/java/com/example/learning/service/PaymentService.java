package com.example.learning.service;

import com.example.learning.entity.PaymentDetails;
import com.example.learning.repository.PaymentDetailsRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.annotation.PostConstruct;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    private PaymentDetailsRepository paymentDetailsRepository;

    // Ideally, store these in application.properties or environment variables
    // For demo purposes, we can hardcode test keys or read them
    @Value("${razorpay.key.id:rzp_test_YourTestKeyId}") // Should be in properties
    private String keyId;

    @Value("${razorpay.key.secret:YourTestKeySecret}")
    private String keySecret;

    // Hardcoded for development ease if properties are missing - REPLACE WITH YOUR
    // KEYS
    private final String DEV_KEY_ID = "rzp_test_YourKeyHere";
    private final String DEV_KEY_SECRET = "YourSecretHere";

    private String activeKeyId;

    @PostConstruct
    public void init() {
        try {
            // Priority: Properties -> Hardcoded (Fallback)
            String kid = (keyId == null || keyId.contains("YourTestKeyId") || keyId.isEmpty()) ? DEV_KEY_ID : keyId;
            String ksecret = (keySecret == null || keySecret.contains("YourTestKeySecret") || keySecret.isEmpty())
                    ? DEV_KEY_SECRET
                    : keySecret;

            this.activeKeyId = kid;

            if (kid.equals(DEV_KEY_ID)) {
                System.err.println("WARNING: Razorpay keys are missing or default. Payments will fail.");
            }

            client = new RazorpayClient(kid, ksecret);
        } catch (RazorpayException e) {
            e.printStackTrace();
        }
    }

    public String createOrder(double amountInRupees) throws RazorpayException {
        if (client == null) {
            throw new RazorpayException("Razorpay client not initialized. Check API keys.");
        }
        try {
            JSONObject orderRequest = new JSONObject();
            // Amount is in currency subunits (paise for INR)
            orderRequest.put("amount", (int) (amountInRupees * 100));
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = client.orders.create(orderRequest);
            return order.toString();
        } catch (RazorpayException e) {
            System.err.println("Razorpay Error: " + e.getMessage());
            throw new RazorpayException("Payment initiation failed: " + e.getMessage());
        }
    }

    public PaymentDetails verifyAndSavePayment(String orderId, String paymentId, String signature) {
        try {
            String secret = (keySecret == null || keySecret.contains("YourTestKeySecret")) ? DEV_KEY_SECRET : keySecret;

            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            boolean isValid = Utils.verifyPaymentSignature(options, secret);

            if (isValid) {
                PaymentDetails payment = new PaymentDetails();
                payment.setRazorpayOrderId(orderId);
                payment.setRazorpayPaymentId(paymentId);
                payment.setRazorpaySignature(signature);
                payment.setStatus("SUCCESS");
                payment.setAmount(1.0); // Hardcoded for this specific flow, or fetch from order

                return paymentDetailsRepository.save(payment);
            } else {
                return null;
            }
        } catch (RazorpayException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getActiveKeyId() {
        return this.activeKeyId;
    }

    private RazorpayClient client;
}
