import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';
import UnauthorizedException from '../../exception/unauthorized/unauthorized';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
  ) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log('context', context.switchToHttp())

    const response = context.switchToHttp().getRequest();
    const token = response?.cookies.refreshToken;
    console.log('response?.cookies', response?.cookies)

    if (
      token &&
      this.userService.checkAuthState(token)
    ) {
      return true;
    }

    throw new UnauthorizedException('BAD_TOKEN')
  }
}
