import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button/Button';
import { ROUTES } from '@/routes/routePaths';
import { useAuthStore } from '@/stores/authStore';

/**
 * Access Denied page component.
 * Displays when a user tries to access a resource they don't have permission for.
 */
export const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleGoBack = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl mx-4 my-8 text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-red-100">
            <svg
              className="w-16 h-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Access Denied
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            You don't have permission to access this page.
            <br />
            <span className="text-gray-500 text-base">
              Please contact your administrator to request access.
            </span>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleGoBack}
            className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 focus:ring-purple-500 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 px-4! py-2! text-base font-medium w-[200px]!"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            }
          >
            Go Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};
