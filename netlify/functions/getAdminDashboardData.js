// netlify/functions/getAdminDashboardData.js
const admin = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const db = admin.database();
        
        // Fetch Notifications
        const notifRef = db.ref('notifications').orderByChild('timestamp').limitToLast(10);
        const notifSnapshot = await notifRef.once('value');
        const notifications = [];
        notifSnapshot.forEach(childSnapshot => {
            notifications.push(childSnapshot.val());
        });

        // Fetch Students for stats
        const studentsRef = db.ref('students');
        const studentsSnapshot = await studentsRef.once('value');
        const students = studentsSnapshot.val();
        
        let activeStudents = 0;
        let studentsInArrears = 0;
        let totalRevenue = 0; // This is a simplified calculation

        if (students) {
            activeStudents = Object.keys(students).length;
            Object.values(students).forEach(student => {
                if (student.financials.balance > 0) {
                    studentsInArrears++;
                }
                // Calculate revenue based on payments this term
                 Object.values(student.financials.terms).forEach(term => {
                    totalRevenue += term.paid || 0;
                 });
            });
        }
        
        const stats = {
            totalRevenue,
            activeStudents,
            studentsInArrears
        };
        
        return {
            statusCode: 200,
            body: JSON.stringify({ stats, notifications: notifications.reverse() }),
        };

    } catch (error) {
        console.error('Error fetching admin data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
