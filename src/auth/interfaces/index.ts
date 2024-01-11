export interface AccessTokenPayload {
  sub: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  photoUrl: string | null;
}

export interface RefreshTokenPayload {
  sub: number;
}
