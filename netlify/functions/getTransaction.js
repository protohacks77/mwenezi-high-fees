// netlify/functions/getTransaction.js
const admin = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { transactionId } = JSON.parse(event.body);

        if (!transactionId) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Transaction ID is required.' }) };
        }

        const db = admin.database();
        const txRef = db.ref(`transactions/${transactionId}`);
        const snapshot = await txRef.once('value');
        const transaction = snapshot.val();

        if (!transaction) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Transaction not found.' }) };
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify(transaction),
        };

    } catch (error) {
        console.error('Error fetching transaction:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
