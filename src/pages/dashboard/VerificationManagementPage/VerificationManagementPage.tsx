import { useState } from 'react';
import { clsx } from 'clsx';
import type { Partner } from '@/types/pages/verificationManagement.types';

/**
 * Verification Management page component.
 * Allows admins to manage and review partner onboarding documents.
 */
export const VerificationManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  /**
   * Mock partner data.
   */
  const partners: Partner[] = [
    {
      id: '1',
      name: 'Urban Resorts LLC',
      partnerId: 'PRK-90210',
      submissionDate: 'Oct 24, 2023',
      type: 'Enterprise',
      status: 'UNDER REVIEW',
    },
    {
      id: '2',
      name: 'City Parking Solutions',
      partnerId: 'PRK-88231',
      submissionDate: 'Oct 23, 2023',
      type: 'Standard',
      status: 'PENDING',
    },
    {
      id: '3',
      name: 'North Hill Properties',
      partnerId: 'PRK-12093',
      submissionDate: 'Oct 22, 2023',
      type: 'Standard',
      status: 'PENDING',
    },
  ];

  /**
   * Get initials from partner name.
   */
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Get status dot color.
   */
  const getStatusDotColor = (status: string): string => {
    switch (status) {
      case 'UNDER REVIEW':
        return 'bg-orange-400';
      case 'PENDING':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  /**
   * Get status text color.
   */
  const getStatusTextColor = (status: string): string => {
    switch (status) {
      case 'UNDER REVIEW':
        return 'text-orange-400';
      case 'PENDING':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 bg-[#172032] px-8 py-4.5 -mx-8 -mt-8 w-[calc(100%+4rem)]">
        <div>
          <h1 className="text-xl font-bold text-white">Verification Management</h1>
          <p className="text-xs text-gray-400">Manage and review partner onboarding documents</p>
        </div>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-70 pl-10 pr-4 py-2 bg-[#232b3d] border border-gray-700 rounded-lg text-[#464d5d] text-xs placeholder:text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6d28d9] focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#172032] border-b border-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                PARTNER NAME
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                SUBMISSION DATE
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                TYPE
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {partners.map((partner) => (
              <tr
                key={partner.id}
                onClick={() => setSelectedPartner(partner.id)}
                className={clsx(
                  'cursor-pointer transition-colors bg-[#0f172a]',
                  selectedPartner === partner.id
                    ? 'bg-[#1b2335] hover:bg-[#1b2335]'
                    : 'hover:bg-[#1a2332]'
                )}
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center text-xs font-semibold text-white">
                      {getInitials(partner.name)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{partner.name}</p>
                      <p className="text-[10px] text-gray-400">ID: {partner.partnerId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <p className="text-xs text-gray-400">{partner.submissionDate}</p>
                </td>
                <td className="px-6 py-3">
                  <p className="text-xs text-gray-400">{partner.type}</p>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className={clsx('w-2 h-2 rounded-full', getStatusDotColor(partner.status))}></div>
                    <span className={clsx('text-xs font-medium', getStatusTextColor(partner.status))}>
                      {partner.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
