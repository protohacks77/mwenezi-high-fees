import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { apiService } from '../services/api';

type PaymentStatus = 'processing' | 'success' | 'failed' | 'error';

const PaymentStatusPage: React.FC = () => {
    const [status, setStatus] = useState<PaymentStatus>('processing');
    const [message, setMessage] = useState('Verifying your payment, please wait...');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderRef = params.get('orderRef');
        const txId = params.get('txId');

        if (!orderRef || !txId) {
            setStatus('error');
            setMessage('Invalid payment details. Missing order reference or transaction ID.');
            return;
        }

        const verifyPayment = async () => {
            try {
                // Wait 3 seconds to simulate network latency and ZB Pay processing
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                const result = await apiService.checkZbPaymentStatus(orderRef, txId);
                
                if (result.success) {
                    setStatus('success');
                    setMessage('Your payment was successful! Your records have been updated.');
                } else {
                    setStatus('failed');
                    setMessage(result.message || 'Your payment could not be confirmed. Please contact support if the amount was debited.');
                }
            } catch (err) {
                setStatus('error');
                const error = err instanceof Error ? err.message : 'An unexpected error occurred.'
                setMessage(`Verification failed: ${error} Please contact support.`);
            }
        };

        verifyPayment();
    }, [location.search]);

    const StatusIcon = {
        processing: <Loader size={64} className="animate-spin text-accent-secondary" />,
        success: <CheckCircle size={64} className="text-success" />,
        failed: <XCircle size={64} className="text-error" />,
        error: <AlertCircle size={64} className="text-error" />,
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-primary p-4">
            <Card className="w-full max-w-lg text-center">
                 <CardHeader>
                    <div className="flex justify-center mb-4">
                        <img src="/mwenezihighlogo.png" alt="Mwenezi High Logo" className="w-16 h-16" />
                    </div>
                    <CardTitle className="text-2xl">Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {StatusIcon[status]}
                    </motion.div>
                    
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={message}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-lg text-text-primary"
                        >
                            {message}
                        </motion.p>
                    </AnimatePresence>
                    
                    {status !== 'processing' && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button onClick={() => navigate('/student/dashboard')}>
                                Return to Dashboard
                            </Button>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentStatusPage;