import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Taxi } from 'src/app/core/models/taxi';
import { TaxiService } from 'src/app/core/services/taxi.service';

@Component({
  selector: 'app-taxi-edit',
  templateUrl: './taxi-edit.component.html',
  styleUrls: ['./taxi-edit.component.css']
})
export class TaxiEditComponent implements OnInit {
  taxi: Taxi = {
    _id: '',
    matricula: '',
    ano_compra: 0,
    marca: '',
    modelo: '',
    nivel_conforto: '',
  };

  errorMessage = '';
  fieldErrors: any;
  valid: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private taxiService: TaxiService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getTaxi();
  }

  getTaxi(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taxiService.getTaxi(id).subscribe({
        next: (taxi) => this.taxi = taxi,
        error: (err) => this.errorMessage = 'Erro ao carregar táxi: ' + err.message
      });
    }
  }

  save(): void {
    if (!this.taxi._id) {
      this.errorMessage = 'ID do táxi inválido.';
      return;
    }
    if (!this.validate()) {
      this.errorMessage = 'Corrija os erros do formulário antes de salvar.';
      return;
    }
    this.taxiService.updateTaxi(this.taxi).subscribe({
      next: () => this.router.navigate(['/taxis', this.taxi._id]),
      error: (err) => this.errorMessage = 'Erro ao salvar: ' + err.message
    });
  }


  goBack(): void {
    this.location.back();
  }

  validate(): boolean {
    this.fieldErrors = {}; // Reset errors before validation
    this.validateMatricula();
    this.validateAnos();
    this.validateMarca();
    this.validateModelo();
    this.validateConforto();
    this.valid = Object.keys(this.fieldErrors).length === 0;
    // Check if there are any errors
    return this.valid;
  }

  validateMatricula() {
    const value = (this.taxi?.matricula && this.taxi.matricula) || '';
    const letters = value.replace(/[^A-Z]/g, '').length;
    const numbers = value.replace(/[^0-9]/g, '').length;

    if (letters !== 4 || numbers !== 2) {
      this.fieldErrors['matricula'] =
        'Matricula must contain exactly 4 letters and 2 numbers.';
    } else {
      delete this.fieldErrors['matricula'];
    }
  }

  validateAnos() {
    let current_Year = new Date().getFullYear();
    if (this.taxi?.ano_compra && this.taxi.ano_compra > current_Year) {
      this.fieldErrors['ano_compra'] =
        'Taxi cannot be bought before it was created';
    } else {
      delete this.fieldErrors['ano_compra']; // Remove error if valid
    }
  }

  validateConforto() {
    if (
      this.taxi?.nivel_conforto &&
      this.taxi.nivel_conforto != 'BASICO' &&
      this.taxi.nivel_conforto != 'LUXUOSO'
    ) {
      this.fieldErrors['nivel_conforto'] = 'Taxi can only be BASICO or LUXUOSO';
    } else {
      delete this.fieldErrors['nivel_conforto'];
    }
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
    this.taxi?.marca && marcas.includes(this.taxi.marca)
      ? delete this.fieldErrors['marca']
      : (this.fieldErrors['marca'] =
          'Taxi can only have this marcas: ' + marcas);
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
    this.taxi?.modelo && modelos.includes(this.taxi.modelo)
      ? delete this.fieldErrors['modelo']
      : (this.fieldErrors['modelo'] =
          'Taxi can only have this modelos: ' + modelos);
  }
}
