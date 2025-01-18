import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect, jest } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let sessionService: SessionService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn(),
  }

  const mockSnackBar = {
    open: jest.fn()
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }, {provide: MatSnackBar, useValue: mockSnackBar}],
    })
      .compileComponents();

    userService = TestBed.inject(UserService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user detail on init', () => {
    const meComponent = fixture.componentInstance;
    const user = {
      id: 1,
      email: 'test@test.com',
      lastName: 'test',
      firstName: 'test',
      admin: false,
      password: '123',
      createdAt: new Date,
    }

    let mockUserService = jest.spyOn(userService, 'getById').mockReturnValue(of(user));

    meComponent.ngOnInit();

    expect(mockUserService).toHaveBeenCalled();
  });

  it('should delete user and log out', () => {
    const meComponent = fixture.componentInstance;

    let mockUserService = jest.spyOn(userService, 'delete').mockReturnValue(of({}));
    let mockRouter = jest.spyOn(router, 'navigate').mockImplementation(async () => true);
    let logOutSpy = jest.spyOn(mockSessionService, 'logOut');
    let snackBarSpy = jest.spyOn(mockSnackBar, 'open');

    meComponent.delete();

    expect(mockUserService).toHaveBeenCalledWith('1');
    expect(snackBarSpy).toHaveBeenCalled();
    expect(logOutSpy).toHaveBeenCalled();
    expect(mockRouter).toHaveBeenLastCalledWith(['/']);
  });
});
