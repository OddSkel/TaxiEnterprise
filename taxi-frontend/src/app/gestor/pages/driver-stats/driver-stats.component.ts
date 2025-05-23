import { Component } from '@angular/core';
import { Motorista } from 'src/app/core/models/motorista';
import { Viagem } from 'src/app/core/models/viagem';
import { ViagemService } from 'src/app/core/services/viagem.service';
import { MotoristaService } from 'src/app/core/services/motorista.service';
import { Router } from '@angular/router';

interface DriverStats {
  driverId: string;
  name: string;
  totalTrips: number;
  totalDistance: number;
  totalRevenue: number;
  totalHours: number;
}

@Component({
  selector: 'app-driver-stats',
  templateUrl: './driver-stats.component.html',
  styleUrls: ['./driver-stats.component.css'],
})
export class DriverStatsComponent {
  viagens: Viagem[] = [];
  drivers: Motorista[] = [];
  startDate: string = '';
  endDate: string = '';

  stats: DriverStats[] = [];

  // For validation messages
  validationMessage: string = '';
  showValidation: boolean = false;

  // For drill-down functionality
  driverTripsMap: { [key: string]: Viagem[] } = {};
  selectedDriverId: string | null = null;

  constructor(
    private viagemService: ViagemService,
    private motoristaService: MotoristaService,
    private router: Router
  ) {}

  mostrarmotoristaStats() {
    this.showValidation = false;
    this.validationMessage = '';
    this.selectedDriverId = null;
    this.driverTripsMap = {};

    this.motoristaService.getMotoristas().subscribe((drivers) => {
      this.drivers = drivers;

      this.viagemService.getViagens().subscribe((viagens) => {
        this.viagens = viagens;

        const now = new Date();

        const start = new Date(this.startDate);
        const end = new Date(this.endDate);

        const diffInMs = end.getTime() - start.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (start >= end) {
          this.validationMessage =
            'A data de início deve ser anterior à data de fim.';
          this.showValidation = true;
          return;
        }

        if (diffInHours > 8) {
          this.validationMessage =
            'O período de tempo não pode ser superior a 8 horas.';
          this.showValidation = true;
          return;
        }

        if (start > now) {
          this.validationMessage = 'Não pode selecionar datas futuras.';
          this.showValidation = true;
          return;
        }

        this.stats = this.drivers.map((driver) => {
          const filtered = this.viagens.filter(
            (v) =>
              v.motorista?._id === driver._id &&
              v.inicio &&
              v.fim &&
              new Date(v.inicio) >= start &&
              new Date(v.fim) <= end
          );

          // Store sorted trips for detail view
          this.driverTripsMap[driver._id] = filtered.sort(
            (a, b) =>
              new Date(b.inicio!).getTime() - new Date(a.inicio!).getTime()
          );

          const totalTrips = filtered.length;
          const totalDistance = filtered.reduce(
            (sum, v) => sum + (v.quilometros ?? 0),
            0
          );
          const totalRevenue = filtered.reduce(
            (sum, v) => sum + (v.custo_total ?? 0),
            0
          );
          const totalHours = filtered.reduce((sum, v) => {
            const inicio = new Date(v.inicio!);
            const fim = new Date(v.fim!);
            const durationHours =
              (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);
            return sum + durationHours;
          }, 0);

          return {
            driverId: driver._id,
            name: driver.pessoa.nome,
            totalHours,
            totalTrips,
            totalDistance,
            totalRevenue,
          };
        });
      });
    });
  }

  toggleDriverDetails(driverId: string) {
    this.selectedDriverId =
      this.selectedDriverId === driverId ? null : driverId;
  }

  goBack(): void {
    this.router.navigate(['/gestor/stats']);
  }
}
