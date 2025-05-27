import { log } from 'console';
import User from '../models/user.js';

class AuthController {
    async register(req, res) {
        const { username, password, role } = req.body;
        try {
            const newUser = await User.createUser({ username, password, role });
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            if (error.message == 'Username already exists') {
                return res.status(409).json({ message: error.message });
            }
            if (error.message === 'Password must be at least 4 characters long') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    }

    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await User.findByCredentials(username, password);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = await user.generateAuthToken();
            res.status(200).json({ message: 'Login successful', token, role: user.role });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }

    async logout(req, res) {
        try {
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error logging out', error });
        }
    }

    async switchRole(req, res) {
        const { userId, newRole } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.role = newRole;
            await user.save();
            res.status(200).json({ message: 'Role switched successfully', user });
        } catch (error) {
            res.status(500).json({ message: 'Error switching role', error });
        }
    }
}

export default new AuthController();