import { Component } from '@angular/core';
import { ViagemService } from '../viagem.service';
import { Viagem } from '../viagem';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-motorista-viagens',
  templateUrl: './motorista-viagens.component.html',
  styleUrls: ['./motorista-viagens.component.css'],
})
export class MotoristaViagensComponent {
  viagem: Viagem | null = null;
  viagens: Viagem[] = [];
  viagensPendentes: Viagem[] = [];

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getViagens();
      this.getViagensPendentes();
    }
  }

  iniciarViagem(viagem: Viagem) {
    console.log('iniciarViagem triggered!');
    if (!viagem) {
      console.log('here');
      return;
    }

    const clienteId = viagem.cliente._id;
    const numCompanions = viagem.num_pessoas ?? 1;
    const turnoId = viagem.turno?._id;
    console.log(clienteId);
    console.log(turnoId);

    if (!clienteId || !turnoId) {
      alert('Dados incompletos para iniciar a viagem.');
      return;
    }
    console.log('PAssou!');
    const body = {
      turnoId,
      clienteId,
      numCompanions,
    };
    console.log('body ', body);

    this.viagemService.inicioViagem(viagem._id, body).subscribe({
      next: (updatedViagem) => {
        // Update local reference
        Object.assign(viagem, updatedViagem);

        // Remove from pendentes
        this.viagensPendentes = this.viagensPendentes.filter(
          (v) => v._id !== viagem._id
        );

        // Add to main viagens array
        this.viagens.push(viagem);
        this.sortViagens(this.viagens);
      },
      error: (err) => console.error(err),
    });
  }

  terminarViagem(viagem: Viagem) {
    if (!viagem) return;
    this.viagemService.fimViagem(viagem._id).subscribe({
      next: (updatedViagem) => {
        Object.assign(viagem, updatedViagem);
      },
      error: (err) => console.error(err),
    });
  }

  sortViagens(viagens: Viagem[]) {
    viagens.sort(
      (a, b) => new Date(b.inicio!).getTime() - new Date(a.inicio!).getTime()
    );
  }

  getViagens() {
    const motoristaId = this.route.snapshot.paramMap.get('id');
    if (!motoristaId) return;
    this.viagemService.getViagensByMotorista(motoristaId).subscribe({
      next: (data) => {
        this.viagens = data;
        this.sortViagens(this.viagens);
      },
      error: (err) => console.error('Erro ao carregar viagens:', err),
    });
  }
  getViagensPendentes() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.viagemService.getViagensPendentes(id).subscribe({
      next: (data) => {
        this.viagensPendentes = data;
        this.sortViagens(this.viagensPendentes);
      },
      error: (err) => console.error('Erro ao carregar viagem:', err),
    });
  }
}
