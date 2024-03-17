import { TestBed } from '@angular/core/testing';

import { InputsUtilsService } from './inputs-utils.service';

describe('InputsUtilsService', () => {
  let service: InputsUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputsUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
