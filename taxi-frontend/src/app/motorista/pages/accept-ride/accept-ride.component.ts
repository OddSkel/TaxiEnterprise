import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Viagem } from 'src/app/core/models/viagem';
import { ViagemService } from 'src/app/core/services/viagem.service';

interface Coordenadas {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-accept-ride',
  templateUrl: './accept-ride.component.html',
  styleUrls: ['./accept-ride.component.css']
})
export class AcceptRideComponent {
  viagensPendentes: Viagem[] = [];
  motoristaId: string = '';
  posicaoAtual: Coordenadas | null = null;

  // Coordenadas da FCUL (fallback)
  readonly FCUL_COORDS: Coordenadas = { latitude: 38.756734, longitude: -9.155412 };

  constructor(
    private viagensService: ViagemService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.motoristaId = this.route.snapshot.paramMap.get('id') || '';
    this.obterLocalizacaoAtual();
  }

  obterLocalizacaoAtual(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.posicaoAtual = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.getViagensPendentes();
      },
      (error) => {
        console.warn('Geolocalização indisponível. Usando coordenadas da FCUL.');
        this.posicaoAtual = this.FCUL_COORDS;
        this.getViagensPendentes();
      }
    );
  }

  getViagensPendentes(): void {
    if (!this.motoristaId) return;

    const { latitude, longitude } = this.posicaoAtual ?? this.FCUL_COORDS;

    this.viagensService.getViagensPendentes(this.motoristaId, latitude, longitude).subscribe((viagens) => {
      console.log('Viagens recebidas:', viagens);
      this.viagensPendentes = viagens
        .map(viagem => {
          if (viagem.origem?.coordenadas) {
            viagem.distanciaCliente = this.calcularDistanciaKm(
              latitude,
              longitude,
              viagem.origem.coordenadas.latitude,
              viagem.origem.coordenadas.longitude
            );
          }
          return viagem;
        })
        .sort((a, b) => (a.distanciaCliente || Infinity) - (b.distanciaCliente || Infinity));
    });
  }

  aceitarViagem(viagem: Viagem): void {
    if (!this.motoristaId || !viagem._id) return;

    this.viagensService.aceitarViagem(this.motoristaId, viagem._id, viagem.distanciaCliente || 0).subscribe({
      next: () => {
        console.log('Viagem aceita com sucesso.', viagem);
        this.getViagensPendentes();
        this.router.navigate([`/motorista/motoristas/${this.motoristaId}/registeredRides`]);        
      },
      error: (err) => console.error('Erro ao aceitar viagem:', err)
    });
  }

  calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(2);
  }

  toRad(value: number): number {
    return value * Math.PI / 180;
  }

  goBack(): void {
    this.location.back();
  }
}
