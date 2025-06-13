import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 

interface HandleLoginParams {
  email: string;
  password: string;
  setIsLoading: (loading: boolean) => void;
  setError: (msg: string) => void;
  setFieldErrors: (errors: { email: string; password: string }) => void;
  navigate: (path: string) => void;
}

interface ValidationResult {
  errors: { email: string; password: string };
  isValid: boolean;
}

// Simple validation function (customize as needed)
function validateLoginInput(email: string, password: string): ValidationResult {
  const errors = { email: '', password: '' };
  let isValid = true;

  if (!email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Invalid email address';
    isValid = false;
  }

  if (!password) {
    errors.password = 'Password is required';
    isValid = false;
  }

  return { errors, isValid };
}

export const handleLogin = async ({
  email,
  password,
  setIsLoading,
  setError,
  setFieldErrors,
  navigate,
}: HandleLoginParams): Promise<void> => {
  const { errors, isValid } = validateLoginInput(email, password);

  if (!isValid) {
    setFieldErrors(errors);
    return;
  }

  try {
    setIsLoading(true);
    setError('');
    setFieldErrors({ email: '', password: '' });

    const response = await axios.post(`${BACKEND_URL}/users/login`, {
      email,
      password,
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    navigate('/home');
  } catch (error: any) {
    setError(error.response?.data?.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};