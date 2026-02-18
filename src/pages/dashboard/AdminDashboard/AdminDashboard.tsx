import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Admin dashboard page component.
 * Provides administrative overview and management features.
 */
export const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'verifications' | 'settings'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'verifications', label: 'Verifications' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">
            Welcome, {user?.name || 'Admin'}! Manage your platform from here.
          </p>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    selectedTab === tab.id
                      ? 'border-[#7f13ec] text-[#7f13ec]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {selectedTab === 'overview' && <OverviewTab />}
          {selectedTab === 'users' && <UsersTab />}
          {selectedTab === 'verifications' && <VerificationsTab />}
          {selectedTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

/**
 * Overview tab component showing key statistics.
 */
const OverviewTab = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', trend: 'up' },
    { label: 'Active Partners', value: '856', change: '+8%', trend: 'up' },
    { label: 'Pending Verifications', value: '42', change: '-5%', trend: 'down' },
    { label: 'Approved Verifications', value: '1,192', change: '+15%', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200"
          >
            <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="w-10 h-10 rounded-full bg-[#7f13ec]/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#7f13ec]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-900">Operational</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-900">Healthy</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">File Storage</span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-900">Normal</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-gray-900">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Users tab component for user management.
 */
const UsersTab = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Partner', status: 'Active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Partner', status: 'Active', joined: '2024-01-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Active', joined: '2024-01-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <button className="px-4 py-2 bg-[#7f13ec] text-white rounded-lg hover:bg-[#6a0fd6] transition-colors text-sm font-medium">
          Add User
        </button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joined}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-[#7f13ec] hover:text-[#6a0fd6] mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Verifications tab component for managing verifications.
 */
const VerificationsTab = () => {
  const verifications = [
    { id: 1, company: 'Acme Corp', submitted: '2024-01-25', status: 'Pending', reviewer: '-' },
    { id: 2, company: 'Tech Solutions', submitted: '2024-01-24', status: 'Approved', reviewer: 'Admin' },
    { id: 3, company: 'Global Inc', submitted: '2024-01-23', status: 'Rejected', reviewer: 'Admin' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Verification Management</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Export
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Filter
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewer
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {verifications.map((verification) => (
              <tr key={verification.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{verification.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {verification.submitted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      verification.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : verification.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {verification.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {verification.reviewer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-[#7f13ec] hover:text-[#6a0fd6] mr-4">Review</button>
                  <button className="text-gray-600 hover:text-gray-700">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Settings tab component for admin settings.
 */
const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Admin Settings</h2>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                defaultValue="Parkora Partners"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f13ec] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Mode
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#7f13ec] rounded focus:ring-[#7f13ec]" />
                <span className="text-sm text-gray-600">Enable maintenance mode</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f13ec] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Require Two-Factor Authentication
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#7f13ec] rounded focus:ring-[#7f13ec]" />
                <span className="text-sm text-gray-600">Enable 2FA for all users</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button className="px-6 py-2 bg-[#7f13ec] text-white rounded-lg hover:bg-[#6a0fd6] transition-colors font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
