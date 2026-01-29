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
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-200" />
      
      {/* Decorative blurred circles */}
      <div className="absolute -left-32 top-1/4 w-96 h-96 bg-gradient-to-br from-orange-200/60 to-orange-300/40 rounded-full blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/60 to-pink-200/40 rounded-full blur-3xl" />
      
      {/* Content card */}
      <div className="relative w-full max-w-md mx-4 my-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-purple-900/5 p-8 md:p-10 text-center">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-500">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Illustration/Icon */}
          <div className="mb-8 flex justify-center">
            <svg
              className="w-48 h-48 text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Action Button */}
          <Button
            type="button"
            onClick={handleGoHome}
            className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 focus:ring-purple-500"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
};
