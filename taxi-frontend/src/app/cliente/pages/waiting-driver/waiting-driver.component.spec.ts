import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingDriverComponent } from './waiting-driver.component';

describe('WaitingDriverComponent', () => {
  let component: WaitingDriverComponent;
  let fixture: ComponentFixture<WaitingDriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingDriverComponent]
    });
    fixture = TestBed.createComponent(WaitingDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
