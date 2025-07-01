import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { apiService } from '../../services/api';
import { Notification } from '../../types';
import NotificationsPanel from '../../components/admin/NotificationsPanel';

const weeklyPaymentsData = [
    { name: 'Mon', payments: 4000 },
    { name: 'Tue', payments: 3000 },
    { name: 'Wed', payments: 2000 },
    { name: 'Thu', payments: 2780 },
    { name: 'Fri', payments: 1890 },
    { name: 'Sat', payments: 2390 },
    { name: 'Sun', payments: 3490 },
];


const DashboardCard = ({ title, value, icon: Icon, change, changeType }: {title: string, value: string, icon: React.ElementType, change?: string, changeType?: 'increase' | 'decrease'}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
            <Icon className="h-5 w-5 text-text-secondary" />
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold text-text-primary">{value}</div>
            {change && <p className={`text-xs mt-1 ${changeType === 'increase' ? 'text-success' : 'text-error'}`}>
                {change} from last week
            </p>}
        </CardContent>
    </Card>
);


const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, activeStudents: 0, studentsInArrears: 0 });
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await apiService.getAdminDashboardData();
                setStats(data.stats);
                setNotifications(data.notifications);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Total Revenue (Term)" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} />
                <DashboardCard title="Active Students" value={stats.activeStudents.toString()} icon={Users} />
                <DashboardCard title="Payments This Week" value="124" icon={TrendingUp} change="+15.3%" changeType="increase"/>
                <DashboardCard title="Students in Arrears" value={stats.studentsInArrears.toString()} icon={AlertTriangle}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Weekly Payment Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={weeklyPaymentsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: '#1e293b', 
                                        border: '1px solid #334155', 
                                        color: '#e2e8f0' 
                                    }} 
                                    cursor={{fill: 'rgba(109, 40, 44, 0.2)'}}
                                />
                                <Legend wrapperStyle={{color: '#e2e8f0'}} />
                                <Bar dataKey="payments" fill="#6D282C" name="Payments ($)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <div className="lg:col-span-3">
                    <NotificationsPanel notifications={notifications} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;