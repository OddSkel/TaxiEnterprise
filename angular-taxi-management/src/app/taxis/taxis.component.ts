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
    _id: '',
    matricula: '',
    ano_compra: 0,
    marca: '',
    modelo: '',
    nivel_conforto: '',
    yearCriation: 0,
  };
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  formValid: boolean = false;

  constructor(private taxiService: TaxiService) {}

  ngOnInit(): void {
    this.getTaxis();
  }

  getTaxis(): void {
    this.taxiService.getTaxis().subscribe((taxis) => {
      this.taxis = taxis;
    });
  }

  add(): void {
    this.fieldErrors = {};
    if (
      !this.taxi.matricula ||
      !this.taxi.ano_compra ||
      !this.taxi.marca ||
      !this.taxi.modelo
    ) {
      return;
    }

    this.taxiService.addTaxi(this.taxi).subscribe({
      next: (taxi) => {
        this.taxis.push(taxi);
        this.getTaxis();
        this.clearForm();
        this.fieldErrors = {};
        this.errorMessage = '';
      },
      error: (error) => {
        this.fieldErrors = {};
        const err = error.error;
        if (err?.fieldErrors) {
          this.fieldErrors = err.fieldErrors;
        } else {
          this.errorMessage = err?.error || 'Something went wrong.';
        }
      },
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
      yearCriation: 0,
    };
    this.errorMessage = '';
    this.fieldErrors = {};
    this.formValid = false;
  }

  delete(taxi: Taxi): void {
    this.taxiService.deleteTaxi(taxi._id).subscribe({
      next: () => {
        this.taxis = this.taxis.filter((h) => h !== taxi);
      },
      error: (err) => {
        console.error('Failed to delete taxi:', err);
        this.errorMessage = 'Failed to delete taxi.';
      },
    });
  }

  validateMatricula() {
    const value = this.taxi.matricula || '';
    const letters = value.replace(/[^A-Z]/g, '').length;
    const numbers = value.replace(/[^0-9]/g, '').length;

    if (letters !== 4 || numbers !== 2) {
      this.fieldErrors['matricula'] =
        'Matricula must contain exactly 4 letters and 2 numbers.';
    } else {
      delete this.fieldErrors['matricula'];
    }

    this.checkFormValidity();
  }

  validateAnos() {
    if (this.taxi.ano_compra < this.taxi.yearCriation) {
      this.fieldErrors['ano_compra'] =
        'Taxi cannot be bought before it was created';
    } else {
      delete this.fieldErrors['ano_compra']; // Remove error if valid
    }
    this.checkFormValidity();
  }

  validateConforto() {
    if (
      this.taxi.nivel_conforto != 'BASICO' &&
      this.taxi.nivel_conforto != 'LUXUOSO'
    ) {
      this.fieldErrors['nivel_conforto'] = 'Taxi can only be BASICO or LUXUOSO';
    } else {
      delete this.fieldErrors['nivel_conforto'];
    }
    this.checkFormValidity();
  }
  validateMarca() {
    const marcas = [
      'BMW',
      'MERCEDES',
      'AUDI',
      'PORSCHE',
      'TOYOTA',
      'OPEL',
      'HYUNDAI',
    ];
    marcas.includes(this.taxi.marca)
      ? delete this.fieldErrors['marca']
      : (this.fieldErrors['marca'] =
          'Taxi can only have this marcas: ' + marcas);
    this.checkFormValidity();
  }
  validateModelo() {
    const modelos = [
      'M50',
      'AMG40',
      'R8',
      'PANAMERA',
      'COROLLA',
      'BLITZ',
      'I10',
    ];
    modelos.includes(this.taxi.modelo)
      ? delete this.fieldErrors['modelo']
      : (this.fieldErrors['modelo'] =
          'Taxi can only have this modelos: ' + modelos);
    this.checkFormValidity();
  }

  checkFormValidity() {
    const {
      matricula,
      ano_compra,
      marca,
      modelo,
      nivel_conforto,
      yearCriation,
    } = this.taxi;

    const allFieldsFilled =
      matricula &&
      ano_compra &&
      marca &&
      modelo &&
      nivel_conforto &&
      yearCriation;

    const noFieldErrors = Object.keys(this.fieldErrors).length === 0;

    this.formValid = !!allFieldsFilled && noFieldErrors;
  }
}
