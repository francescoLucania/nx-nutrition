import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { BrowserService } from 'ngx-neo-ui';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ApiService } from '@nx-nutrition/nutrition-ui-lib';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [BrowserService, HttpHandler, HttpClient, ApiService],
      imports: [RegistrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
