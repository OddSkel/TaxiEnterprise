import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfortEditComponent } from './confort-edit.component';

describe('ConfortEditComponent', () => {
  let component: ConfortEditComponent;
  let fixture: ComponentFixture<ConfortEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfortEditComponent]
    });
    fixture = TestBed.createComponent(ConfortEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
