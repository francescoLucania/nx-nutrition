import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ButtonStandaloneComponent, MediaQueriesService, ModalService, NavigateListComponent } from 'ngx-neo-ui';
import { INavigateList } from 'ngx-neo-ui/lib/components/navigate-list/models/navigate';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService, IconComponent, UserService } from '@nx-nutrition/nutrition-ui-lib';
import { ThrobberComponent } from '../throbber/throbber.component';

@Component({
  selector: 'nutrition-header',
  standalone: true,
  imports: [
    NavigateListComponent,
    ButtonStandaloneComponent,
    NgIf,
    AsyncPipe,
    RouterLink,
    ThrobberComponent,
    IconComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  public mainMenu: INavigateList[] = [
    {
      name: 'Услуги',
      uri: 'services',
    },

    {
      name: 'Цены',
      uri: 'price',
    },

    {
      name: 'Отзывы',
      uri: 'action',
    },
    //
    // {
    //   name: 'Контакты',
    //   uri: 'contacts',
    // },

  ]
  private user$ = this.userService.userProfileData$;

  public user = toSignal(
    this.user$,
    {
      manualCleanup: true,
      requireSync: true
    }
  );

  private isDesktop$ = this.mqService.deviceType$;

  public isDesktop = toSignal(
    this.isDesktop$,
    {
      manualCleanup: true,
      requireSync: true
    }
  );

  constructor(
    private mqService: MediaQueriesService,
    private authService: AuthService,
    private userService: UserService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
    ) {
  }

  public login(): void {
    this.cdr.detectChanges();
    this.modalService.open(
      LoginModalComponent
    )
  }
}
