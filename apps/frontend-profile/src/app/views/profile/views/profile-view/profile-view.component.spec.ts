import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewComponent } from './profile-view.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ApiService, UserService } from '@nx-nutrition/nutrition-ui-lib';

describe('ProfileViewComponent', () => {
  let component: ProfileViewComponent;
  let fixture: ComponentFixture<ProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpHandler,
        BrowserModule,
        HttpClient,
        ApiService,
        UserService,
      ],
      imports: [ProfileViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
