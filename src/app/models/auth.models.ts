export enum Roles {
  RECEPTIONIST = 'RECEPTIONIST',
  ADMIN = 'ADMIN',
  VET = 'VET',
}

export interface AuthResponse {
  username: string;
  jwtToken: string;
  role: Roles;
}
