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

  constructor(
    private route: ActivatedRoute,
    private TaxiService: TaxiService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getTaxi();
  }

  getTaxi(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.TaxiService.getTaxi(id).subscribe((taxi) => (this.taxi = taxi));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.taxi) {
      this.TaxiService.updateTaxi(this.taxi).subscribe(() => this.goBack());
    }
  }
}
