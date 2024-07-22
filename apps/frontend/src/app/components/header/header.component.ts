import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ButtonStandaloneComponent, ModalService, NavigateListComponent } from 'ngx-neo-ui';
import { INavigateList } from 'ngx-neo-ui/lib/components/navigate-list/models/navigate';
import { UserService } from '../../services';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'nutrition-header',
  standalone: true,
  imports: [
    NavigateListComponent,
    ButtonStandaloneComponent,
    NgIf,
    AsyncPipe
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
      name: 'О нас',
      uri: 'about',
    },

    {
      name: 'Цены',
      uri: 'price',
    },

    {
      name: 'Акции',
      uri: 'action',
    },

    {
      name: 'Контакты',
      uri: 'contacts',
    },

  ]
  public auth$ = this.userService.isLoggedIn$;

  constructor(
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
