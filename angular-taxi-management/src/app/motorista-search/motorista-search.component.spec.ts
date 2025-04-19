import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaSearchComponent } from './motorista-search.component';

describe('MotoristaSearchComponent', () => {
  let component: MotoristaSearchComponent;
  let fixture: ComponentFixture<MotoristaSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotoristaSearchComponent]
    });
    fixture = TestBed.createComponent(MotoristaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
