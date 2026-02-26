import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button/Button';
import { ROUTES } from '@/routes/routePaths';
import { useAuthStore } from '@/stores/authStore';

/**
 * 404 Not Found page component.
 * Displays when a user navigates to a route that doesn't exist.
 */
export const NotFoundPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate(-1);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg mx-4 my-8 text-center">
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-none tracking-tight">
            404
          </h1>
        </div>

        {/* Illustration */}
        <div className="mb-6 flex justify-center">
          <svg
            className="w-32 h-32 md:w-40 md:h-40 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-sm mx-auto">
            The page you're looking for seems to have wandered off into the digital void.
            <br />
            <span className="text-gray-500 text-sm">Let's get you back on track.</span>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleGoHome}
            className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 focus:ring-purple-500 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 px-5 py-2.5 text-base font-medium w-[200px]!"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
};
