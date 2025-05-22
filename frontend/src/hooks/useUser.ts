import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
  // Add other user fields as needed
}

type MessageType = 'success' | 'error' | '';

export const useUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<MessageType>('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteAccount = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const userObj: User | null = userData ? JSON.parse(userData) : null;

      if (!userObj?.email || !token) {
        throw new Error('User information not found');
      }

      const response = await axios.delete(
        `http://localhost:4000/users/${encodeURIComponent(userObj.email)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        return true;
      }
      return false;
    } catch (error: any) {
      setStatusMessage(error.response?.data?.message || 'Failed to delete account');
      setMessageType('error');
      return false;
    }
  };

  const updateProfile = async (
    newName: string,
    currentPassword: string,
    newPassword?: string
  ): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!user) throw new Error('User not found');
      const response = await axios.put(
        `http://localhost:4000/users/${user.email}`,
        {
          name: newName || user.name,
          currentPassword,
          newPassword: newPassword || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setStatusMessage('Profile updated successfully!');
        setMessageType('success');
        return true;
      }
      return false;
    } catch (error: any) {
      setStatusMessage(error.response?.data?.message || 'Failed to update profile');
      setMessageType('error');
      return false;
    }
  };

  return {
    user,
    statusMessage,
    messageType,
    setStatusMessage,
    setMessageType,
    handleSignOut,
    handleDeleteAccount,
    updateProfile
  };
};