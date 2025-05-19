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

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService
  ) {}

  ngOnInit(): void {
    console.log('MotoristaViagensComponent initialized');
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route param ID:', id);
    if (id) {
      this.viagemService.getViagensPendentes(id).subscribe({
        next: (data) => {
          console.log('Viagens pendentes:', data);
          this.viagem = data[0] ?? null;
        },
        error: (err) => console.error('Erro ao carregar viagem:', err),
      });
    }
  }

  iniciarViagem() {
    if (!this.viagem) return;
    const body = {
      motoristaId: this.viagem.motorista,
      turnoId: this.viagem.turno,
      taxiId: this.viagem.taxi,
      clienteId: this.viagem.cliente,
      numCompanions: this.viagem.num_pessoas ?? 1,
    };
    this.viagemService.inicioViagem(this.viagem._id, body).subscribe({
      next: (v) => {
        alert('Viagem iniciada!');
        this.viagem!.estado = v.estado;
      },
      error: (err) => console.error('Erro ao iniciar viagem:', err),
    });
  }

  terminarViagem() {
    if (!this.viagem) return;
    this.viagemService.fimViagem(this.viagem._id).subscribe({
      next: (v) => {
        alert('Viagem concluída!');
        this.viagem!.estado = v.estado;
      },
      error: (err) => console.error('Erro ao terminar viagem:', err),
    });
  }
}
