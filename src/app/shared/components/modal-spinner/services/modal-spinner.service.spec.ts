import { TestBed } from '@angular/core/testing';

import { ModalSpinnerService } from './modal-spinner.service';

describe('ModalSpinnerService', () => {
  let service: ModalSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
