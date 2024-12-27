import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();
    
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('register', () => {
    const registerComponent = fixture.componentInstance;
    registerComponent.form.controls['email'].setValue('test@test.com');
    registerComponent.form.controls['firstName'].setValue('Anna');
    registerComponent.form.controls['lastName'].setValue('Field');
    registerComponent.form.controls['password'].setValue('Anna123');

    expect(registerComponent.form.valid).toBeTruthy();
  });

  it('failed register without email', () => {
    const registerComponent = fixture.componentInstance;
    registerComponent.form.controls['firstName'].setValue('Anna');
    registerComponent.form.controls['lastName'].setValue('Field');
    registerComponent.form.controls['password'].setValue('Anna123');

    expect(registerComponent.form.valid).toBeFalsy();
  });

  it('failed register without first name', () => {
    const registerComponent = fixture.componentInstance;
    registerComponent.form.controls['email'].setValue('test@test.com');
    registerComponent.form.controls['lastName'].setValue('Field');
    registerComponent.form.controls['password'].setValue('Anna123');

    expect(registerComponent.form.valid).toBeFalsy();
  });

  it('failed register without last name', () => {
    const registerComponent = fixture.componentInstance;
    registerComponent.form.controls['email'].setValue('test@test.com');
    registerComponent.form.controls['firstName'].setValue('Anna');
    registerComponent.form.controls['password'].setValue('Anna123');

    expect(registerComponent.form.valid).toBeFalsy();
  });

  it('failed register without password', () => {
    const registerComponent = fixture.componentInstance;
    registerComponent.form.controls['email'].setValue('test@test.com');
    registerComponent.form.controls['firstName'].setValue('Anna');
    registerComponent.form.controls['lastName'].setValue('Field');

    expect(registerComponent.form.valid).toBeFalsy();
  });

  it('register with response', () => {
    const registerComponent = fixture.componentInstance;
    registerComponent.form.controls['email'].setValue('test@test.com');
    registerComponent.form.controls['firstName'].setValue('Anna');
    registerComponent.form.controls['lastName'].setValue('Field');
    registerComponent.form.controls['password'].setValue('Anna123');

    let mockAuthService = jest.spyOn(authService, 'register').mockImplementation(() => of(undefined));
    let mockRouter = jest.spyOn(router, 'navigate').mockImplementation(async() => true);

    registerComponent.submit();

    expect(mockAuthService).toHaveBeenCalled();
    expect(mockRouter).toHaveBeenLastCalledWith(['/login']);
  });
});
