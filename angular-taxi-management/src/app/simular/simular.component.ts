import { Component, Input } from '@angular/core';
import { Conforto } from '../conforto';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ConfortoService } from '../conforto.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-simular',
  templateUrl: './simular.component.html',
  styleUrls: ['./simular.component.css']
})
export class SimularComponent {

  precoFinal: number = 0;

  @Input() conforto?: Conforto;

  constructor(
      private route: ActivatedRoute,
      private confortoService: ConfortoService,
      private location: Location,
      private messageService: MessageService,
    ) {}

    ngOnInit(): void {
      this.getDetails();
    }

    getDetails(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if(id === null){
  
        return;
      }
      this.confortoService.getConforto(id)
        .subscribe(conforto => {this.conforto = conforto})
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
