import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfortoComponent } from './conforto.component';

describe('ConfortoComponent', () => {
  let component: ConfortoComponent;
  let fixture: ComponentFixture<ConfortoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfortoComponent]
    });
    fixture = TestBed.createComponent(ConfortoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
