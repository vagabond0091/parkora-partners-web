import { useAuthStore } from '@/stores/authStore';

/**
 * Main dashboard page component.
 * Displays welcome message and overview information.
 */
export const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Dashboard
        </h1>
        <p className="text-gray-500 mb-6">
          Hello, {user?.name || 'Partner'}! You are now logged in.
        </p>
      </div>
    </div>
  );
};
