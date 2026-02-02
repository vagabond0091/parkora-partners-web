import type { ICountry } from 'country-state-city';

export interface CountrySelectProps {
  label?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  countries: ICountry[];
  disabled?: boolean;
  required?: boolean;
}
