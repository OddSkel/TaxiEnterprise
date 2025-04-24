import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfortoDetailsComponent } from './conforto-details.component';

describe('ConfortoDetailsComponent', () => {
  let component: ConfortoDetailsComponent;
  let fixture: ComponentFixture<ConfortoDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfortoDetailsComponent]
    });
    fixture = TestBed.createComponent(ConfortoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
