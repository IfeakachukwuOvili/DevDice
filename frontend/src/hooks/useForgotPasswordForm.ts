import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Add this line

export function useForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent account enumeration
  const GENERIC_MSG = 'If an account with that email exists, you will receive a password reset link.';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/users/reset-password`, { email }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessage(GENERIC_MSG);
    } catch (err: any) {
      setMessage(GENERIC_MSG); // Always generic for security
    } finally {
      setIsLoading(false);
    }
  };

  return { email, message, error, isLoading, handleChange, handleSubmit };
}