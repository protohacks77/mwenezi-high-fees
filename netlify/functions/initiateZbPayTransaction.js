// netlify/functions/initiateZbPayTransaction.js
const fetch = require('node-fetch');
const admin = require('./firebase-admin');
const { TransactionType, TransactionStatus } = require('./types');

function generateReceiptNumber() {
    const prefix = "MHS";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { studentId, amount, termKey } = JSON.parse(event.body);
        if (!studentId || !amount || !termKey) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields.' }) };
        }

        const db = admin.database();
        const studentRef = db.ref(`students/${studentId}`);
        const studentSnapshot = await studentRef.once('value');
        const student = studentSnapshot.val();

        if (!student) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Student not found.' }) };
        }

        const orderReference = `MHS-${Date.now()}`;
        const newTransactionRef = db.ref('transactions').push();
        
        const newTransaction = {
            id: newTransactionRef.key,
            studentId,
            studentName: `${student.firstName} ${student.lastName}`,
            amount: parseFloat(amount),
            termKey,
            type: TransactionType.ZB_PAYMENT,
            status: TransactionStatus.PENDING_ZB_CONFIRMATION,
            date: new Date().toISOString(),
            orderReference,
            receiptNumber: generateReceiptNumber(),
        };

        await newTransactionRef.set(newTransaction);
        
        const ZB_API_KEY = process.env.ZB_API_KEY;
        // The secret is not always used in headers, but could be part of a signature.
        // For this API, it seems only the key is in the header.
        // Consult ZbPay docs for actual payload.
        const zbPayPayload = {
            // This is a sample payload. ADJUST ACCORDING TO ZBPAY DOCUMENTATION.
            merchantId: "YOUR_ZBPAY_MERCHANT_ID", // This should be an env var
            orderReference: orderReference,
            currencyCode: "840", // USD
            amount: parseFloat(amount).toFixed(2),
            itemName: `School Fees for ${termKey}`,
            returnUrl: `https://YOUR_NETLIFY_URL/student/payment-status?orderRef=${orderReference}&txId=${newTransaction.id}`,
            resultUrl: "https://YOUR_NETLIFY_URL/.netlify/functions/zbpayWebhook", // Webhook endpoint
        };

        const zbResponse = await fetch('https://zbnet.zb.co.zw/wallet_sandbox_api/payments/initiate-transaction', {
           method: 'POST',
           headers: { 
             'Content-Type': 'application/json', 
             'x-api-key': ZB_API_KEY,
             //'x-api-secret': process.env.ZB_API_SECRET // If needed
            },
           body: JSON.stringify(zbPayPayload)
        });

        if (!zbResponse.ok) {
            const errorText = await zbResponse.text();
            throw new Error(`ZbPay API Error: ${zbResponse.status} - ${errorText}`);
        }

        const zbData = await zbResponse.json();
        
        // Assuming zbData has a `paymentUrl` property
        if (!zbData.paymentUrl) {
            throw new Error('ZbPay response did not include a paymentUrl.');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ 
              success: true, 
              paymentUrl: zbData.paymentUrl,
              orderReference: orderReference,
              transactionId: newTransaction.id
            }),
        };

    } catch (error) {
        console.error('Error initiating payment:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: error.message || 'Internal Server Error' }),
        };
    }
};
