import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalStandaloneComponent } from 'ngx-neo-ui';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, ModalStandaloneComponent],
  selector: 'nx-nutrition-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
}
