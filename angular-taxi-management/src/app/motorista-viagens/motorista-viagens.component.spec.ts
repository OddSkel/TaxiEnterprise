import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaViagensComponent } from './motorista-viagens.component';

describe('MotoristaViagensComponent', () => {
  let component: MotoristaViagensComponent;
  let fixture: ComponentFixture<MotoristaViagensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotoristaViagensComponent]
    });
    fixture = TestBed.createComponent(MotoristaViagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
