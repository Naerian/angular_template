import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@environments/environment';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [JwtService],
    });
    service = TestBed.inject(JwtService);
    service.jwtHelperService = new JwtHelperService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setUserToken', () => {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQRVMtU2FudGlsbGFuYSIsImlhdCI6MTYxNTk4NjA2NSwiZXhwIjoxNjE5MTAyNjE0LCJwZXNfYXV0aG9yaXphdGlvbiI6eyJ1c2VyX2lkIjoiVVNFUkpST0NLRVQiLCJlbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obm55Iiwic3VybmFtZSI6IlJvY2tldCIsImJpcnRoX2RhdGUiOiIyNS8wNS8xOTkwIiwidXNlcl9yb2xfc2VsZWN0ZWQiOiIyIiwiY2VudGVycyI6W3siY29kZSI6IjEyIiwibmFtZSI6ImNlbnRlcl8xIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMSIsImRlZmF1bHQiOnRydWV9LHsiY29kZSI6IjI0IiwibmFtZSI6ImNlbnRlcl8yIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMiIsImRlZmF1bHQiOmZhbHNlfV0sInJvbGVzIjpbeyJpZCI6MywiaW50ZXJmYWNlIjoiVGVhY2hlciIsImFjdGl2ZSI6dHJ1ZX0seyJpZCI6MiwiaW50ZXJmYWNlIjoiU3R1ZGVudCIsImFjdGl2ZSI6dHJ1ZX1dLCJhdXRob3JpemF0aW9ucyI6W3sibW9kdWxlX2lkIjoyLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjMsInBlcm1pc3Npb24iOnRydWV9LHsibW9kdWxlX2lkIjozLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjQsInBlcm1pc3Npb24iOnRydWV9XX0sImp0aSI6IjU4ZmQxNWY2LWI1YTAtNDcxMC1hNjRjLTNlODJmNTJmMGMyMiJ9.tWCOPbxOmTkjppARfSYDl6Nslu8_H4KrfYemhmnUulc';
    service.setUserToken(token);
  });

  it('getUserToken', () => {
    localStorage.setItem(
      environment.TOKEN_STORAGE_KEY,
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQRVMtU2FudGlsbGFuYSIsImlhdCI6MTYxNTk4NjA2NSwiZXhwIjoxNjE5MTAyNjE0LCJwZXNfYXV0aG9yaXphdGlvbiI6eyJ1c2VyX2lkIjoiVVNFUkpST0NLRVQiLCJlbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obm55Iiwic3VybmFtZSI6IlJvY2tldCIsImJpcnRoX2RhdGUiOiIyNS8wNS8xOTkwIiwidXNlcl9yb2xfc2VsZWN0ZWQiOiIyIiwiY2VudGVycyI6W3siY29kZSI6IjEyIiwibmFtZSI6ImNlbnRlcl8xIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMSIsImRlZmF1bHQiOnRydWV9LHsiY29kZSI6IjI0IiwibmFtZSI6ImNlbnRlcl8yIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMiIsImRlZmF1bHQiOmZhbHNlfV0sInJvbGVzIjpbeyJpZCI6MywiaW50ZXJmYWNlIjoiVGVhY2hlciIsImFjdGl2ZSI6dHJ1ZX0seyJpZCI6MiwiaW50ZXJmYWNlIjoiU3R1ZGVudCIsImFjdGl2ZSI6dHJ1ZX1dLCJhdXRob3JpemF0aW9ucyI6W3sibW9kdWxlX2lkIjoyLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjMsInBlcm1pc3Npb24iOnRydWV9LHsibW9kdWxlX2lkIjozLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjQsInBlcm1pc3Npb24iOnRydWV9XX0sImp0aSI6IjU4ZmQxNWY2LWI1YTAtNDcxMC1hNjRjLTNlODJmNTJmMGMyMiJ9.tWCOPbxOmTkjppARfSYDl6Nslu8_H4KrfYemhmnUulc'
    );
    service.getUserToken();
  });

  it('getUserToken without token', () => {
    localStorage.clear();
    service.getUserToken();
  });

  it('getUserToken without token', () => {
    localStorage.clear();
    service.getUserToken();
  });

  it('getTokenExpirationDate', () => {
    service.getTokenExpirationDate(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQRVMtU2FudGlsbGFuYSIsImlhdCI6MTYxNTk4NjA2NSwiZXhwIjoxNjE5MTAyNjE0LCJwZXNfYXV0aG9yaXphdGlvbiI6eyJ1c2VyX2lkIjoiVVNFUkpST0NLRVQiLCJlbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obm55Iiwic3VybmFtZSI6IlJvY2tldCIsImJpcnRoX2RhdGUiOiIyNS8wNS8xOTkwIiwidXNlcl9yb2xfc2VsZWN0ZWQiOiIyIiwiY2VudGVycyI6W3siY29kZSI6IjEyIiwibmFtZSI6ImNlbnRlcl8xIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMSIsImRlZmF1bHQiOnRydWV9LHsiY29kZSI6IjI0IiwibmFtZSI6ImNlbnRlcl8yIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMiIsImRlZmF1bHQiOmZhbHNlfV0sInJvbGVzIjpbeyJpZCI6MywiaW50ZXJmYWNlIjoiVGVhY2hlciIsImFjdGl2ZSI6dHJ1ZX0seyJpZCI6MiwiaW50ZXJmYWNlIjoiU3R1ZGVudCIsImFjdGl2ZSI6dHJ1ZX1dLCJhdXRob3JpemF0aW9ucyI6W3sibW9kdWxlX2lkIjoyLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjMsInBlcm1pc3Npb24iOnRydWV9LHsibW9kdWxlX2lkIjozLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjQsInBlcm1pc3Npb24iOnRydWV9XX0sImp0aSI6IjU4ZmQxNWY2LWI1YTAtNDcxMC1hNjRjLTNlODJmNTJmMGMyMiJ9.tWCOPbxOmTkjppARfSYDl6Nslu8_H4KrfYemhmnUulc'
    );
  });

  it('isTokenExpired', () => {
    service.isTokenExpired(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQRVMtU2FudGlsbGFuYSIsImlhdCI6MTYxNTk4NjA2NSwiZXhwIjoxNjE5MTAyNjE0LCJwZXNfYXV0aG9yaXphdGlvbiI6eyJ1c2VyX2lkIjoiVVNFUkpST0NLRVQiLCJlbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obm55Iiwic3VybmFtZSI6IlJvY2tldCIsImJpcnRoX2RhdGUiOiIyNS8wNS8xOTkwIiwidXNlcl9yb2xfc2VsZWN0ZWQiOiIyIiwiY2VudGVycyI6W3siY29kZSI6IjEyIiwibmFtZSI6ImNlbnRlcl8xIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMSIsImRlZmF1bHQiOnRydWV9LHsiY29kZSI6IjI0IiwibmFtZSI6ImNlbnRlcl8yIiwiZGVzY3JpcHRpb24iOiJjZW50ZXJfZGVzY3JpcHRpb25fMiIsImRlZmF1bHQiOmZhbHNlfV0sInJvbGVzIjpbeyJpZCI6MywiaW50ZXJmYWNlIjoiVGVhY2hlciIsImFjdGl2ZSI6dHJ1ZX0seyJpZCI6MiwiaW50ZXJmYWNlIjoiU3R1ZGVudCIsImFjdGl2ZSI6dHJ1ZX1dLCJhdXRob3JpemF0aW9ucyI6W3sibW9kdWxlX2lkIjoyLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjMsInBlcm1pc3Npb24iOnRydWV9LHsibW9kdWxlX2lkIjozLCJwZXJtaXNzaW9uIjpmYWxzZX0seyJtb2R1bGVfaWQiOjQsInBlcm1pc3Npb24iOnRydWV9XX0sImp0aSI6IjU4ZmQxNWY2LWI1YTAtNDcxMC1hNjRjLTNlODJmNTJmMGMyMiJ9.tWCOPbxOmTkjppARfSYDl6Nslu8_H4KrfYemhmnUulc'
    );
  });

  it('isTokenExpired without token', () => {
    localStorage.clear();
    service.isTokenExpired();
  });
});
