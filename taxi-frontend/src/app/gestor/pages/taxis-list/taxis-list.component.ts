import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Taxi } from 'src/app/core/models/taxi';
import { Turno } from 'src/app/core/models/turno';
import { TaxiService } from 'src/app/core/services/taxi.service';
import { TurnoService } from 'src/app/core/services/turno.service';

@Component({
  selector: 'app-taxis-list',
  templateUrl: './taxis-list.component.html',
  styleUrls: ['./taxis-list.component.css']
})
export class TaxisListComponent {
  taxis: Taxi[] = [];
  errorMessage: string = '';
  turnos: Turno[] = [];
  
  constructor(
    private taxiService: TaxiService,
    private turnoService: TurnoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTaxis();
  }

  getTaxis(): void {
    this.taxiService.getTaxis().subscribe({
      next: (taxis: Taxi[]) => {
        this.taxis = taxis;
      },
      error: (err) => {
        console.error('Failed to fetch taxis:', err);
        this.errorMessage = 'Failed to load taxis.';
      }
    });
  }

  delete(taxi: Taxi): void {
    if (!taxi._id) {
      this.errorMessage = 'ID do taxi inválido.';
      return;
    }

    this.errorMessage = '';

    this.turnoService.getAllTaxiShifts(taxi._id).subscribe({
      next: (turnos) => {
        const now = new Date();
        this.turnos = turnos.filter(turno => new Date(turno.end) >= now);

        if (this.turnos.length > 0) {
          this.errorMessage = 'Taxi ainda tem turnos.';
          return;
        }

        this.taxiService.deleteTaxi(taxi._id).subscribe({
          next: () => {
            this.taxis = this.taxis.filter((h) => h !== taxi);
          },
          error: (err) => {
            console.error('Failed to delete taxi:', err);
            this.errorMessage = 'Failed to delete taxi.';
          },
        });
      },
      error: (err) => {
        console.error('Erro ao buscar turnos:', err);
        this.errorMessage = 'Erro ao verificar turnos do taxi.';
      }
    });
  }

  goToCreateTaxi(): void {
    this.router.navigate(['/gestor/taxis', 'add']);
  }
}
