import { Component, OnInit } from '@angular/core';

import { Taxi } from '../taxi';
import { TaxiService } from '../taxi.service';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  styleUrls: ['./taxis.component.css'],
})
export class TaxisComponent implements OnInit {
  taxis: Taxi[] = [];
  taxi: Taxi = {
    _id: '', // MongoDB will generate _id
    matricula: '',
    ano_compra: 0,
    marca: '',
    modelo: '',
    nivel_conforto: '',
    motorista: '', // Assuming motorista and cliente are strings (IDs)
    cliente: '',
    createdAt: 0,
  };

  constructor(private taxiService: TaxiService) {}

  ngOnInit(): void {
    this.getTaxis();
  }

  getTaxis(): void {
    this.taxiService.getTaxis().subscribe((taxis) => {
      this.taxis = taxis.sort((a, b) => b.createdAt - a.createdAt);
    });
  }

  add(): void {
    if (
      !this.taxi.matricula ||
      !this.taxi.ano_compra ||
      !this.taxi.marca ||
      !this.taxi.modelo
    ) {
      return; // Optional validation: check if required fields are provided
    }

    // Add taxi to the backend
    this.taxiService.addTaxi(this.taxi).subscribe((taxi) => {
      this.taxis.push(taxi); // Add new taxi to the list
      this.clearForm(); // Clear the form fields after successful addition
    });
  }

  clearForm(): void {
    this.taxi = {
      _id: '',
      matricula: '',
      ano_compra: 0,
      marca: '',
      modelo: '',
      nivel_conforto: '',
      motorista: '',
      cliente: '',
      createdAt: 0,
    };
  }

  delete(taxi: Taxi): void {
    this.taxis = this.taxis.filter((h) => h !== taxi);
    this.taxiService.deleteTaxi(taxi._id).subscribe();
  }
}
