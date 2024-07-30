import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { LoginType } from '@nx-nutrition-models';

export type LoginTypes = 'phone' | 'email';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  public readonly mask = {
    mobile: [
      '+',
      '7',
      ' ',
      '(',
      /\d/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ],
  };

  public readonly pattern = {
    email: /^\S+@\S+$/,
    mobile: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
    firstName:
      "((^[0-9А-ЯЁа-яё IVX()`.'-]+[0-9А-ЯЁа-яё IVX(),`.'-]+[,]?[0-9А-ЯЁа-яё IVX()`.'-]+$)|(^[0-9А-ЯЁа-яё IVX()`.'-]+$))|((^[0-9A-Za-z ()`.'-]+[0-9A-Za-z (),`.'-]+[,]?[0-9A-Za-z ()`.'-]+$)|(^[0-9A-Za-z ()`.'-]+$))",
    lastName: "(^[0-9А-ЯЁа-яё IVX()`.'-]+$)|(^[0-9A-Za-z ()`.'-]+$)",
  };

  public readonly regExp: { [key: string]: RegExp } = {
    searchPhone: /^7(\d{10})$|^(\d{10})$|^8(\d{10})$/,
    validatePhone:
      /^(\+7|7|8)?[\s-−–—]?[\s(]?\d([\s-−–—())]?[\s-−–—())]?\d){9}$/,
    formatPhone: /^(\d{3})(\d{7})/,
    formatPhoneHyphens: /^(\d{3})(\d{3})(\d{2})(\d{2})/,
    emailPattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  };

  public formatLogin(
    loginFormControl: AbstractControl<string> | undefined,
    loginTypes: LoginTypes[] = ['phone', 'email']
  ): { idType: LoginType; login: string } | false {
    let login = loginFormControl?.value;
    const loginType = new Map();

    if (!login || !login.length) {
      return false;
    }

    for (const type of  loginTypes) {
      loginType.set(type, true);
    }

    if (
      loginType.has('email') &&
      login?.length > 2 &&
      this.pattern.email.test(login)
    ) {
      return {
        login,
        idType: 'email',
      };
    }

    login = login?.replace(/\D/g, '');

    if (
      loginType.has('phone') &&
      this.regExp['searchPhone'].test(login)
    ) {
      return {
        login: login
          ?.replace(this.regExp['searchPhone'], '$1$2$3')
          ?.replace(this.regExp['formatPhone'], '+7$1$2'),
        idType: 'phone',
      };
    } else {
      loginFormControl?.setErrors({ required: true });
      return false;
    }
  }
}
