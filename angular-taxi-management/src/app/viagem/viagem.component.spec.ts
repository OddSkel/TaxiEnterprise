import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViagemComponent } from './viagem.component';

describe('ViagemComponent', () => {
  let component: ViagemComponent;
  let fixture: ComponentFixture<ViagemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViagemComponent]
    });
    fixture = TestBed.createComponent(ViagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
