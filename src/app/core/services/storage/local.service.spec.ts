import { async, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { LocalService } from './local.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environments/environment';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LocalService', () => {
  let injector: TestBed;
  let service: LocalService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [LocalService],
    }).compileComponents();
    injector = getTestBed();
    service = injector.get(LocalService);
    httpMock = injector.get(HttpTestingController);
  }));

  it('setLocalStorageItem', () => {
    environment.production = false;
    service.setLocalStorageItem('test', 'XXX');
  });

  it('setLocalStorageItem PRO', () => {
    environment.production = true;
    service.setLocalStorageItem('test', 'XXX');
  });

  it('getLocalStorageItem', () => {
    environment.production = false;
    service.getLocalStorageItem('test');
  });

  it('getLocalStorageItem PRO', () => {
    environment.production = true;
    service.getLocalStorageItem('jwt');
  });

  it('clearLocalStorage', () => {
    service.clearLocalStorage();
  });
});
