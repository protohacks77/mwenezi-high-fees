// netlify/functions/checkZbPaymentStatus.js
const fetch = require('node-fetch');
const admin = require('./firebase-admin');
const { TransactionStatus, NotificationType } = require('./types');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { orderRef, txId } = JSON.parse(event.body);
        if (!orderRef || !txId) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing order reference or transaction ID.' }) };
        }
        
        const db = admin.database();
        const txRef = db.ref(`transactions/${txId}`);
        const txSnapshot = await txRef.once('value');
        const transaction = txSnapshot.val();
        
        if (!transaction || transaction.orderReference !== orderRef) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Transaction not found or order reference mismatch.' }) };
        }
        
        if (transaction.status !== TransactionStatus.PENDING_ZB_CONFIRMATION) {
             return { statusCode: 200, body: JSON.stringify({ success: transaction.status === TransactionStatus.ZB_PAYMENT_SUCCESSFUL, message: `Payment status already processed: ${transaction.status}` })};
        }

        // In a real scenario, you call the ZbPay status check endpoint.
        // For this example, we'll simulate a 90% success rate.
        const isSuccessful = Math.random() < 0.9;
        
        if (isSuccessful) {
            // ATOMIC UPDATE
            const studentRef = db.ref(`students/${transaction.studentId}`);
            const studentSnapshot = await studentRef.once('value');
            const student = studentSnapshot.val();

            const updates = {};
            // 1. Update transaction status
            updates[`/transactions/${txId}/status`] = TransactionStatus.ZB_PAYMENT_SUCCESSFUL;
            // 2. Update student term payment
            const newPaidAmount = (student.financials.terms[transaction.termKey].paid || 0) + transaction.amount;
            updates[`/students/${transaction.studentId}/financials/terms/${transaction.termKey}/paid`] = newPaidAmount;
            // 3. Recalculate and update student balance
            const newBalance = student.financials.balance - transaction.amount;
            updates[`/students/${transaction.studentId}/financials/balance`] = newBalance;
            // 4. Create notification
            const notificationRef = db.ref('notifications').push();
            updates[`/notifications/${notificationRef.key}`] = {
                id: notificationRef.key,
                type: NotificationType.ZB_PAYMENT_SUCCESS,
                message: `Successful payment of <strong>$${transaction.amount.toFixed(2)}</strong> received from <strong>${transaction.studentName}</strong>.`,
                timestamp: new Date().toISOString(),
                isRead: false,
                relatedId: txId,
            };

            await db.ref().update(updates);
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        } else {
            await txRef.update({ status: TransactionStatus.ZB_PAYMENT_FAILED });
            return { statusCode: 200, body: JSON.stringify({ success: false, message: 'The payment was declined by the bank.' }) };
        }

    } catch (error) {
        console.error('Error checking payment status:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: error.message || 'Internal Server Error' }),
        };
    }
};
