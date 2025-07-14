/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DropdownManagerService } from './dropdown-manager.service';

describe('Service: DropdownManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropdownManagerService]
    });
  });

  it('should ...', inject([DropdownManagerService], (service: DropdownManagerService) => {
    expect(service).toBeTruthy();
  }));
});
