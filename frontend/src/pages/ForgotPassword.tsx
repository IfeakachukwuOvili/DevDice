import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${BACKEND_URL}/users/reset-password`, {
        email,
        newPassword,
      });
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enter your email and new password to reset your password.
          </p>
        </div>

        {success && (
          <div className="p-2 mb-4 bg-green-100 border border-green-400 text-green-700 text-sm rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="p-2 mb-4 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              id="email"
              type="email"
              value={email}
              required
              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
              placeholder="Email"
              onChange={e => setEmail(e.target.value.trim())}
            />
          </div>
          <div>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              required
              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
              placeholder="New Password"
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              required
              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
              placeholder="Confirm New Password"
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-1.5 text-sm text-white rounded transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-2">
          <Link to="/login" className="text-xs text-blue-600 hover:text-blue-700">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}