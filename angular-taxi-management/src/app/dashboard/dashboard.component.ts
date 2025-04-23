import { Component, OnInit } from '@angular/core';

import { Taxi } from '../taxi';
import { TaxiService } from '../taxi.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  taxis: Taxi[] = [];

  constructor(private TaxiService: TaxiService) {}

  ngOnInit(): void {
    this.getTaxis();
  }

  getTaxis(): void {
    this.TaxiService.getTaxis().subscribe(
      (taxis) => (this.taxis = taxis.slice(1, 5))
    );
  }
}
