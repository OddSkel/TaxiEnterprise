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

  inicioNoite: number = 21;
  fimNoite: number = 6;
  incremento: number = 0;
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

    calculate(iH: number,iM: number,fH: number,fM: number,preco: number, acrescimo: number): void{
      if(iH < fH){
        if(iH < this.fimNoite && fH >= this.inicioNoite){
          this.precoFinal = ((this.inicioNoite - this.fimNoite)*60)*preco +
                            ((fH - this.inicioNoite)*60 + fM + (this.fimNoite-1-iH)*60 + (60-iM))*preco*acrescimo;
        } else if(iH<this.fimNoite && fH<this.inicioNoite){
          this.precoFinal = ((fH-this.fimNoite)*60+fM)*preco +
                            ((this.fimNoite-1-iH)*60+(60-iM))*preco*acrescimo;
        } else if(iH>=this.fimNoite && fH<this.inicioNoite){
          this.precoFinal = ((fH-1-iH)*60+fM+(60-iM))*preco;
        } else if(iH>=this.fimNoite && fH>=this.inicioNoite){
          this.precoFinal = ((fH-this.inicioNoite)*60+fM)*preco*acrescimo +
                            ((this.inicioNoite-1-iH)*60+(60-iM))*preco;
        } else {
          this.precoFinal = ((fH-1-iH)*60+fM+(60-iM))*preco*acrescimo;
        }
      } else if(iH>fH){
        if(iH<this.inicioNoite && fH>=this.fimNoite){
          this.precoFinal = ((24-this.inicioNoite)*60+this.fimNoite*60)*preco*acrescimo+
                            ((this.inicioNoite-1-iH)*60+(60-iM)+(fH-this.fimNoite)*60+fM)*preco;
        } else if(iH<this.inicioNoite && fH<this.fimNoite){
          this.precoFinal = ((24-this.inicioNoite)*60+fH*60+fM)*preco*acrescimo+
                            ((this.inicioNoite-1-iH)*60+(60-iM))*preco;
        } else if(iH>=this.inicioNoite && fH<this.fimNoite){
          this.precoFinal = ((24-1-iH)*60+(60-iM)+fH*60+fM)*preco*acrescimo;
        } else if(iH>=this.inicioNoite && fH>=this.fimNoite){
          this.precoFinal = ((24-1-iH)*60+(60-iM)+this.fimNoite*60+(fH-this.fimNoite)*60+fM)*preco*acrescimo;
        } else if(iH>this.inicioNoite && fH>=this.inicioNoite){
          this.precoFinal = ((24-1-iH)*60+(60-iM)+(fH-this.inicioNoite)*60+fM+this.fimNoite*60)*preco*acrescimo+
                            ((this.inicioNoite-this.fimNoite)*60)*preco;
        } else if(iH<this.fimNoite && fH<this.fimNoite){
          this.precoFinal = ((this.fimNoite-1-iH)*60+(60-iM)+(24-this.inicioNoite)*60+fH*60+fM)*preco*acrescimo+
                            ((this.inicioNoite-this.fimNoite)*60)*preco;
        }
      } else if(iH==fH){
        if(iM==fM){
          this.precoFinal = 0;
        } else if(iM<fM){
          if(iH>=this.fimNoite && iH<this.inicioNoite){
            this.precoFinal = (fM-iM)*preco;
          } else {
            (fM-iM)*preco*acrescimo;
          }
        } else {
          if(iH>=this.fimNoite && iH<this.inicioNoite){
            this.precoFinal = ((24-this.inicioNoite)*60+this.fimNoite*60)*preco*acrescimo+
                              ((this.inicioNoite-this.fimNoite)*60-(iM-fM))*preco;
          } else {
            this.precoFinal = ((24-this.inicioNoite)*60+this.fimNoite*60-(iM-fM))*preco*acrescimo+
                              ((this.inicioNoite-this.fimNoite)*60)*preco;
          }
        }
      }
    }

    goBack(): void {
      this.location.back();
    }

}
