import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Conforto } from 'src/app/core/models/conforto';
import { ConfortoService } from 'src/app/core/services/conforto.service';

@Component({
  selector: 'app-confort-edit',
  templateUrl: './confort-edit.component.html',
  styleUrls: ['./confort-edit.component.css']
})
export class ConfortEditComponent {
  conforto?:Conforto;
  errorMessage: string = '';
  valid: boolean = false;
  fieldErrors: any;

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

  save(): void {
    if (!this.conforto) {
      this.errorMessage = 'Conforto inválido.';
      return;
    }
    this.confortoService.updateConforto(this.conforto).subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
