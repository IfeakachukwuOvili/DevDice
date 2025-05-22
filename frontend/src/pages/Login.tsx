import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../utils/authUtils';

interface FieldErrors {
  email: string;
  password: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({
      email,
      password,
      setIsLoading,
      setError,
      setFieldErrors,
      navigate,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Login
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Welcome back! Please sign in to continue.
          </p>
        </div>

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
              className={`w-full px-3 py-1.5 text-sm border ${
                fieldErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              } rounded bg-gray-50 dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white`}
              placeholder="Email"
              onChange={e => {
                setEmail(e.target.value.trim());
                setFieldErrors(prev => ({ ...prev, email: '' }));
                setError('');
              }}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <input
              id="password"
              type="password"
              value={password}
              required
              className={`w-full px-3 py-1.5 text-sm border ${
                fieldErrors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              } rounded bg-gray-50 dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white`}
              placeholder="Password"
              onChange={e => {
                setPassword(e.target.value);
                setFieldErrors(prev => ({ ...prev, password: '' }));
                setError('');
              }}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
            )}
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-2">
          <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
            Forgot password?
          </Link>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}