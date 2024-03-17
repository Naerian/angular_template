import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LoginAuthUserEntity, AuthUserEntity } from '@entities/auth.entity';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtService } from '@services/jwt/jwt.service';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
class MockJwtService extends JwtService {
  override getToken() {
    return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQRVMtU2FudGlsbGFuYSIsImlhdCI6MTYxNTk4NjA2NSwiZXhwIjoxNjE5MTAyNjE0LCJwZXNfYXV0aG9yaXphdGlvbiI6eyJ1c2VyX2lkIjoiVVNFUkpST0NLRVQiLCJlbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obm55Iiwic3VybmFtZSI6IlJvY2tldCIsImJpcnRoX2RhdGUiOiIyNS8wNS8xOTkwIiwidXNlcl9yb2xfc2VsZWN0ZWQiOiIyIiwiY2VudGVycyI6W3siY29kZSI6IjEyIiwibmFtZSI6ImNlbnRlcl8xIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMSIsImRlZmF1bHQiOnRydWV9LHsiY29kZSI6IjI0IiwibmFtZSI6ImNlbnRlcl8yIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMiIsImRlZmF1bHQiOmZhbHNlfV0sInJvbGVzIjpbeyJpZCI6MywiaW50ZXJmYWNlIjoiVGVhY2hlciIsImFjdGl2ZSI6dHJ1ZX0seyJpZCI6MiwiaW50ZXJmYWNlIjoiU3R1ZGVudCIsImFjdGl2ZSI6dHJ1ZX1dLCJhdXRob3JpemF0aW9ucyI6W3sibW9kdWxlX2lkIjoyLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjMsInBlcm1pc3Npb24iOnRydWV9LHsibW9kdWxlX2lkIjozLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjQsInBlcm1pc3Npb24iOnRydWV9XX0sImp0aSI6IjU4ZmQxNWY2LWI1YTAtNDcxMC1hNjRjLTNlODJmNTJmMGMyMiJ9.tWCOPbxOmTkjppARfSYDl6Nslu8_H4KrfYemhmnUulc";
  }

  override getUserToken() {
    return {
      "id": "test.alumno",
      "email": "test@neoris.com",
      "name": "test",
      "surname": "test",
      "default_language": 1,
      "user_role_selected": 1,
      "roles": [
        {
          "id": 1,
          "interface": "Student",
          "active": true,
        }
      ],
    } as AuthUserEntity
  }
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        MatDialogModule,
        BrowserAnimationsModule,
        OverlayModule
      ],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useClass: MockJwtService
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('checkAuthUser', () => {
    service.checkAuthUser();
  });

  it('clearLogin', () => {
    service.clearLogin();
  });

  it('logout', () => {
    service.logout();
  });

  it('getUser', () => {
    service.getUserDataFromToken();
  });

  it('setIsAuthenticated true', () => {
    service.clearLogin();
    service.setIsAuthenticated(true);
    expect(service.isUserAuthenticated()).toBeTrue();
  });

  it('setIsAuthenticated false', () => {
    service.clearLogin();
    service.setIsAuthenticated(false);
    expect(service.isUserAuthenticated()).toBeFalse();

  });

  it('getAuthUser', () => {
    service.getAuthUser();
  });

});
