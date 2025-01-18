import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let router: Router;
  let sessionService: SessionService;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  } 

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values when creating a new session', () => {
    const registerComponent = fixture.componentInstance;
    expect(registerComponent.sessionForm?.value).toEqual({
      name: '',
      date: '',
      teacher_id: '',
      description: ''
    });
  });
  
  it('should have form invalid when required fields are empty', () => {
    const registerComponent = fixture.componentInstance;
    registerComponent.sessionForm?.setValue({
      name: '',
      date: '',
      teacher_id: '',
      description: ''
    });
    expect(registerComponent.sessionForm?.valid).toBeFalsy();
  });

  it('should initialize form with default empty values when no session is provided', () => {
    const registerComponent = fixture.componentInstance;
    registerComponent['initForm']();
    expect(registerComponent.sessionForm?.value).toEqual({
      name: '',
      date: '',
      teacher_id: '',
      description: ''
    });
  });
  
  it('should initialize form with session values when a session is provided', () => {
    const registerComponent = fixture.componentInstance;
    const session = {
      id: 1,
      name: 'yoga',
      description: 'yoga',
      date: new Date,
      teacher_id: 1,
      users: [1],
      createdAt: new Date,
      updatedAt: new Date
    }
    registerComponent['initForm'](session);
    expect(registerComponent.sessionForm?.value).toEqual({
      name: session.name,
      date: '2025-01-18',
      teacher_id: session.teacher_id,
      description: session.description
    });
  });  
});
