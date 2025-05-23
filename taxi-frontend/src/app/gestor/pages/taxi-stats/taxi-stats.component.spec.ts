import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiStatsComponent } from './taxi-stats.component';

describe('TaxiStatsComponent', () => {
  let component: TaxiStatsComponent;
  let fixture: ComponentFixture<TaxiStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxiStatsComponent]
    });
    fixture = TestBed.createComponent(TaxiStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
