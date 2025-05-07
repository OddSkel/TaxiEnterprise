// motorista-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { Motorista } from '../motorista';

@Component({
  selector: 'app-motorista-detail',
  templateUrl: './motorista-detail.component.html',
  styleUrls: ['./motorista-detail.component.css'],
})
export class MotoristaDetailComponent implements OnInit {
  motorista: Motorista | undefined;
  nif: string = '';

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.motoristaService.getMotorista(id).subscribe((m) => {
      this.motorista = m;
    });
  }
}
