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
  filtroNif: string = ''; // Campo para o NIF

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
        this.motoristas = motoristas;
      },
      error: (err) => {
        console.error('Erro ao carregar motoristas', err);
        this.errorMessage = 'Erro ao carregar motoristas';
      }
    });
  }

  pesquisarPorNif(): void {
    const nifLimpo = this.filtroNif.trim();

    if (!nifLimpo) {
      this.errorMessage = '';
      this.getMotoristas();
      return;
    }

    if (!/^\d{9}$/.test(nifLimpo)) {
      this.errorMessage = 'O NIF deve conter exatamente 9 dígitos numéricos.';
      return;
    }

    this.motoristaService.getMotoristaByNIF(nifLimpo).subscribe({
      next: (motorista) => {
        if (!motorista) {
          this.errorMessage = 'Motorista com o NIF fornecido não foi encontrado.';
        } else {
          this.errorMessage = '';
          this.router.navigate(['/motorista/motoristas', motorista._id]);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar motorista por NIF', err);
        this.errorMessage = 'Erro ao buscar motorista por NIF.';
      }
    });
  }
}

