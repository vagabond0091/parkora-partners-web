import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import SimpleBar from 'simplebar-react';
import type { Partner } from '@/types/pages/verificationManagement.types';
import { Table } from '@/components/common/Table/Table';
import { VerificationDocumentCard } from '@/components/common/VerificationDocumentCard/VerificationDocumentCard';
import { Modal } from '@/components/common/Modal/Modal';
import { TextArea } from '@/components/common/TextArea/TextArea';
import { Button } from '@/components/common/Button/Button';
import { usePendingCompanies } from '@/hooks/verification';
import { createVerificationTableColumns } from './verificationTableColumns';
import { getInitials } from '@/components/common/verificationUtils';

/**
 * Verification Management page component.
 * Allows admins to manage and review partner onboarding documents.
 */
export const VerificationManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'verify' | 'flag' | null;
    documentTitle: string;
  }>({ isOpen: false, type: null, documentTitle: '' });
  const [actionNote, setActionNote] = useState('');

  const handleOpenActionModal = (type: 'verify' | 'flag', documentTitle: string) => {
    setActionModal({ isOpen: true, type, documentTitle });
    setActionNote('');
  };

  const handleCloseActionModal = () => {
    setActionModal({ isOpen: false, type: null, documentTitle: '' });
    setActionNote('');
  };

  const handleSubmitAction = () => {
    // Handle submission logic here
    console.log(`Action: ${actionModal.type}, Document: ${actionModal.documentTitle}, Note: ${actionNote}`);
    handleCloseActionModal();
  };

  /**
   * Fetch pending companies using React Query hook.
   */
  const { data: companiesResponse, isLoading, error: queryError } = usePendingCompanies({
    page: currentPage - 1, // API uses 0-based indexing
    size: pageSize,
  });

  /**
   * Map API verification status to Partner status.
   */
  const mapVerificationStatus = (status: string): Partner['status'] => {
    switch (status) {
      case 'UNDER_REVIEW':
        return 'UNDER REVIEW';
      case 'PENDING':
        return 'PENDING';
      case 'APPROVED':
        return 'APPROVED';
      case 'REJECTED':
        return 'REJECTED';
      default:
        return 'PENDING';
    }
  };

  /**
   * Map API response to Partner format.
   */
  const partners = useMemo<Partner[]>(() => {
    if (!companiesResponse?.data) {
      return [];
    }

    return companiesResponse.data.content.map((company) => ({
      id: company.id,
      name: company.name,
      partnerId: `PRK-${company.id.slice(0, 8).toUpperCase()}`,
      submissionDate: company.documents?.[0]?.uploadedAt
        ? new Date(company.documents[0].uploadedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'N/A',
      type: company.businessType === 'ENTERPRISE' ? 'Enterprise' : 'Standard',
      status: mapVerificationStatus(company.verificationStatus),
    }));
  }, [companiesResponse]);

  /**
   * Extract total items from API response.
   */
  const totalItems = companiesResponse?.data?.totalElements ?? 0;

  /**
   * Extract error message from query error.
   */
  const error = queryError instanceof Error ? queryError.message : queryError ? 'Failed to fetch companies' : null;

  const selectedPartnerData = partners.find((partnerItem) => partnerItem.id === selectedPartner);

  /**
   * Table column definitions.
   */
  const columns = useMemo(
    () => createVerificationTableColumns(selectedPartner),
    [selectedPartner]
  );

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
          {isLoading ? (
            <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-12">
              <div className="flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading companies...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-12">
              <div className="flex items-center justify-center">
                <p className="text-sm text-red-400">Error: {error}</p>
              </div>
            </div>
          ) : (
            <Table<Partner>
              data={partners}
              columns={columns}
              getRowKey={(row) => row.id}
              onRowClick={(row) =>
                setSelectedPartner((currentSelectedPartner) =>
                  currentSelectedPartner === row.id ? null : row.id
                )
              }
              isRowSelected={(row) => selectedPartner === row.id}
              emptyMessage="No partners found"
              pagination={{
                currentPage,
                pageSize,
                totalItems,
                onPageChange: setCurrentPage,
                onPageSizeChange: (newPageSize) => {
                  setPageSize(newPageSize);
                  setCurrentPage(1);
                },
                enabled: true,
              }}
            />
          )}
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
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#1f2937] transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#111827]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <SimpleBar className="flex-1 min-h-0 pt-4 -mx-6 px-6">
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

                <div className="space-y-4 pb-6">
                  <VerificationDocumentCard
                    title="Business License"
                    description="Official license issued by state regulatory department."
                    onViewFile={() => {}}
                    onVerify={() => handleOpenActionModal('verify', 'Business License')}
                    onFlag={() => handleOpenActionModal('flag', 'Business License')}
                  />
                  <VerificationDocumentCard
                    title="Tax Identification"
                    description="Government-issued tax identification document (e.g., EIN certificate)."
                    onViewFile={() => {}}
                    onVerify={() => handleOpenActionModal('verify', 'Tax Identification')}
                    onFlag={() => handleOpenActionModal('flag', 'Tax Identification')}
                  />
                  <VerificationDocumentCard
                    title="Additional Documents"
                    description="Supplementary compliance or operational documents as required."
                    onViewFile={() => {}}
                    onVerify={() => handleOpenActionModal('verify', 'Additional Documents')}
                    onFlag={() => handleOpenActionModal('flag', 'Additional Documents')}
                  />
                </div>
              </div>
            </SimpleBar>

            <div className="pt-4 border-t border-gray-800 -mx-6 px-6">
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  type="button"
                  className="flex-1 h-9 rounded-lg bg-[#3f1d2b] text-sm font-semibold text-red-100 hover:bg-[#7f1d1d] transition-colors relative z-10"
                >
                  Reject Application
                </Button>
                <Button
                  type="button"
                  className="flex-1 h-9 rounded-lg bg-[#7f13ec] text-sm font-semibold text-white hover:bg-[#6a0fd6] transition-colors"
                >
                  Approve Partner
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-500">Select a partner to view verification details.</p>
          </div>
        )}
      </div>

      <Modal isOpen={actionModal.isOpen} onClose={handleCloseActionModal}>
        <Modal.Title onClose={handleCloseActionModal}>
          {actionModal.type === 'verify' ? 'Verify Document' : 'Flag Document'}
        </Modal.Title>
        <Modal.Content>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">
                You are about to {actionModal.type === 'verify' ? 'verify' : 'flag'} the{' '}
                <span className="font-semibold text-white">{actionModal.documentTitle}</span>.
              </p>
            </div>
            <TextArea
              label="Notes / Reason"
              placeholder={
                actionModal.type === 'verify'
                  ? 'Please provide notes about this verification'
                  : 'Please provide a reason for flagging this document'
              }
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              required={true}
            />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            onClick={handleCloseActionModal}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmitAction}
            disabled={!actionNote.trim()}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              actionModal.type === 'verify'
                ? 'bg-[#064e3b] text-green-100 hover:bg-[#047857]'
                : 'bg-[#3f1d2b] text-red-100 hover:bg-[#7f1d1d]',
              !actionNote.trim() && 'opacity-50 cursor-not-allowed'
            )}
          >
            {actionModal.type === 'verify' ? 'Confirm Verification' : 'Flag Document'}
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};
