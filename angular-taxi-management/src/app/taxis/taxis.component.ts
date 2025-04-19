import { Component, OnInit } from '@angular/core';

import { Taxi } from '../taxi';
import { TaxiService } from '../taxi.service';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  styleUrls: ['./taxis.component.css'],
})
export class TaxisComponent implements OnInit {
  taxi: Taxi[] = [];

  taxis: Taxi = {
    _id: '',
    matricula: '',
    marca: '',
    modelo: '',
    ano_compra: new Date().getFullYear(),
    nivel_conforto: '',
    createdAt: new Date().getFullYear(),
    motorista: {
      nome: '',
      idade: 0,
      cartaConducao: '',
    },
    cliente: {
      nome: '',
      telefone: '',
    },
  };

  constructor(private taxiService: TaxiService) {}

  ngOnInit(): void {
    this.getTaxis();
  }

  getTaxis(): void {
    this.taxiService.getTaxis().subscribe((taxis) => (this.taxi = taxis));
  }

  add(): void {
    const taxiToAdd: Taxi = { ...this.taxis };

    // Optional: additional validation before sending
    if (!taxiToAdd.matricula.trim() || !taxiToAdd.marca || !taxiToAdd.modelo) {
      return;
    }

    this.taxiService.addTaxi(taxiToAdd).subscribe((createdTaxi: Taxi) => {
      this.taxi = [createdTaxi, ...this.taxi]; // Add it at the top of the list
      this.taxis = {
        _id: '',
        matricula: '',
        marca: '',
        modelo: '',
        ano_compra: new Date().getFullYear(),
        nivel_conforto: '',
        motorista: {
          nome: '',
          idade: 0,
          cartaConducao: '',
        },
        cliente: {
          nome: '',
          telefone: '',
        },
        createdAt: new Date().getFullYear(),
      };
    });
  }

  delete(taxi: Taxi): void {
    this.taxi = this.taxi.filter((h) => h !== taxi);
    this.taxiService.deleteTaxi(taxi._id).subscribe();
  }
}
