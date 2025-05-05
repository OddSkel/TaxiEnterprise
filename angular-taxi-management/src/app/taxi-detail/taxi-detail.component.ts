import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Taxi } from '../taxi';
import { TaxiService } from '../taxi.service';

@Component({
  selector: 'app-taxi-detail',
  templateUrl: './taxi-detail.component.html',
  styleUrls: ['./taxi-detail.component.css'],
})
export class TaxiDetailComponent implements OnInit {
  taxi: Taxi | undefined;
  fieldErrors: { [key: string]: string } = {};
  vallid: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private TaxiService: TaxiService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getTaxi();
  }

  getTaxi(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.TaxiService.getTaxi(id).subscribe((taxi) => (this.taxi = taxi));
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.taxi && this.validate()) {
      this.TaxiService.updateTaxi(this.taxi).subscribe(() => this.goBack());
    }
  }

  validate(): boolean {
    this.fieldErrors = {}; // Reset errors before validation
    this.validateMatricula();
    this.validateAnos();
    this.validateMarca();
    this.validateModelo();
    this.validateConforto();
    this.vallid = Object.keys(this.fieldErrors).length === 0;
    // Check if there are any errors
    return this.vallid;
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
