import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Viagem } from 'src/app/core/models/viagem';

import { ViagemService } from 'src/app/core/services/viagem.service';

@Component({
  selector: 'app-waiting-driver',
  templateUrl: './waiting-driver.component.html',
  styleUrls: ['./waiting-driver.component.css']
})
export class WaitingDriverComponent implements OnInit, OnDestroy{
  viagemId!: string | null;
  estado!: string;
  sub!: Subscription;
  viagem: Viagem | null = null;

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.viagemId = this.route.snapshot.paramMap.get('id');
    if (!this.viagemId) {
      console.error("ID da viagem ausente na rota.");
      return;
    }

    this.sub = interval(5000).pipe(
      switchMap(() => this.viagemService.getViagemById(this.viagemId!))
    ).subscribe(viagem => {
      this.viagem = viagem;
      if (!viagem) {
        console.warn("Viagem não encontrada.");
        return;
      }

      this.estado = viagem.estado;
      console.log("Estado atual da viagem:", this.estado);

      if (viagem.estado === 'aceite') {
        console.log("Viagem aceite!");
        this.router.navigate(['/cliente/cliente', this.viagemId, 'answer-driver']);
      }

      if (viagem.estado === 'concluída') {
        console.log("Viagem concluída!");
        this.router.navigate(['/cliente/cliente']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  cancelarViagem() {
    this.viagemService.cancelarViagem(this.viagem?.cliente?._id || '', this.viagemId!).subscribe(() => {
      this.router.navigate(['/cliente/cliente']);
    });
  }
}
