// netlify/functions/updatePassword.js
const admin = require('./firebase-admin');
const { NotificationType } = require('./types');

// In a real app, passwords should be hashed. For this project, we assume plain text as per initial setup.
// A production system should use Firebase Authentication or a similar service.

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    try {
        const { userId, currentPassword, newPassword } = JSON.parse(event.body);
        if (!userId || !currentPassword || !newPassword) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields.' }) };
        }

        const db = admin.database();
        const userRef = db.ref(`users/${userId}`);
        const userSnapshot = await userRef.once('value');
        const user = userSnapshot.val();

        if (!user) {
            return { statusCode: 404, body: JSON.stringify({ message: 'User not found.' }) };
        }

        // IMPORTANT: This is plain-text comparison. Not for production without hashing.
        if (user.password !== currentPassword) {
            return { statusCode: 403, body: JSON.stringify({ success: false, message: 'Incorrect current password.' }) };
        }

        const updates = {};
        updates[`/users/${userId}/password`] = newPassword;

        const notificationRef = db.ref('notifications').push();
        updates[`/notifications/${notificationRef.key}`] = {
            id: notificationRef.key,
            type: NotificationType.PASSWORD_CHANGE,
            message: `User <strong>${user.username} (${user.role})</strong> has updated their password.`,
            timestamp: new Date().toISOString(),
            isRead: false,
            relatedId: userId,
        };

        await db.ref().update(updates);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Password updated successfully' }),
        };

    } catch (error) {
        console.error('Error updating password:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: error.message || 'Internal Server Error' }),
        };
    }
};
