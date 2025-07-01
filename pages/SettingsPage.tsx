


import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const SettingsPage = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (data: PasswordFormData) => {
        if (!user) return;
        
        const toastId = toast.loading('Updating password...');
        try {
            const result = await apiService.updatePassword(user.id, data.currentPassword, data.newPassword);
            if(result.success) {
                toast.success('Password updated successfully!', { id: toastId });
                reset();
            } else {
                toast.error(result.message || 'Failed to update password.', { id: toastId });
            }
        } catch (error) {
            const err = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(`Error: ${err}`, { id: toastId });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('You have been logged out.');
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account's password. It's recommended to use a strong, unique password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-text-primary">Current Password</label>
                            <Input type="password" {...register('currentPassword')} />
                            {errors.currentPassword && <p className="text-sm text-error mt-1">{errors.currentPassword.message}</p>}
                        </div>
                         <div>
                            <label className="text-sm font-medium text-text-primary">New Password</label>
                            <Input type="password" {...register('newPassword')} />
                            {errors.newPassword && <p className="text-sm text-error mt-1">{errors.newPassword.message}</p>}
                        </div>
                         <div>
                            <label className="text-sm font-medium text-text-primary">Confirm New Password</label>
                            <Input type="password" {...register('confirmPassword')} />
                            {errors.confirmPassword && <p className="text-sm text-error mt-1">{errors.confirmPassword.message}</p>}
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Log out of your account on this device.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;