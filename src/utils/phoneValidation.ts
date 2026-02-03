import { isValidPhoneNumber, parsePhoneNumber, isPossiblePhoneNumber } from 'libphonenumber-js';

/**
 * Validates a phone number for a specific country
 * @param phoneNumber - The phone number to validate (can include country code)
 * @param countryCode - ISO country code (e.g., 'PH', 'US')
 * @returns Object with isValid boolean and error message if invalid
 */
export const validatePhoneNumber = (
  phoneNumber: string,
  countryCode?: string | null
): { isValid: boolean; error?: string } => {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return { isValid: true }; // Optional field
  }

  try {
    // Remove spaces and format for parsing
    const cleaned = phoneNumber.replace(/\s+/g, '');

    if (countryCode) {
      // Try to parse and validate the phone number
      try {
        const parsed = parsePhoneNumber(cleaned, countryCode as any);
        
        // Check if the number is valid (complete and correct format)
        // isValid() returns false for incomplete numbers
        if (!parsed.isValid()) {
          // Check if it's at least possible (could become valid if completed)
          const isPossible = isPossiblePhoneNumber(cleaned, countryCode as any);
          if (isPossible) {
            // It's possible but not valid - likely incomplete
            return {
              isValid: false,
              error: `Please enter a complete ${countryCode} phone number`,
            };
          } else {
            // Not even possible - wrong format or too short
            return {
              isValid: false,
              error: `Please enter a valid ${countryCode} phone number`,
            };
          }
        }
        
        // Number is valid and complete
        return { isValid: true };
      } catch (parseError) {
        // If parsing fails completely, the number format is wrong
        // Check if it's at least possible to give a better error message
        const isPossible = isPossiblePhoneNumber(cleaned, countryCode as any);
        if (isPossible) {
          return {
            isValid: false,
            error: `Please enter a complete ${countryCode} phone number`,
          };
        }
        return {
          isValid: false,
          error: `Please enter a valid ${countryCode} phone number`,
        };
      }
    } else {
      // Try to validate without country (will auto-detect)
      const isPossible = isPossiblePhoneNumber(cleaned);
      if (!isPossible) {
        return {
          isValid: false,
          error: 'Please enter a valid phone number',
        };
      }

      const isValid = isValidPhoneNumber(cleaned);
      if (!isValid) {
        return {
          isValid: false,
          error: 'Please enter a valid phone number',
        };
      }
      return { isValid: true };
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number',
    };
  }
};
