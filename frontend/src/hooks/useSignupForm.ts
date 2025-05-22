import { useState } from 'react';
import axios from 'axios';
import { passwordRequirements } from '../utils/signupUtils';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  password: string[];
  confirmPassword?: string;
}

export function useSignupForm(navigate: (path: string) => void) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({ password: [] });

  const GENERIC_ERROR = 'Signup failed. Please check your details and try again.';

  const validate = () => {
    const passwordErrors = passwordRequirements
      .filter(req => !req.regex.test(formData.password))
      .map(req => req.text);

    let confirmPasswordError = '';
    if (formData.password !== formData.confirmPassword) {
      confirmPasswordError = 'Passwords do not match.';
    }

    setValidationErrors({
      password: passwordErrors,
      confirmPassword: confirmPasswordError,
    });

    return passwordErrors.length === 0 && !confirmPasswordError;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await axios.post('http://localhost:4000/users/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      navigate('/login');
    } catch (err: any) {
      setError(GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    error,
    isLoading,
    validationErrors,
    handleChange,
    handleSubmit,
  };
}