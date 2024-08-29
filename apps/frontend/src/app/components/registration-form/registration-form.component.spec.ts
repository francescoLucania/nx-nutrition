import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationFormComponent } from './registration-form.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ApiService, UserService } from '@nx-nutrition/nutrition-ui-lib';
import { BrowserModule } from '@angular/platform-browser';

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpHandler,
        BrowserModule,
        HttpClient,
        ApiService,
        UserService,
      ],
      imports: [RegistrationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
