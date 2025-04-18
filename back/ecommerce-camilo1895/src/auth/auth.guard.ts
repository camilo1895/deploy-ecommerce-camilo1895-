import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

function validateRequest(request: Request): boolean {
  const email = request.headers['email'] as string | undefined;
  const password = request.headers['password'] as string | undefined;

  return email === 'camilo@gmail.com' && password === '123';
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    return validateRequest(request);
  }
}
