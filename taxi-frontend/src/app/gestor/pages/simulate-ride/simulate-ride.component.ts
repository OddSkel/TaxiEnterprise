import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Conforto } from 'src/app/core/models/conforto';
import { ConfortoService } from 'src/app/core/services/conforto.service';

@Component({
  selector: 'app-simulate-ride',
  templateUrl: './simulate-ride.component.html',
  styleUrls: ['./simulate-ride.component.css']
})
export class SimulateRideComponent {
  conforto?:Conforto;
  precoFinal: number = 0;

  constructor(
    private confortoService: ConfortoService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getConforto();
  }

  getConforto(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if(id) {
      this.confortoService.getConforto(id).subscribe((conforto) => (this.conforto = conforto));
    }
  }

  calculate(iH: number, iM: number, fH: number, fM: number, preco: number, acrescimoP: number): void {
    const inicioViagem = iH * 60 + iM;
    let fimViagem = fH * 60 + fM;
    const acrescimo = 1 + (acrescimoP / 100);
  
    if (fimViagem <= inicioViagem) {
      fimViagem += 24 * 60;
    }
  
    const noiteInicio = 21 * 60;
    const noiteFim = 6 * 60;
  
    let total = 0;
  
    for (let t = inicioViagem; t < fimViagem; t++) {
      const minutoAbsoluto = t % (24 * 60);
      const isNoturno = (minutoAbsoluto >= noiteInicio || minutoAbsoluto < noiteFim);
      total += preco * (isNoturno ? acrescimo : 1);
    }
  
    this.precoFinal = parseFloat(total.toFixed(2)); 
  }

  goBack(): void {
    this.location.back();
  }
}
