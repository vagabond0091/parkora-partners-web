import { userInfoSchema, companyInfoSchema, registerSchema } from '@/validation/register.validation';
import {
  createInvalidUserInfo,
  createInvalidCompanyInfo,
  createInvalidRegisterData,
} from '../fixtures/registerFixtures';

describe('register validation', () => {
  describe('userInfoSchema', () => {
    // Positive Tests
    describe('positive cases', () => {
      it('should validate valid user information with all fields', () => {
        // Arrange
        const validData = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result).toEqual(validData);
      });

      it('should validate user information with minimal required fields', () => {
        // Arrange
        const validData = {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result).toEqual(validData);
      });

      it('should validate email with subdomain', () => {
        // Arrange
        const validData = {
          email: 'user@mail.example.com',
          password: 'password123',
          confirmPassword: 'password123',
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result.email).toBe('user@mail.example.com');
      });

      it('should validate username with minimum length (3 characters)', () => {
        // Arrange
        const validData = {
          username: 'abc',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result.username).toBe('abc');
      });

      it('should validate username with maximum length (100 characters)', () => {
        // Arrange
        const longUsername = 'a'.repeat(100);
        const validData = {
          username: longUsername,
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result.username).toBe(longUsername);
      });

      it('should validate password with minimum length (6 characters)', () => {
        // Arrange
        const validData = {
          email: 'test@example.com',
          password: '123456',
          confirmPassword: '123456',
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result.password).toBe('123456');
      });

      it('should validate empty optional fields', () => {
        // Arrange
        const validData = {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          firstName: '',
          lastName: '',
          phone: '',
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result.firstName).toBe('');
        expect(result.lastName).toBe('');
        expect(result.phone).toBe('');
      });

      it('should validate first name with maximum length (100 characters)', () => {
        // Arrange
        const longFirstName = 'A'.repeat(100);
        const validData = {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          firstName: longFirstName,
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result.firstName).toBe(longFirstName);
      });

      it('should validate last name with maximum length (100 characters)', () => {
        // Arrange
        const longLastName = 'B'.repeat(100);
        const validData = {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          lastName: longLastName,
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result.lastName).toBe(longLastName);
      });
    });

    // Negative Tests
    describe('negative cases', () => {
      it('should reject empty email', () => {
        // Arrange
        const invalidData = createInvalidUserInfo({ email: '' });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Email is required');
      });

      it('should reject invalid email format', () => {
        // Arrange
        const invalidData = createInvalidUserInfo({ email: 'invalid-email' });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Email should be valid');
      });

      it('should reject email exceeding maximum length (255 characters)', () => {
        // Arrange
        const longEmail = 'a'.repeat(250) + '@example.com';
        const invalidData = createInvalidUserInfo({ email: longEmail });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Email must not exceed 255 characters');
      });

      it('should reject empty password', () => {
        // Arrange
        const invalidData = createInvalidUserInfo({ password: '', confirmPassword: '' });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Password is required');
      });

      it('should reject password shorter than 6 characters', () => {
        // Arrange
        const invalidData = createInvalidUserInfo({ password: '12345', confirmPassword: '12345' });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Password must be at least 6 characters');
      });

      it('should reject passwords that do not match', () => {
        // Arrange
        const invalidData = createInvalidUserInfo({ confirmPassword: 'password456' });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Passwords do not match');
      });

      it('should reject username shorter than 3 characters', () => {
        // Arrange
        const invalidData = createInvalidUserInfo({ username: 'ab' });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Username must be between 3 and 100 characters');
      });

      it('should reject username longer than 100 characters', () => {
        // Arrange
        const longUsername = 'a'.repeat(101);
        const invalidData = createInvalidUserInfo({ username: longUsername });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Username must be between 3 and 100 characters');
      });

      it('should reject first name longer than 100 characters', () => {
        // Arrange
        const longFirstName = 'A'.repeat(101);
        const invalidData = createInvalidUserInfo({ firstName: longFirstName });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('First name must not exceed 100 characters');
      });

      it('should reject last name longer than 100 characters', () => {
        // Arrange
        const longLastName = 'B'.repeat(101);
        const invalidData = createInvalidUserInfo({ lastName: longLastName });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Last name must not exceed 100 characters');
      });

      it('should reject first name that is all numbers', () => {
        // Arrange
        const invalidData = createInvalidUserInfo({ firstName: '12345' });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('First name cannot be all numbers');
      });

      it('should reject last name that is all numbers', () => {
        // Arrange
        const invalidData = createInvalidUserInfo({ lastName: '67890' });

        // Act & Assert
        expect(() => userInfoSchema.parse(invalidData)).toThrow('Last name cannot be all numbers');
      });

      it('should accept first name with numbers mixed with letters', () => {
        // Arrange
        const validData = {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          firstName: 'John123',
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result.firstName).toBe('John123');
      });

      it('should accept last name with numbers mixed with letters', () => {
        // Arrange
        const validData = {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          lastName: 'Doe456',
        };

        // Act
        const result = userInfoSchema.parse(validData);

        // Assert
        expect(result.lastName).toBe('Doe456');
      });
    });
  });

  describe('companyInfoSchema', () => {
    // Positive Tests
    describe('positive cases', () => {
      it('should validate valid company information with all fields', () => {
        // Arrange
        const validData = {
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

        // Act
        const result = companyInfoSchema.parse(validData);

        // Assert
        expect(result).toEqual(validData);
      });

      it('should validate company information with minimal required fields', () => {
        // Arrange
        const validData = {
          companyName: 'Test Company',
          businessRegistrationNumber: 'BR123456',
          taxIdentificationNumber: 'TAX123',
        };

        // Act
        const result = companyInfoSchema.parse(validData);

        // Assert
        expect(result).toEqual(validData);
      });

      it('should validate company name with maximum length (255 characters)', () => {
        // Arrange
        const longCompanyName = 'A'.repeat(255);
        const validData = {
          companyName: longCompanyName,
          businessRegistrationNumber: 'BR123456',
          taxIdentificationNumber: 'TAX123',
        };

        // Act
        const result = companyInfoSchema.parse(validData);

        // Assert
        expect(result.companyName).toBe(longCompanyName);
      });

      it('should validate business registration number with maximum length (100 characters)', () => {
        // Arrange
        const longRegNumber = 'A'.repeat(100);
        const validData = {
          companyName: 'Test Company',
          businessRegistrationNumber: longRegNumber,
          taxIdentificationNumber: 'TAX123',
        };

        // Act
        const result = companyInfoSchema.parse(validData);

        // Assert
        expect(result.businessRegistrationNumber).toBe(longRegNumber);
      });

      it('should validate tax identification number with maximum length (50 characters)', () => {
        // Arrange
        const longTaxId = 'A'.repeat(50);
        const validData = {
          companyName: 'Test Company',
          businessRegistrationNumber: 'BR123456',
          taxIdentificationNumber: longTaxId,
        };

        // Act
        const result = companyInfoSchema.parse(validData);

        // Assert
        expect(result.taxIdentificationNumber).toBe(longTaxId);
      });

      it('should validate optional fields as empty strings', () => {
        // Arrange
        const validData = {
          companyName: 'Test Company',
          businessRegistrationNumber: 'BR123456',
          taxIdentificationNumber: 'TAX123',
          businessType: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          province: '',
          postalCode: '',
          country: '',
        };

        // Act
        const result = companyInfoSchema.parse(validData);

        // Assert
        expect(result.businessType).toBe('');
        expect(result.addressLine1).toBe('');
      });
    });

    // Negative Tests
    describe('negative cases', () => {
      it('should reject empty company name', () => {
        // Arrange
        const invalidData = createInvalidCompanyInfo({ companyName: '' });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Company name is required');
      });

      it('should reject company name longer than 255 characters', () => {
        // Arrange
        const longCompanyName = 'A'.repeat(256);
        const invalidData = createInvalidCompanyInfo({ companyName: longCompanyName });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Company name must not exceed 255 characters');
      });

      it('should reject empty business registration number', () => {
        // Arrange
        const invalidData = createInvalidCompanyInfo({ businessRegistrationNumber: '' });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Business registration number is required');
      });

      it('should reject business registration number longer than 100 characters', () => {
        // Arrange
        const longRegNumber = 'A'.repeat(101);
        const invalidData = createInvalidCompanyInfo({ businessRegistrationNumber: longRegNumber });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Business registration number must not exceed 100 characters');
      });

      it('should reject empty tax identification number', () => {
        // Arrange
        const invalidData = createInvalidCompanyInfo({ taxIdentificationNumber: '' });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Tax identification number is required');
      });

      it('should reject tax identification number longer than 50 characters', () => {
        // Arrange
        const longTaxId = 'A'.repeat(51);
        const invalidData = createInvalidCompanyInfo({ taxIdentificationNumber: longTaxId });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Tax identification number must not exceed 50 characters');
      });

      it('should reject business type longer than 50 characters', () => {
        // Arrange
        const longBusinessType = 'A'.repeat(51);
        const invalidData = createInvalidCompanyInfo({ businessType: longBusinessType });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Business type must not exceed 50 characters');
      });

      it('should reject address line 1 longer than 255 characters', () => {
        // Arrange
        const longAddress = 'A'.repeat(256);
        const invalidData = createInvalidCompanyInfo({ addressLine1: longAddress });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Address line 1 must not exceed 255 characters');
      });

      it('should reject address line 2 longer than 255 characters', () => {
        // Arrange
        const longAddress = 'A'.repeat(256);
        const invalidData = createInvalidCompanyInfo({ addressLine2: longAddress });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Address line 2 must not exceed 255 characters');
      });

      it('should reject city longer than 100 characters', () => {
        // Arrange
        const longCity = 'A'.repeat(101);
        const invalidData = createInvalidCompanyInfo({ city: longCity });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('City must not exceed 100 characters');
      });

      it('should reject state longer than 100 characters', () => {
        // Arrange
        const longState = 'A'.repeat(101);
        const invalidData = createInvalidCompanyInfo({ state: longState });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('State must not exceed 100 characters');
      });

      it('should reject province longer than 100 characters', () => {
        // Arrange
        const longProvince = 'A'.repeat(101);
        const invalidData = createInvalidCompanyInfo({ province: longProvince });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Province must not exceed 100 characters');
      });

      it('should reject postal code longer than 20 characters', () => {
        // Arrange
        const longPostalCode = 'A'.repeat(21);
        const invalidData = createInvalidCompanyInfo({ postalCode: longPostalCode });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Postal code must not exceed 20 characters');
      });

      it('should reject country longer than 100 characters', () => {
        // Arrange
        const longCountry = 'A'.repeat(101);
        const invalidData = createInvalidCompanyInfo({ country: longCountry });

        // Act & Assert
        expect(() => companyInfoSchema.parse(invalidData)).toThrow('Country must not exceed 100 characters');
      });
    });
  });

  describe('registerSchema', () => {
    // Positive Tests
    describe('positive cases', () => {
      it('should validate complete registration data with all fields', () => {
        // Arrange
        const validData = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
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

        // Act
        const result = registerSchema.parse(validData);

        // Assert
        expect(result).toEqual(validData);
      });

      it('should validate registration data with minimal required fields', () => {
        // Arrange
        const validData = {
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          companyName: 'Test Company',
          businessRegistrationNumber: 'BR123456',
          taxIdentificationNumber: 'TAX123',
        };

        // Act
        const result = registerSchema.parse(validData);

        // Assert
        expect(result).toEqual(validData);
      });
    });

    // Negative Tests
    describe('negative cases', () => {
      it('should reject registration data with invalid email', () => {
        // Arrange
        const invalidData = createInvalidRegisterData({ email: 'invalid-email' });

        // Act & Assert
        expect(() => registerSchema.parse(invalidData)).toThrow('Email should be valid');
      });

      it('should reject registration data with mismatched passwords', () => {
        // Arrange
        const invalidData = createInvalidRegisterData({ confirmPassword: 'password456' });

        // Act & Assert
        expect(() => registerSchema.parse(invalidData)).toThrow('Passwords do not match');
      });

      it('should reject registration data with missing company name', () => {
        // Arrange
        const invalidData = createInvalidRegisterData({ companyName: '' });

        // Act & Assert
        expect(() => registerSchema.parse(invalidData)).toThrow('Company name is required');
      });

      it('should reject registration data with missing business registration number', () => {
        // Arrange
        const invalidData = createInvalidRegisterData({ businessRegistrationNumber: '' });

        // Act & Assert
        expect(() => registerSchema.parse(invalidData)).toThrow('Business registration number is required');
      });

      it('should reject registration data with missing tax identification number', () => {
        // Arrange
        const invalidData = createInvalidRegisterData({ taxIdentificationNumber: '' });

        // Act & Assert
        expect(() => registerSchema.parse(invalidData)).toThrow('Tax identification number is required');
      });
    });
  });
});
