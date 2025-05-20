import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateRideComponent } from './simulate-ride.component';

describe('SimulateRideComponent', () => {
  let component: SimulateRideComponent;
  let fixture: ComponentFixture<SimulateRideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimulateRideComponent]
    });
    fixture = TestBed.createComponent(SimulateRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
