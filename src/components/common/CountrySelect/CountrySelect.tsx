import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import ReactCountryFlag from 'react-country-flag';
import type { CountrySelectProps } from '@/types/components/countrySelect.types';

export const CountrySelect = ({
  label,
  value,
  onChange,
  error,
  countries,
  disabled = false,
  required = false,
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectId = label?.toLowerCase().replace(/\s+/g, '-');

  const selectedCountry = countries.find((country) => country.name === value);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.isoCode.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSelect = (countryName: string) => {
    const syntheticEvent = {
      target: { name: 'country', value: countryName },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50',
            'text-gray-900 text-left',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400',
            'transition-all duration-200',
            'flex items-center justify-between',
            error && 'border-red-400 focus:ring-red-500/20 focus:border-red-400',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-100'
          )}
        >
          <span className="flex items-center gap-3">
            {selectedCountry ? (
              <>
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 shrink-0">
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
                <span>{selectedCountry.name}</span>
              </>
            ) : (
              <span className="text-gray-400">Select a country</span>
            )}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={clsx(
              'h-5 w-5 text-gray-400 transition-transform',
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
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
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
                    onClick={() => handleSelect(country.name)}
                    className={clsx(
                      'w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors',
                      selectedCountry?.isoCode === country.isoCode && 'bg-purple-50'
                    )}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 shrink-0">
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
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
