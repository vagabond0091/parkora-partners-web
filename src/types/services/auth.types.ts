export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: string; // JWT token
  errorCode: number;
  message: string;
  status: string;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  businessType?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface RegisterResponse {
  data: any;
  errorCode: number;
  message: string;
  status: string;
}

export interface JwtPayload {
  firstName: string;
  lastName: string;
  roles: string[];
  userId: string;
  email: string;
  status: string;
  sub: string; // username
  iss: string;
  iat: number;
  exp: number;
}
