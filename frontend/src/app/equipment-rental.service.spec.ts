import { TestBed } from '@angular/core/testing';

import { EquipmentRentalService } from './equipment-rental.service';

describe('EquipmentRentalService', () => {
  let service: EquipmentRentalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentRentalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
