import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Taxi } from 'src/app/core/models/taxi';
import { TaxiService } from 'src/app/core/services/taxi.service';

@Component({
  selector: 'app-taxi-detail',
  templateUrl: './taxi-detail.component.html',
  styleUrls: ['./taxi-detail.component.css']
})
export class TaxiDetailComponent {
  taxi: Taxi | undefined;
  fieldErrors: { [key: string]: string } = {};
  valid: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private TaxiService: TaxiService,
    private location: Location,
    private router: Router
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
    this.router.navigate(['/gestor/taxis']);
  }

  goToEditTaxi(): void {
    if (!this.taxi) return;
    this.router.navigate(['/gestor/taxis', this.taxi._id, 'edit']);
  }

}
