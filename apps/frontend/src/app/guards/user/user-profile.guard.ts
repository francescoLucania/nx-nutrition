import { CanActivateFn } from '@angular/router';
import { UserService } from '../../services';
import { inject } from '@angular/core';
import { ModalService } from 'ngx-neo-ui';
import { LoginModalComponent } from '../../components/login-modal/login-modal.component';

export const userProfileGuard: CanActivateFn = (route, state) => {
  const userService: UserService = inject(UserService);
  const modalService: ModalService = inject(ModalService);

  if (userService.isLoggedIn) {
    return true;
  } else {
    modalService.open(LoginModalComponent);
  }
  return false;

};
