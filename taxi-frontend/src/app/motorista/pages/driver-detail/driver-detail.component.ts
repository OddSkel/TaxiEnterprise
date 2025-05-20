import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Motorista } from 'src/app/core/models/motorista';
import { MotoristaService } from 'src/app/core/services/motorista.service';
import { Turno } from 'src/app/core/models/turno';
import { TurnoService } from 'src/app/core/services/turno.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent {
  motorista: Motorista | undefined;
  turnos: Turno[] = [];
  fieldErrors: { [key: string]: string } = {};
  valid: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService,
    private turnoService: TurnoService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMotorista();
  }

  getMotorista(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.motoristaService.getMotorista(id).subscribe((motorista) => {
        this.motorista = motorista;
        this.getTurnosDoMotorista(motorista._id);
      });
    }
  }

  getTurnosDoMotorista(motoristaId: string): void {
    this.turnoService.getAllShifts(motoristaId).subscribe({
      next: (turnos) => {
        const now = new Date();
        this.turnos = turnos
          .filter((turno) => new Date(turno.end) >= now)
          .map((turno) => ({
            ...turno,
            isAtivo: new Date(turno.start) <= now && new Date(turno.end) >= now
          }));
      },
      error: (err) => {
        console.error('Erro ao carregar turnos do motorista:', err);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  goToCreateShift(): void {
    this.router.navigate(['/motorista/motoristas', this.motorista?._id, 'newShift']);
  }

  goToAcceptRide(): void {
    this.router.navigate(['/motorista/motoristas', this.motorista?._id, 'acceptRide']);
  }

  goToRegisterRide(): void {
    this.router.navigate(['/motorista/motoristas', this.motorista?._id, 'newRide']);
  }
}
