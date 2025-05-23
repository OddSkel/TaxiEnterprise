import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Motorista } from 'src/app/core/models/motorista';
import { Turno } from 'src/app/core/models/turno';
import { MotoristaService } from 'src/app/core/services/motorista.service';
import { TurnoService } from 'src/app/core/services/turno.service';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.css']
})
export class DriversListComponent {
  motoristas: Motorista[] = [];
  errorMessage: string = '';
  turnos: Turno[] = [];

  constructor(
    private motoristaService: MotoristaService,
    private turnoService: TurnoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMotoristas();
  }

  getMotoristas(): void {
    this.motoristaService.getMotoristas().subscribe({
      next: (motoristas) => {
        this.motoristas = motoristas
      },
      error: (err) => {
        console.error('Erro ao carregar motoristas', err),
        this.errorMessage = 'Erro ao carregar motoristas';
      }
    });
  }

delete(motorista: Motorista): void {
  if (!motorista._id) {
    this.errorMessage = 'ID do motorista inválido.';
    return;
  }

  this.errorMessage = '';

  this.turnoService.getAllShifts(motorista._id).subscribe({
    next: (turnos) => {
      const now = new Date();
      this.turnos = turnos.filter(turno => new Date(turno.end) >= now);

      if (this.turnos.length > 0) {
        this.errorMessage = 'Motorista ainda tem turnos.';
        return;
      }

      this.motoristaService.deleteMotorista(motorista._id).subscribe({
        next: () => {
          this.motoristas = this.motoristas.filter(h => h !== motorista);
        },
        error: (err) => {
          console.error('Failed to delete motorista:', err);
          this.errorMessage = 'Falha ao remover motorista.';
        }
      });
    },
    error: (err) => {
      console.error('Erro ao buscar turnos:', err);
      this.errorMessage = 'Erro ao verificar turnos do motorista.';
    }
  });
}


  goToCreateMotorista(): void {
    this.router.navigate(['/gestor/motoristas', 'add']);
  }
}
