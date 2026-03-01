import { useState } from 'react';
import { clsx } from 'clsx';
import SimpleBar from 'simplebar-react';
import type { Partner } from '@/types/pages/verificationManagement.types';

/**
 * Verification Management page component.
 * Allows admins to manage and review partner onboarding documents.
 */
export const VerificationManagementPage = () => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

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

  const selectedPartnerData = partners.find((partnerItem) => partnerItem.id === selectedPartner);

  return (
    <div className="relative w-full h-full">
      <div className={clsx('w-full', selectedPartnerData && 'lg:pr-96')}>
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
              className={clsx(
                'pl-10 pr-4 py-2 bg-[#232b3d] border border-gray-700 rounded-lg text-[#464d5d] text-xs placeholder:text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6d28d9] focus:border-transparent transition-all duration-300',
                selectedPartnerData ? 'w-60' : 'w-70'
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
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
                  <th className="px-6 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {partners.map((partner) => (
                  <tr
                    key={partner.id}
                    onClick={() =>
                      setSelectedPartner((currentSelectedPartner) =>
                        currentSelectedPartner === partner.id ? null : partner.id
                      )
                    }
                    className={clsx(
                      'group cursor-pointer transition-colors bg-[#0f172a] border-t border-b border-gray-800',
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
                      <span className="inline-flex px-2 py-1 rounded-full bg-[#272f40] text-[10px] font-medium text-gray-200">
                        {partner.type}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className={clsx('w-2 h-2 rounded-full', getStatusDotColor(partner.status))}></div>
                        <span className={clsx('text-[10px] font-bold', getStatusTextColor(partner.status))}>
                          {partner.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div
                        className={clsx(
                          'transition-opacity',
                          selectedPartner === partner.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        )}
                      >
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'mt-6 bg-[#111827] rounded-xl border border-gray-800 p-6 overflow-hidden transform transition-all duration-300 ease-out flex flex-col',
          'lg:mt-0 lg:absolute lg:-top-8 lg:-right-8 lg:-bottom-16 lg:w-96',
          selectedPartnerData
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 translate-x-full pointer-events-none'
        )}
      >
        {selectedPartnerData ? (
          <>
            <div className="flex items-center justify-between border-b border-gray-800 pt-7.5 pb-4 mt-2 -mx-6 px-6">
              <div>
                <p className="text-base font-bold text-white">Verification Details</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#1f2937] transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#111827]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <SimpleBar className="flex-1 min-h-0 pt-4 -mr-6 pr-6">
              <div className="space-y-4 pr-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center text-sm font-semibold text-white">
                    {getInitials(selectedPartnerData.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedPartnerData.name}</p>
                    <p className="text-[11px] text-gray-400">
                      Submitted {selectedPartnerData.submissionDate} • {selectedPartnerData.partnerId}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                <div className="bg-[#1b2335] rounded-xl border border-gray-800 px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6M9 8h.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Business License</p>
                        <p className="text-[11px] text-gray-400">
                          Official license issued by state regulatory department.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      VIEW FILE
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 h-9 rounded-lg bg-[#064e3b] text-[11px] font-semibold text-green-100 hover:bg-[#047857] transition-colors"
                    >
                      VERIFY
                    </button>
                    <button
                      type="button"
                      className="flex-1 h-9 rounded-lg bg-[#3f1d2b] text-[11px] font-semibold text-red-200 hover:bg-[#7f1d1d] transition-colors"
                    >
                      FLAG
                    </button>
                  </div>
                </div>

                <div className="bg-[#1b2335] rounded-xl border border-gray-800 px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6M9 8h.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Tax Identification</p>
                        <p className="text-[11px] text-gray-400">
                          Government-issued tax identification document (e.g., EIN certificate).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      VIEW FILE
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 h-9 rounded-lg bg-[#064e3b] text-[11px] font-semibold text-green-100 hover:bg-[#047857] transition-colors"
                    >
                      VERIFY
                    </button>
                    <button
                      type="button"
                      className="flex-1 h-9 rounded-lg bg-[#3f1d2b] text-[11px] font-semibold text-red-200 hover:bg-[#7f1d1d] transition-colors"
                    >
                      FLAG
                    </button>
                  </div>
                </div>

                <div className="bg-[#1b2335] rounded-xl border border-gray-800 px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6M9 8h.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Additional Documents</p>
                        <p className="text-[11px] text-gray-400">
                          Supplementary compliance or operational documents as required.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      VIEW FILE
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 h-9 rounded-lg bg-[#064e3b] text-[11px] font-semibold text-green-100 hover:bg-[#047857] transition-colors"
                    >
                      VERIFY
                    </button>
                    <button
                      type="button"
                      className="flex-1 h-9 rounded-lg bg-[#3f1d2b] text-[11px] font-semibold text-red-200 hover:bg-[#7f1d1d] transition-colors"
                    >
                      FLAG
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </SimpleBar>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="flex-1 h-11 rounded-lg bg-[#7f1d1d] text-sm font-semibold text-red-100 hover:bg-[#991b1b] transition-colors"
              >
                Reject Application
              </button>
              <button
                type="button"
                className="flex-1 h-11 rounded-lg bg-[#7f13ec] text-sm font-semibold text-white hover:bg-[#6a0fd6] transition-colors"
              >
                Approve Partner
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-500">Select a partner to view verification details.</p>
          </div>
        )}
      </div>
    </div>
  );
};
