/**
 * Props for the VerificationDocumentCard component.
 */
export interface VerificationDocumentCardProps {
  /**
   * The title of the document (e.g., "Business License").
   */
  title: string;
  /**
   * The description text displayed below the title.
   */
  description: string;
  /**
   * Callback function called when the "VIEW FILE" button is clicked.
   */
  onViewFile?: () => void;
  /**
   * Callback function called when the "VERIFY" button is clicked.
   */
  onVerify?: () => void;
  /**
   * Callback function called when the "FLAG" button is clicked.
   */
  onFlag?: () => void;
}
