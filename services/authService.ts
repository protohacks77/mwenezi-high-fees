import { User } from '../types';
import { dataService } from './dataService';

const login = async (username: string, password: string): Promise<User | null> => {
    const userWithPassword = await dataService.findUserByUsername(username);

    if (userWithPassword && userWithPassword.password === password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = userWithPassword;
        return user; // Return the user object without the password
    }
    
    return null;
};

const logout = () => {
    // In a real app, this might invalidate a token on the server.
    // For local mock, clearing client state in Zustand is sufficient.
    console.log('User logged out');
};

export const authService = {
    login,
    logout,
};
