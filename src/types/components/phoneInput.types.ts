export interface PhoneInputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryChange?: (countryCode: string | null) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}
