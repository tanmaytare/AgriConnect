import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborHiringComponent } from './labor-hiring.component';

describe('LaborHiringComponent', () => {
  let component: LaborHiringComponent;
  let fixture: ComponentFixture<LaborHiringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaborHiringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaborHiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
