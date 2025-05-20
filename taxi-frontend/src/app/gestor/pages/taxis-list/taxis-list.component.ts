import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Taxi } from 'src/app/core/models/taxi';
import { TaxiService } from 'src/app/core/services/taxi.service';

@Component({
  selector: 'app-taxis-list',
  templateUrl: './taxis-list.component.html',
  styleUrls: ['./taxis-list.component.css']
})
export class TaxisListComponent {
  taxis: Taxi[] = [];
  errorMessage: string = '';

  
  constructor(
    private taxiService: TaxiService,
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

  goToCreateTaxi(): void {
    this.router.navigate(['/gestor/taxis', 'add']);
  }
}
