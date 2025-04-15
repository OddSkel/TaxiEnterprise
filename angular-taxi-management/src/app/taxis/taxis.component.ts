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

  constructor(private taxiService: TaxiService) {}

  ngOnInit(): void {
    this.getTaxis();
  }

  getTaxis(): void {
    this.taxiService.getTaxis().subscribe((taxis) => (this.taxis = taxis));
  }

  add(matricula: string): void {
    matricula = matricula.trim();
    if (!matricula) {
      return;
    }
    this.taxiService.addTaxi({ matricula } as Taxi).subscribe((taxi) => {
      this.taxis.push(taxi);
    });
  }

  delete(taxi: Taxi): void {
    this.taxis = this.taxis.filter((h) => h !== taxi);
    this.taxiService.deleteTaxi(taxi.id).subscribe();
  }
}
