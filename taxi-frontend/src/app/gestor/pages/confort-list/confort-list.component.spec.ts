import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfortListComponent } from './confort-list.component';

describe('ConfortListComponent', () => {
  let component: ConfortListComponent;
  let fixture: ComponentFixture<ConfortListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfortListComponent]
    });
    fixture = TestBed.createComponent(ConfortListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
