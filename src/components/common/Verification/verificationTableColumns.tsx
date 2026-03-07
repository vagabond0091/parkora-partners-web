import type { Partner } from '@/types/pages/verificationManagement.types';
import type { TableColumn } from '@/types/components/table.types';
import {
  textColumn,
  badgeColumn,
  statusColumn,
  avatarColumn,
  actionColumn,
} from '@/utils/tableColumns';
import { renderChevronIcon } from '@/utils/tableRenderers';
import { getInitials, getStatusDotColor, getStatusTextColor } from './verificationUtils';

/**
 * Creates table column definitions for verification management.
 * @param selectedPartnerId - The ID of the currently selected partner (for highlighting)
 * @returns Array of table column definitions
 */
export const createVerificationTableColumns = (
  selectedPartnerId: string | null
): TableColumn<Partner>[] => {
  return [
    avatarColumn<Partner>('PARTNER NAME', {
      getName: (partner) => partner.name,
      getSubtitle: (partner) => `ID: ${partner.partnerId}`,
      getInitials,
    }),
    
    textColumn<Partner>('SUBMISSION DATE', 'submissionDate'),
    
    badgeColumn<Partner>('TYPE', 'type'),
    
    statusColumn<Partner>('STATUS', 'status', {
      getDotColor: getStatusDotColor,
      getTextColor: getStatusTextColor,
    }),
    
    actionColumn<Partner>({
      render: (_, isSelected) => renderChevronIcon(isSelected),
      getSelectedId: (partner) => partner.id,
      selectedId: selectedPartnerId,
    }),
  ];
};
