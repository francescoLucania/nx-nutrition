import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '@nx-nutrition/nutrition-ui-lib';

@Component({
  selector: 'nutrition-profile-view',
  standalone: true,
  imports: [],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileViewComponent {
  public user$ = this.userService.userProfileData$;

  public user = toSignal(this.user$, {
    manualCleanup: true,
    requireSync: true,
  });

  constructor(private userService: UserService) {}
}
