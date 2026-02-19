import { useState } from 'react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/authStore';

/**
 * Partner verification data type.
 */
interface PartnerVerification {
  id: string;
  name: string;
  submissionDate: string;
  submissionTime: string;
  type: 'Enterprise' | 'Standard';
  status: 'UNDER REVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED';
  assignee: string;
  documents: {
    id: string;
    type: string;
    fileName: string;
  }[];
}

/**
 * Verification Management page component.
 * Allows admins to manage and review partner onboarding documents.
 */
export const VerificationManagementPage = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<string | null>('1');
  const [reviewerNotes, setReviewerNotes] = useState('');

  /**
   * Mock data for partners - replace with API call in production.
   */
  const partners: PartnerVerification[] = [
    {
      id: '1',
      name: 'Urban Resorts LLC',
      submissionDate: 'Oct 24, 2023',
      submissionTime: '2:45 PM',
      type: 'Enterprise',
      status: 'UNDER REVIEW',
      assignee: 'Admin (You)',
      documents: [
        {
          id: '1',
          type: 'Business License',
          fileName: 'license_2023_ur.pdf',
        },
        {
          id: '2',
          type: 'Tax Documents (W-9 / VAT)',
          fileName: 'tax_form_signed.png',
        },
      ],
    },
    {
      id: '2',
      name: 'City Parking Solutions',
      submissionDate: 'Oct 23, 2023',
      submissionTime: '10:30 AM',
      type: 'Standard',
      status: 'PENDING',
      assignee: 'Admin (You)',
      documents: [
        {
          id: '1',
          type: 'Business License',
          fileName: 'license_2023_cps.pdf',
        },
      ],
    },
    {
      id: '3',
      name: 'North Hill Properties',
      submissionDate: 'Oct 22, 2023',
      submissionTime: '4:15 PM',
      type: 'Standard',
      status: 'PENDING',
      assignee: 'Admin (You)',
      documents: [
        {
          id: '1',
          type: 'Business License',
          fileName: 'license_2023_nhp.pdf',
        },
        {
          id: '2',
          type: 'Tax Documents (W-9 / VAT)',
          fileName: 'tax_form_nhp.pdf',
        },
      ],
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
   * Filter partners based on search query.
   */
  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Get selected partner data.
   */
  const selectedPartnerData = partners.find((p) => p.id === selectedPartner);

  /**
   * Get status badge styling.
   */
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'UNDER REVIEW':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'PENDING':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'APPROVED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Verification Management</h1>
          <p className="text-sm text-gray-400">Manage and review partner onboarding documents</p>
        </div>

        <div className="flex gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Partner List */}
          <div className="w-1/2 flex flex-col bg-[#1a1a2e] rounded-xl border border-gray-800 overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-800">
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
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f1e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Partner List Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#1a1a2e] border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      PARTNER NAME
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      SUBMISSION DATE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredPartners.map((partner) => (
                    <tr
                      key={partner.id}
                      onClick={() => setSelectedPartner(partner.id)}
                      className={clsx(
                        'cursor-pointer transition-colors',
                        selectedPartner === partner.id
                          ? 'bg-purple-500/10 hover:bg-purple-500/15'
                          : 'hover:bg-gray-800/50'
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold">
                            {getInitials(partner.name)}
                          </div>
                          <span className="text-sm font-medium text-white">{partner.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">{partner.submissionDate}</td>
                      <td className="px-4 py-4 text-sm text-gray-400">{partner.type}</td>
                      <td className="px-4 py-4">
                        {partner.status === 'PENDING' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <span className="text-sm text-gray-400">{partner.status}</span>
                          </div>
                        ) : (
                          <span
                            className={clsx(
                              'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border',
                              getStatusBadgeClass(partner.status)
                            )}
                          >
                            {partner.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel - Review Session */}
          <div className="w-1/2 flex flex-col bg-[#1a1a2e] rounded-xl border border-gray-800 overflow-hidden">
            {selectedPartnerData ? (
              <>
                {/* Review Session Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      REVIEW SESSION
                    </span>
                    <span className="text-xs text-gray-400">Assignee: {selectedPartnerData.assignee}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{selectedPartnerData.name}</h2>
                  <p className="text-sm text-gray-400">
                    Submitted on {selectedPartnerData.submissionDate} at {selectedPartnerData.submissionTime}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Verification Documents */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                      VERIFICATION DOCUMENTS
                    </h3>
                    <div className="space-y-3">
                      {selectedPartnerData.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-[#0f0f1e] border border-gray-700 rounded-lg p-4 flex items-center gap-3 hover:border-gray-600 transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{doc.type}</p>
                            <p className="text-xs text-gray-400">{doc.fileName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviewer Notes */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                      REVIEWER NOTES
                    </h3>
                    <textarea
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      placeholder="Provide feedback or internal notes here..."
                      className="w-full h-32 px-4 py-3 bg-[#0f0f1e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400">Select a partner to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
