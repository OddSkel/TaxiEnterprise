import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxisListComponent } from './taxis-list.component';

describe('TaxisListComponent', () => {
  let component: TaxisListComponent;
  let fixture: ComponentFixture<TaxisListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxisListComponent]
    });
    fixture = TestBed.createComponent(TaxisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
