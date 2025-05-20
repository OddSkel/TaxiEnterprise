import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Conforto } from 'src/app/core/models/conforto';
import { ConfortoService } from 'src/app/core/services/conforto.service';

@Component({
  selector: 'app-confort-list',
  templateUrl: './confort-list.component.html',
  styleUrls: ['./confort-list.component.css']
})
export class ConfortListComponent {
  confortos: Conforto[] = [];

  constructor(
    private confortoService: ConfortoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getConforto();
  }

  getConforto(): void {
    this.confortoService.getConfortos().subscribe((confortos) => {
      this.confortos = confortos;
    });
  }

  goToEdit(id: string) {
    this.router.navigate(['/gestor/confortos', id, 'edit']);

  }

  goToSimulate(id: string) {
    this.router.navigate(['/gestor/confortos', id, 'simulate']);

  }
}
