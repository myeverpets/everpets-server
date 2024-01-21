import { Role } from '../../roles/roles.enum';

export interface AccessTokenPayload {
  sub: number;
  email: string;
  role: Role;
}

export interface RefreshTokenPayload {
  sub: number;
}
