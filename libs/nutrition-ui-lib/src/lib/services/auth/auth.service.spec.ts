import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ApiService } from '@nx-nutrition/nutrition-ui-lib';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpHandler, HttpClient, ApiService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
