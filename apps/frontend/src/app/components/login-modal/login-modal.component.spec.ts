import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginModalComponent } from './login-modal.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ApiService, UserService } from '@nx-nutrition/nutrition-ui-lib';
import { BrowserModule } from '@angular/platform-browser';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpHandler,
        BrowserModule,
        HttpClient,
        ApiService,
        UserService,
      ],
      imports: [LoginModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
