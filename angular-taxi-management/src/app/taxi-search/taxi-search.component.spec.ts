import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiSearchComponent } from './taxi-search.component';

describe('TaxiSearchComponent', () => {
  let component: TaxiSearchComponent;
  let fixture: ComponentFixture<TaxiSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxiSearchComponent]
    });
    fixture = TestBed.createComponent(TaxiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
