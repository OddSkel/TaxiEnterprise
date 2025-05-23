import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Viagem } from 'src/app/core/models/viagem';
import { ViagemService } from 'src/app/core/services/viagem.service';

@Component({
  selector: 'app-register-ride',
  templateUrl: './register-ride.component.html',
  styleUrls: ['./register-ride.component.css'],
})
export class RegisterRideComponent {
  viagem: Viagem | null = null;
  viagensAceites: Viagem[] = [];
  viagensAtivas: Viagem[] = [];
  viagensConcluidas: Viagem[] = [];

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const motoristaId = this.route.snapshot.paramMap.get('id');
    if (motoristaId) {
      setInterval(() => {
        this.getViagens(motoristaId);
      }, 500);
    }
  }

  getViagens(motoristaId: string) {
    this.viagemService.getViagensByMotorista(motoristaId).subscribe({
      next: (viagens) => {
        console.log(viagens);
        this.categorizarViagens(viagens);
      },
      error: (err) => console.error('Erro ao carregar viagens:', err),
    });
  }

  categorizarViagens(viagens: Viagem[]) {
    this.viagensAceites = viagens.filter((v) => v.estado === 'aceite');
    console.log(this.viagensAceites);

    this.viagensAtivas = viagens.filter(
      (v) => v.estado === 'confirmada' || v.estado === 'iniciada'
    );
    console.log(this.viagensAtivas);

    this.viagensConcluidas = viagens.filter((v) => v.estado === 'concluida');
    console.log(this.viagensConcluidas);

    this.sortViagens(this.viagensAceites);
    this.sortViagens(this.viagensAtivas);
    this.sortViagens(this.viagensConcluidas);
  }

  iniciarViagem(viagem: Viagem) {
    if (!viagem) return;

    const clienteId = viagem.cliente._id;
    const numCompanions = viagem.num_pessoas;
    const turnoId = viagem.turno?._id;

    if (!clienteId || !turnoId) {
      alert('Dados incompletos para iniciar a viagem.');
      return;
    }

    const body = {
      turnoId,
      clienteId,
      numCompanions,
    };

    this.viagemService.inicioViagem(viagem._id, body).subscribe({
      next: (updatedViagem) => {
        Object.assign(viagem, updatedViagem);
        this.getViagens(this.route.snapshot.paramMap.get('id')!);
      },
      error: (err) => console.error(err),
    });
  }

  terminarViagem(viagem: Viagem) {
    if (!viagem) return;

    this.viagemService.fimViagem(viagem._id).subscribe({
      next: (updatedViagem) => {
        Object.assign(viagem, updatedViagem);
        this.getViagens(this.route.snapshot.paramMap.get('id')!);
      },
      error: (err) => console.error(err),
    });
  }

  sortViagens(viagens: Viagem[]) {
    viagens.sort(
      (a, b) => new Date(b.inicio!).getTime() - new Date(a.inicio!).getTime()
    );
  }

  goBack() {
    this.location.back();
  }
}
