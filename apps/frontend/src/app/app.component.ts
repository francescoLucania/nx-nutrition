import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ModalStandaloneComponent } from 'ngx-neo-ui';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, ModalStandaloneComponent],
  selector: 'nutrition-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public title = 'frontend';
}
