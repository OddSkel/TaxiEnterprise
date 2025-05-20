import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Motorista } from 'src/app/core/models/motorista';
import { MotoristaService } from 'src/app/core/services/motorista.service';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.css']
})
export class DriversListComponent {
  motoristas: Motorista[] = [];
  errorMessage: string = '';

  constructor(
    private motoristaService: MotoristaService,
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
    this.motoristaService.deleteMotorista(motorista._id).subscribe({
      next: () => {
        this.motoristas = this.motoristas.filter((h) => h !== motorista);
      },
      error: (err) => {
        console.error('Failed to delete motorista:', err);
        this.errorMessage = 'Failed to delete motorista.';
      },
    });
  }

  goToCreateMotorista(): void {
    this.router.navigate(['/gestor/motoristas', 'add']);
  }
}
