import { clsx } from 'clsx';
import type { Partner } from '@/types/pages/verificationManagement.types';
import type { TableColumn } from '@/types/components/table.types';
import { getInitials, getStatusDotColor, getStatusTextColor } from '@/components/common/verificationUtils';

/**
 * Creates table column definitions for verification management.
 * @param selectedPartnerId - The ID of the currently selected partner (for highlighting)
 * @returns Array of table column definitions
 */
export const createVerificationTableColumns = (
  selectedPartnerId: string | null
): TableColumn<Partner>[] => {
  return [
    {
      header: 'PARTNER NAME',
      accessor: 'name',
      render: (_, partner) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center text-xs font-semibold text-white">
            {getInitials(partner.name)}
          </div>
          <div>
            <p className="text-xs font-medium text-white">{partner.name}</p>
            <p className="text-[10px] text-gray-400">ID: {partner.partnerId}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'SUBMISSION DATE',
      accessor: 'submissionDate',
      render: (value) => <p className="text-xs text-gray-400">{value as string}</p>,
    },
    {
      header: 'TYPE',
      accessor: 'type',
      render: (value) => (
        <span className="inline-flex px-2 py-1 rounded-full bg-[#272f40] text-[10px] font-medium text-gray-200">
          {value as string}
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessor: 'status',
      render: (value) => {
        const status = value as string;
        return (
          <div className="flex items-center gap-2">
            <div className={clsx('w-2 h-2 rounded-full', getStatusDotColor(status))}></div>
            <span className={clsx('text-[10px] font-bold', getStatusTextColor(status))}>
              {status}
            </span>
          </div>
        );
      },
    },
    {
      header: '',
      accessor: () => null,
      width: '48px',
      render: (_, partner) => (
        <div
          className={clsx(
            'transition-opacity',
            selectedPartnerId === partner.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
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
      ),
    },
  ];
};
