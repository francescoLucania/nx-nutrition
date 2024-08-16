import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services';
import { inject } from '@angular/core';
import { ModalService } from 'ngx-neo-ui';
import { LoginModalComponent } from '../../components/login-modal/login-modal.component';

export const userProfileGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const modalService: ModalService = inject(ModalService);

  if (authService.isLoggedIn === 'done') {
    return true;
  } else {
    modalService.open(LoginModalComponent, undefined, {
      route: route?.routeConfig?.path
    });
  }
  return false;

};
