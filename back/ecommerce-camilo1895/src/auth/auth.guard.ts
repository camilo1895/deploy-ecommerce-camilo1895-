import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayloadDto } from 'src/dtos/jwtPayload.dto';
import { Role } from './roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization']?.split(' ')[1] ?? '';

    if (!token) {
      throw new UnauthorizedException('Bearer token notFound');
    }

    try {
      const secret = process.env.JWT_SECRET;

      const payload = this.jwtService.verify<JwtPayloadDto>(token, { secret });

      payload.roles = [Role.User];

      payload.iat = new Date(Number(payload.iat) * 1000).toLocaleString();
      payload.exp = new Date(Number(payload.exp) * 1000).toLocaleString();

      request.user = payload;

      console.log(payload);

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token', error);
    }
  }
}
