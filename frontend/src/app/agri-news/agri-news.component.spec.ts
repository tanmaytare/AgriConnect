import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriNewsComponent } from './agri-news.component';

describe('AgriNewsComponent', () => {
  let component: AgriNewsComponent;
  let fixture: ComponentFixture<AgriNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgriNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgriNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
