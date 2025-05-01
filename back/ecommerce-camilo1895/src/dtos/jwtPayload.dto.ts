import { Role } from 'src/auth/roles.enum';

export class JwtPayloadDto {
  sub: string;
  email: string;
  roles?: [Role];
  iat: string;
  exp: string;
}
