import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../services';
import { takeUntil } from 'rxjs';
import { BrowserService, DestroyService, ModalService } from 'ngx-neo-ui';
import { RegistrationBody } from '@nx-nutrition-models';
import { Router } from '@angular/router';
import { ThrobberComponent } from '../throbber/throbber.component';
import { NgTemplateOutlet } from '@angular/common';

type RegistrationForm = Record<keyof RegistrationBody, FormControl<string>>

@Component({
  selector: 'nutrition-registration-form',
  standalone: true,
  imports: [
    ThrobberComponent,
    NgTemplateOutlet
  ],
  providers: [
    DestroyService
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationFormComponent implements OnInit {

  public isBrowser = false;

  public state: WritableSignal<
    'processing' |
    'registration-form' |
    'password-form' |
    'complete-view'
  > = signal('registration-form');
  // public form: FormGroup<RegistrationForm>;

  constructor(
    private userService: UserService,
    private browserService: BrowserService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private modalService: ModalService,
    private router: Router,
  ) {
  }

  public ngOnInit(): void {
    // this.modalService.close();
    this.initState();
  }

  private initState(): void {
    this.isBrowser = this.browserService.isBrowser;
    this.userService.isLoggedIn$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        switch (value) {
          case 'processing':
            this.state.set('processing');
            break;
          case 'not':
            this.state.set('registration-form');
            break;
          case 'done':
            this.router.navigate(['']);
            this.modalService.close();
            break;
        }
        this.cdr.detectChanges()
      })
  }
}
