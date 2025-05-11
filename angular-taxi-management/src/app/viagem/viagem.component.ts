import { Component, OnInit } from '@angular/core';
import { ViagemService } from '../viagem.service';
import { Viagem } from '../viagem';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viagem',
  templateUrl: './viagem.component.html',
  styleUrls: ['./viagem.component.css']
})
export class ViagemComponent implements OnInit {
  viagensPendentes: Viagem[] = [];
  motoristaId!: string;

  constructor(
    private viagemService: ViagemService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.motoristaId = this.route.snapshot.paramMap.get('motoristaId') || '';
    this.getViagensPendentes();
  }

  getViagensPendentes(): void {
    this.viagemService.getViagensPendentes(this.motoristaId).subscribe(viagens => {
      this.viagensPendentes = viagens;
    });
  }

  aceitarViagem(viagemId: string): void {
    this.viagemService.aceitarViagem(this.motoristaId, viagemId).subscribe(res => {
      // Atualizar lista depois de aceitar
      this.getViagensPendentes();
    });
  }
}
