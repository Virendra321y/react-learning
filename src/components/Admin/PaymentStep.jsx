import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiLock, FiShield, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PaymentStep = ({ amount = 1, onSuccess, onFailed }) => {
    const [isLoading, setIsLoading] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setIsLoading(true);
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
            toast.error('Failed to load payment gateway. Check internet connection.');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Create Order via Backend
            const orderRes = await fetch('http://localhost:8080/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount })
            });

            if (!orderRes.ok) throw new Error('Order creation failed');
            if (!orderRes.ok) throw new Error('Order creation failed');
            const data = await orderRes.json();
            const orderJson = JSON.parse(data.order);
            const backendKeyId = data.keyId;


            // 2. Open Razorpay Options
            const options = {
                key: backendKeyId, // Dynamic key from backend
                amount: orderJson.amount,
                currency: "INR",
                name: "UP Police Recruitment",
                description: "Application Fee Payment",
                image: "/src/assets/up_police_logo_emblem.png",
                order_id: orderJson.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch('http://localhost:8080/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.status === 'success') {
                            toast.success('Payment Verified!');
                            onSuccess(verifyData.paymentId);
                        } else {
                            toast.error('Payment verification failed');
                            onFailed();
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error('Verification error');
                        onFailed();
                    }
                },
                prefill: {
                    name: "Candidate Name",
                    email: "candidate@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#b91c1c" // Red theme matching police branding
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error(response.error.description);
                onFailed();
            });
            rzp.open();

        } catch (error) {
            console.error('Payment Error:', error);
            toast.error('Something went wrong during payment initialization.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 max-w-lg mx-auto text-center font-sans mt-10">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-pulse">
                <FiLock size={32} />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">Secure Payment Gateway</h2>
            <p className="text-slate-500 mb-8">Complete your application by paying the processing fee.</p>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 font-medium">Application Fee</span>
                    <span className="text-slate-900 font-bold">₹{amount}.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Processing Tax</span>
                    <span className="text-slate-900 font-medium">₹0.00</span>
                </div>
                <div className="h-px bg-slate-200 my-4"></div>
                <div className="flex justify-between items-center text-xl">
                    <span className="text-slate-800 font-bold">Total Payable</span>
                    <span className="text-green-600 font-extrabold">₹{amount}.00</span>
                </div>
            </div>

            <div className="flex justify-center gap-4 mb-8 text-slate-400">
                <div className="flex items-center gap-1 text-xs">
                    <FiShield /> 100% Secure
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <FiCheckCircle /> Encrypted
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3"
            >
                {isLoading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                    <>
                        <FiCreditCard /> Pay Now (Google Pay / UPI / Card)
                    </>
                )}
            </motion.button>

            <p className="mt-4 text-xs text-slate-400">
                You will be redirected to Razorpay secure checkout.
            </p>
        </div>
    );
};

export default PaymentStep;
