export class JwtPayloadDto {
  sub: string;
  email: string;
  roles?: ['Admin'];
  iat: number;
  exp: number;
}
