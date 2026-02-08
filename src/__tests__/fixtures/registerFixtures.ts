/**
 * Test fixtures for register validation tests
 * Provides reusable functions to create valid and invalid test data
 */

/**
 * Base valid user information data
 */
const baseValidUserInfo = {
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  username: 'testuser',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
};

/**
 * Base valid company information data
 */
const baseValidCompanyInfo = {
  companyName: 'Test Company',
  businessRegistrationNumber: 'BR123456',
  taxIdentificationNumber: 'TAX123',
  businessType: 'LLC',
  addressLine1: '123 Main St',
  addressLine2: 'Suite 100',
  city: 'New York',
  state: 'NY',
  province: 'Ontario',
  postalCode: '10001',
  country: 'United States',
};

/**
 * Creates invalid user information data by overriding specific fields
 * @param overrides - Fields to override with invalid values
 * @returns Invalid user information data object
 */
export const createInvalidUserInfo = (overrides: Partial<typeof baseValidUserInfo>) => {
  return {
    ...baseValidUserInfo,
    ...overrides,
  };
};

/**
 * Creates invalid company information data by overriding specific fields
 * @param overrides - Fields to override with invalid values
 * @returns Invalid company information data object
 */
export const createInvalidCompanyInfo = (overrides: Partial<typeof baseValidCompanyInfo>) => {
  return {
    ...baseValidCompanyInfo,
    ...overrides,
  };
};

/**
 * Creates invalid registration data by overriding specific fields
 * @param overrides - Fields to override with invalid values
 * @returns Invalid registration data object
 */
export const createInvalidRegisterData = (
  overrides: Partial<typeof baseValidUserInfo & typeof baseValidCompanyInfo>
) => {
  return {
    ...baseValidUserInfo,
    ...baseValidCompanyInfo,
    ...overrides,
  };
};

/**
 * Creates valid user information data with optional overrides
 * @param overrides - Optional fields to override
 * @returns Valid user information data object
 */
export const createValidUserInfo = (overrides?: Partial<typeof baseValidUserInfo>) => {
  return {
    ...baseValidUserInfo,
    ...overrides,
  };
};

/**
 * Creates valid company information data with optional overrides
 * @param overrides - Optional fields to override
 * @returns Valid company information data object
 */
export const createValidCompanyInfo = (overrides?: Partial<typeof baseValidCompanyInfo>) => {
  return {
    ...baseValidCompanyInfo,
    ...overrides,
  };
};

/**
 * Creates valid registration data with optional overrides
 * @param overrides - Optional fields to override
 * @returns Valid registration data object
 */
export const createValidRegisterData = (
  overrides?: Partial<typeof baseValidUserInfo & typeof baseValidCompanyInfo>
) => {
  return {
    ...baseValidUserInfo,
    ...baseValidCompanyInfo,
    ...overrides,
  };
};
