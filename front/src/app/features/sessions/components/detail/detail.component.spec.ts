import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let service: SessionService;
  let sessionApiService: SessionApiService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent], 
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    })
      .compileComponents();
      service = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService)
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fecth session', () => {
    const detailComponent = fixture.componentInstance;
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

    const mockSessionApiService = jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(session));

    detailComponent.ngOnInit();

    expect(mockSessionApiService).toHaveBeenCalled();
  });

  it('should participate', () => {
    const detailComponent = fixture.componentInstance;

    const mockSessionApiService = jest.spyOn(sessionApiService, 'participate').mockImplementation(() => of(undefined)); 

    detailComponent.participate();

    expect(mockSessionApiService).toHaveBeenCalled();
  });

  it('should unParticipate', () => {
    const detailComponent = fixture.componentInstance;

    const mockSessionApiService = jest.spyOn(sessionApiService, 'unParticipate').mockImplementation(() => of(undefined)); 

    detailComponent.unParticipate();

    expect(mockSessionApiService).toHaveBeenCalled();
  });
});

