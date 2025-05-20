import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRideComponent } from './register-ride.component';

describe('RegisterRideComponent', () => {
  let component: RegisterRideComponent;
  let fixture: ComponentFixture<RegisterRideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterRideComponent]
    });
    fixture = TestBed.createComponent(RegisterRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
