import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Motorista } from 'src/app/core/models/motorista';
import { MotoristaService } from 'src/app/core/services/motorista.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent {
  motorista: Motorista | undefined;
  fieldErrors: { [key: string]: string } = {};
  valid: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMotorista();
  }

  getMotorista(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if(id) {
      this.motoristaService.getMotorista(id).subscribe((motorista) => (this.motorista = motorista));
    }
  }

  goBack(): void {
    this.location.back();
  }

  goToEditMotorista(): void {
    this.router.navigate(['/gestor/motoristas', this.motorista?._id, 'edit']);
  }
}
