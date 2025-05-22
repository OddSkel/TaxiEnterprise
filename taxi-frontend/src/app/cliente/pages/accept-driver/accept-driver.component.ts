import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Conforto } from 'src/app/core/models/conforto';
import { Viagem } from 'src/app/core/models/viagem';
import { ConfortoService } from 'src/app/core/services/conforto.service';
import { ViagemService } from 'src/app/core/services/viagem.service';

@Component({
  selector: 'app-accept-driver',
  templateUrl: './accept-driver.component.html',
  styleUrls: ['./accept-driver.component.css']
})
export class AcceptDriverComponent {
  viagemId!: string;
  proposta: any;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.viagemId = this.route.snapshot.paramMap.get('id')!;
    this.carregarProposta();
  }

  carregarProposta() {
    this.viagemService.getViagemById(this.viagemId).subscribe({
      next: (viagem) => {
        if (viagem?.motorista && viagem.taxi) {

          const distanciaViagem = calcularDistanciaViagem(
            viagem.origem.coordenadas?.latitude || 0,
            viagem.origem.coordenadas?.longitude || 0,
            viagem.destino.coordenadas?.latitude || 0, 
            viagem.destino.coordenadas?.longitude || 0
          );

          this.proposta = {
            motoristaNome: viagem.motorista.pessoa.nome,
            distanciaKm: viagem.distanciaKm,
            tempoEspera: viagem.tempoEstimado = calculateTime(viagem.distanciaKm ?? 0),
            custoEstimado: viagem.custoEstimado = calculateEstimatedPrice(distanciaViagem, viagem.taxi.nivel_conforto, viagem.tempoEstimado ?? 0),
            taxi: {
              marca: viagem.taxi.marca,
              modelo: viagem.taxi.modelo,
              matricula: viagem.taxi.matricula,
              conforto: viagem.taxi.nivel_conforto,
            }
          };
        }
      },
      error: () => {
        this.errorMessage = "Erro ao carregar dados da viagem.";
      }
    });
  }

}
function calculateTime(distancia: number): number {
  return Math.round(distancia * 4);
}

function calcularDistanciaViagem(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}

function calculateEstimatedPrice(distancia: number, conforto: string, tempoChegada: number ): number {
  const tempoViagem = calculateTime(distancia);
  const c : Conforto = ConfortoService.getConfortoByName(conforto);
  return calculate(tempoViagem, c.preco, c.acrescimo, tempoChegada);
  
}


function calculate(duracaoMinutos: number, preco: number, acrescimoP: number, tempoChegada: number): number {
  const acrescimo = 1 + (acrescimoP / 100);

  const noiteInicio = 21 * 60; // 21:00 em minutos
  const noiteFim = 6 * 60;     // 06:00 em minutos

  // Obter o minuto atual do dia
  const now = new Date();
  const minutoAtual = now.getHours() * 60 + now.getMinutes();

  // minuto inicial da viagem (agora + tempoChegada)
  let minutoInicioViagem = (minutoAtual + tempoChegada) % (24 * 60);

  let total = 0;

  for (let t = 0; t < duracaoMinutos; t++) {
    const minutoAbsoluto = (minutoInicioViagem + t) % (24 * 60);
    const isNoturno = minutoAbsoluto >= noiteInicio || minutoAbsoluto < noiteFim;
    total += preco * (isNoturno ? acrescimo : 1);
  }

  return parseFloat(total.toFixed(2));
}

