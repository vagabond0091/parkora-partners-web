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
