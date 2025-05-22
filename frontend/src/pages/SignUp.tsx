import { Link, useNavigate } from 'react-router-dom';
import { useSignupForm } from '../hooks/useSignupForm';
import { passwordRequirements } from '../utils/signupUtils';

export default function SignUp() {
  const navigate = useNavigate();
  const {
    formData,
    error,
    isLoading,
    validationErrors,
    handleChange,
    handleSubmit,
  } = useSignupForm(navigate);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Sign Up
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Create your account to get started
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
              id="name"
              type="text"
              value={formData.name}
              required
              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
              placeholder="Full Name"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="email"
              type="email"
              value={formData.email}
              required
              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              value={formData.password}
              required
              className={`w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white ${
                validationErrors.password.length > 0 ? 'border-red-500' : ''
              }`}
              placeholder="Password"
              onChange={handleChange}
            />
            {formData.password && (
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`text-xs flex items-center ${
                      req.regex.test(formData.password)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    <span className="mr-1">
                      {req.regex.test(formData.password) ? '✓' : '×'}
                    </span>
                    {req.text}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              required
              className={`w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white ${
                validationErrors.confirmPassword ? 'border-red-500' : ''
              }`}
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.confirmPassword}
              </p>
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}