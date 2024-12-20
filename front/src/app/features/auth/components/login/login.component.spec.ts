import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login', () => {
    const loginComponent = fixture.componentInstance;
    loginComponent.form.controls['email'].setValue('yoga@studio.com');
    loginComponent.form.controls['password'].setValue('test!1234');

    expect(loginComponent.form.valid).toBeTruthy();
  });

  it('failed login without password', () => {
    const loginComponent = fixture.componentInstance;
    loginComponent.form.controls['email'].setValue('yoga@studio.com');

    expect(loginComponent.form.valid).toBeFalsy();
  });

  it('failed login without email', () => {
    const loginComponent = fixture.componentInstance;
    loginComponent.form.controls['password'].setValue('test!1234');

    expect(loginComponent.form.valid).toBeFalsy();
  });

  it('login with response', () => {
    const loginComponent = fixture.componentInstance;
    loginComponent.form.controls['email'].setValue('yoga@studio.com');
    loginComponent.form.controls['password'].setValue('test!1234');

    const session = {
      token: '123',
      type: 'string',
      id: 1,
      username: 'Test',
      firstName: 'Anna',
      lastName: 'Field',
      admin: false
    }

    let mockAuthService = jest.spyOn(authService, 'login').mockReturnValue(of (session));
    let mockRouter = jest.spyOn(router, 'navigate').mockImplementation(async() => true);

    loginComponent.submit();

    expect(mockAuthService).toHaveBeenCalled();
    expect(mockRouter).toHaveBeenLastCalledWith(['/sessions']);
  });
});