import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimularComponent } from './simular.component';

describe('SimularComponent', () => {
  let component: SimularComponent;
  let fixture: ComponentFixture<SimularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimularComponent]
    });
    fixture = TestBed.createComponent(SimularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
