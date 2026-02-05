import { useAuthStore } from '@/stores/authStore';

/**
 * Main dashboard page component.
 * Displays welcome message and overview information.
 */
export const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Dashboard
          </h1>
          <p className="text-gray-500">
            Hello, {user?.name || 'Partner'}! You are now logged in.
          </p>
        </div>

        <div className="border border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Verification Status
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Complete your business verification to unlock full features.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 border border-yellow-200">
            Pending
          </span>
        </div>
      </div>
    </div>
  );
};
