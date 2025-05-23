import { Component } from '@angular/core';
import { Taxi } from 'src/app/core/models/taxi';
import { Viagem } from 'src/app/core/models/viagem';
import { ViagemService } from 'src/app/core/services/viagem.service';
import { TaxiService } from 'src/app/core/services/taxi.service';
import { Router } from '@angular/router';

interface TaxiStats {
  taxiId: string;
  matricula: string;
  totalTrips: number;
  totalDistance: number;
  totalRevenue: number;
  totalHours: number;
}

@Component({
  selector: 'app-taxi-stats',
  templateUrl: './taxi-stats.component.html',
  styleUrls: ['./taxi-stats.component.css'],
})
export class TaxiStatsComponent {
  viagens: Viagem[] = [];
  taxis: Taxi[] = [];
  startDate: string = '';
  endDate: string = '';

  stats: TaxiStats[] = [];

  // For validation messages
  validationMessage: string = '';
  showValidation: boolean = false;

  // For drill-down functionality
  taxiTripsMap: { [key: string]: Viagem[] } = {};
  selectedTaxiId: string | null = null;

  constructor(
    private viagemService: ViagemService,
    private taxiService: TaxiService,
    private router: Router
  ) {}

  ngOnInit() {
    const today = new Date();

    // Set startDate to today at 00:00
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setHours(start.getHours() + 1);

    // Set endDate to today at 08:00
    const end = new Date(today);
    end.setHours(23, 59, 0, 0);
    end.setHours(end.getHours() + 1);

    this.startDate = start.toISOString().slice(0, 16);
    this.endDate = end.toISOString().slice(0, 16);
  }

  mostrartaxiStats() {
    this.showValidation = false;
    this.validationMessage = '';
    this.selectedTaxiId = null;
    this.taxiTripsMap = {};

    this.taxiService.getTaxis().subscribe((taxis) => {
      this.taxis = taxis;

      this.viagemService.getViagens().subscribe((viagens) => {
        this.viagens = viagens;

        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const now = new Date();

        if (start >= end) {
          this.validationMessage =
            'A data de início deve ser anterior à data de fim.';
          this.showValidation = true;
          return;
        }

        if (start > now) {
          this.validationMessage = 'Não pode selecionar datas futuras.';
          this.showValidation = true;
          return;
        }

        this.stats = this.taxis.map((taxi) => {
          const filtered = this.viagens.filter(
            (v) =>
              v.taxi?._id === taxi._id &&
              v.inicio &&
              v.fim &&
              new Date(v.inicio) >= start &&
              new Date(v.fim) <= end
          );

          // Store sorted trips for detail view
          this.taxiTripsMap[taxi._id] = filtered.sort(
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
            taxiId: taxi._id,
            matricula: taxi.matricula,
            totalHours,
            totalTrips,
            totalDistance,
            totalRevenue,
          };
        });
      });
    });
  }

  toggleTaxiDetails(taxiId: string) {
    this.selectedTaxiId = this.selectedTaxiId === taxiId ? null : taxiId;
  }

  goBack() {
    this.router.navigate(['/gestor/stats']);
  }
}
