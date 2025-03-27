import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentRentalComponent } from './equipment-rental.component';

describe('EquipmentRentalComponent', () => {
  let component: EquipmentRentalComponent;
  let fixture: ComponentFixture<EquipmentRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
