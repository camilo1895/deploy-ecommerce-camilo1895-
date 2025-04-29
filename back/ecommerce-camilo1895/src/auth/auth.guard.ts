import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtPayloadDto } from '../dtos/jwtPayload.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  user: JwtPayloadDto;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split(' ')[1] ?? '';

    if (!token) {
      throw new UnauthorizedException('Bearer token notFound');
    }

    try {
      const secret = process.env.JWT_SECRET;

      this.jwtService.verify(token, { secret });
      /*      payload.roles = ['ADMIN'];
      payload.iat = new Date(payload.iat * 1000).toLocaleString();
      payload.exp = new Date(payload.exp * 1000).toLocaleString(); */

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
