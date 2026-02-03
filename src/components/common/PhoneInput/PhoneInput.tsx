import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Country } from 'country-state-city';
import type { ICountry } from 'country-state-city';
import ReactCountryFlag from 'react-country-flag';
import type { PhoneInputProps } from '@/types/components/phoneInput.types';

export const PhoneInput = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder = 'Enter phone number',
  disabled = false,
}: PhoneInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countries = Country.getAllCountries();
  const inputId = label?.toLowerCase().replace(/\s+/g, '-');

  // Initialize with a default country (e.g., US) or detect from value
  useEffect(() => {
    if (!selectedCountry && countries.length > 0) {
      // Try to detect country from phone value
      if (value && value.startsWith('+')) {
        const codeMatch = value.match(/^\+(\d+)/);
        if (codeMatch) {
          const phoneCode = codeMatch[1];
          const detectedCountry = countries.find((c) => c.phonecode === phoneCode);
          if (detectedCountry) {
            setSelectedCountry(detectedCountry);
            return;
          }
        }
      }
      // Default to US if no match
      const defaultCountry = countries.find((c) => c.phonecode === '1') || countries[0];
      setSelectedCountry(defaultCountry);
    }
  }, [countries, selectedCountry, value]);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.isoCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.phonecode.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCountrySelect = (country: ICountry) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value;
    // Combine country code with phone number
    const fullPhoneNumber = selectedCountry 
      ? `+${selectedCountry.phonecode} ${phoneNumber}`.trim()
      : phoneNumber;
    
    const syntheticEvent = {
      target: { name, value: fullPhoneNumber },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  // Extract phone number without country code for display
  const phoneValue = selectedCountry && value.startsWith(`+${selectedCountry.phonecode}`)
    ? value.replace(`+${selectedCountry.phonecode}`, '').trim()
    : value.replace(/^\+\d+\s*/, '').trim();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {/* Country Code Selector */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={clsx(
              'h-[52px] px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50/50',
              'text-gray-900 text-left',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400',
              'transition-all duration-200',
              'flex items-center gap-2',
              error && 'border-red-400 focus:ring-red-500/20 focus:border-red-400',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-100'
            )}
          >
            {selectedCountry ? (
              <>
                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                  <ReactCountryFlag
                    countryCode={selectedCountry.isoCode}
                    svg
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    title={selectedCountry.name}
                  />
                </div>
                <span className="text-sm font-medium">+{selectedCountry.phonecode}</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">Code</span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'h-4 w-4 text-gray-400 transition-transform shrink-0',
                isOpen && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-80 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto max-h-48">
                {filteredCountries.length === 0 ? (
                  <div className="px-4 py-3 text-gray-500 text-sm">No countries found</div>
                ) : (
                  filteredCountries.map((country) => (
                    <button
                      key={country.isoCode}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={clsx(
                        'w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors',
                        selectedCountry?.isoCode === country.isoCode && 'bg-purple-50'
                      )}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                        <ReactCountryFlag
                          countryCode={country.isoCode}
                          svg
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          title={country.name}
                        />
                      </div>
                      <span className="flex-1 text-gray-900">{country.name}</span>
                      <span className="text-sm text-gray-500">+{country.phonecode}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          id={inputId}
          type="tel"
          name={name}
          value={phoneValue}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'flex-1 h-[52px] px-4 py-3 rounded-r-xl border border-l-0 border-gray-200 bg-gray-50/50',
            'text-gray-900 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400',
            'transition-all duration-200',
            error && 'border-red-400 focus:ring-red-500/20 focus:border-red-400',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-100'
          )}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
