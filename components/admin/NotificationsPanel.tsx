import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Notification, NotificationType } from '../../types';
import { UserPlus, DollarSign, KeyRound, CheckCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const notificationIcons: Record<NotificationType, React.ElementType> = {
    [NotificationType.NEW_STUDENT]: UserPlus,
    [NotificationType.CASH_PAYMENT]: DollarSign,
    [NotificationType.ZB_PAYMENT_SUCCESS]: CheckCircle,
    [NotificationType.PASSWORD_CHANGE]: KeyRound,
};

const notificationColors: Record<NotificationType, string> = {
    [NotificationType.NEW_STUDENT]: 'bg-blue-900 text-blue-400',
    [NotificationType.CASH_PAYMENT]: 'bg-green-900 text-green-400',
    [NotificationType.ZB_PAYMENT_SUCCESS]: 'bg-success/20 text-success',
    [NotificationType.PASSWORD_CHANGE]: 'bg-amber-900 text-amber-400',
};

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

interface NotificationsPanelProps {
    notifications: Notification[];
    loading: boolean;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, loading }) => {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Recent Activity Feed</CardTitle>
                <CardDescription>Live updates from the school portal.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto pr-3">
                 {loading ? (
                     <div className="flex justify-center items-center h-full">
                        <Bell size={32} className="animate-pulse text-text-secondary"/>
                     </div>
                 ) : notifications.length === 0 ? (
                    <div className="text-center text-text-secondary py-10">
                        No recent activity.
                    </div>
                ) : (
                    <ul className="space-y-4">
                        <AnimatePresence>
                        {notifications.map((item, index) => {
                            const Icon = notificationIcons[item.type] || Bell;
                            const colors = notificationColors[item.type] || 'bg-slate-700 text-slate-300';
                            return (
                                <motion.li
                                    key={item.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start space-x-4 p-3 rounded-lg bg-background-primary/50 hover:bg-background-primary transition-colors"
                                >
                                    <div className={`p-2 rounded-full ${colors}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-primary" dangerouslySetInnerHTML={{ __html: item.message }}></p>
                                        <p className="text-xs text-text-secondary">{timeSince(item.timestamp)}</p>
                                    </div>
                                </motion.li>
                            )
                        })}
                        </AnimatePresence>
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default NotificationsPanel;