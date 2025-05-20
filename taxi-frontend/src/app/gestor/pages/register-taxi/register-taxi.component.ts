import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Taxi } from 'src/app/core/models/taxi';
import { TaxiService } from 'src/app/core/services/taxi.service';

@Component({
  selector: 'app-register-taxi',
  templateUrl: './register-taxi.component.html',
  styleUrls: ['./register-taxi.component.css']
})
export class RegisterTaxiComponent {
  taxi: Taxi = {
    _id: '',
    matricula: '',
    ano_compra: 0,
    marca: '',
    modelo: '',
    nivel_conforto: '',
  };
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  formValid: boolean = false;

  constructor(
    private taxiService: TaxiService,
    private location: Location
  ) {}

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
      next: () => {
        this.clearForm();
        this.location.back(); 
        this.fieldErrors = {};
        this.errorMessage = '';
      },
      error: (error) => {
        this.fieldErrors = {};
        const err = error.error;
        if (err?.fieldErrors) {
          this.fieldErrors = err.fieldErrors;
        } else {
          this.errorMessage = err?.error || 'Ocorreu um erro ao submeter o formulário.';
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
    };
    this.errorMessage = '';
    this.fieldErrors = {};
    this.formValid = false;
  }

  validateMatricula() {
    const value = this.taxi.matricula?.toUpperCase().trim() || '';

    // Expressões regulares para os 4 formatos permitidos
    const validFormats = [
      /^[A-Z]{2}-\d{2}-\d{2}$/, // AA-00-00
      /^\d{2}-\d{2}-[A-Z]{2}$/, // 00-00-AA
      /^\d{2}-[A-Z]{2}-\d{2}$/, // 00-AA-00
      /^[A-Z]{2}-\d{2}-[A-Z]{2}$/ // AA-00-AA
    ];

    const isValid = validFormats.some((regex) => regex.test(value));

    if (!isValid) {
      this.fieldErrors['matricula'] = 'Formato de matrícula inválido. Exemplos válidos: AA-00-00, 00-00-AA, 00-AA-00, AA-00-AA';
    } else {
      delete this.fieldErrors['matricula'];
    }

    this.checkFormValidity();
  }


  validateAnos() {
    let current_Year = new Date().getFullYear();
    if (this.taxi.ano_compra > current_Year) {
      this.fieldErrors['ano_compra'] = 'Taxi cannot be bought in the future';
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
    const { matricula, ano_compra, marca, modelo, nivel_conforto } = this.taxi;

    const allFieldsFilled =
      matricula && ano_compra && marca && modelo && nivel_conforto;

    const noFieldErrors = Object.keys(this.fieldErrors).length === 0;

    this.formValid = !!allFieldsFilled && noFieldErrors;
  }

  goBack() {
    this.location.back();
  }
}
