import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Conforto } from 'src/app/core/models/conforto';
import { Viagem } from 'src/app/core/models/viagem';
import { ConfortoService } from 'src/app/core/services/conforto.service';
import { MotoristaService } from 'src/app/core/services/motorista.service';
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
  viagem: Viagem | null = null;
  

  constructor(
    private confortoService: ConfortoService,
    private motoristaService: MotoristaService,
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.viagemId = this.route.snapshot.paramMap.get('id')!;
    this.carregarProposta();
  }

  carregarProposta() {
    console.log("ID da viagem:", this.viagemId);
    this.viagemService.getViagemById(this.viagemId).subscribe({
      next: (viagem) => {
        if (!viagem) {
          this.errorMessage = "A viagem não foi encontrada.";
          return;
        }
        console.log("Viagem:", viagem);
        this.viagem = viagem;

          const distanciaViagem = calcularDistanciaViagem(
            viagem.origem.coordenadas?.latitude || 0,
            viagem.origem.coordenadas?.longitude || 0,
            viagem.destino.coordenadas?.latitude || 0, 
            viagem.destino.coordenadas?.longitude || 0
          );
          const tempoViagem = calculateTime(distanciaViagem);

          console.log("Tempo Viagem:", tempoViagem);

          this.confortoService.getConfortoByName(viagem.taxi!.nivel_conforto).subscribe({
            next: (c: Conforto) => {
              const tempoEstimado = calculateTime(viagem.distanciaCliente || 0);
              const custo = calculate(tempoViagem, c.preco, c.acrescimo, tempoEstimado);
              viagem.tempoEstimado = tempoEstimado
              viagem.custoEstimado = custo;
            
              this.motoristaService.getMotorista(viagem.motorista?._id || '').subscribe({
                next: (motorista) => {
                  viagem.motorista = motorista;
                  
                  this.proposta = {
                    motorista: viagem.motorista!.pessoa.nome,
                    distanciaKm: this.viagem?.distanciaCliente,
                    tempoEspera: viagem.tempoEstimado,
                    custoEstimado: viagem.custoEstimado,
                    taxi: {
                      marca: viagem.taxi?.marca,
                      modelo: viagem.taxi?.modelo,
                      matricula: viagem.taxi?.matricula,
                      conforto: viagem.taxi?.nivel_conforto,
                    }
                  };

                  console.log("Proposta:", this.proposta);
                },
                error: () => {
                  this.errorMessage = "Erro ao obter dados do motorista.";
                }
              });

              
            },
            error: () => {
              this.errorMessage = "Erro ao obter dados de conforto.";
            }
        });
      },
      error: () => {
        this.errorMessage = "Erro ao carregar dados da viagem.";
      }
    });
  }


  aceitar() {
    this.viagemService.confirmarViagem(this.viagem?.cliente?._id || '', this.viagemId).subscribe({
      next: () => {
        this.router.navigate(['/cliente/cliente', this.viagemId, 'waiting']);
      },
      error: () => {
        this.errorMessage = "Erro ao aceitar viagem.";
      }
    });
  }

  rejeitar() {
    this.viagemService.rejeitarViagem(this.viagem?.cliente?._id || '', this.viagemId).subscribe({
      next: () => {
        this.router.navigate(['/cliente/cliente', this.viagemId, 'waiting']);
      },
      error: () => {
        this.errorMessage = "Erro ao rejeitar viagem.";
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

function calculate(duracaoMinutos: number, preco: number, acrescimoP: number, tempoChegadaMotorista: number): number {
  const acrescimo = 1 + (acrescimoP / 100);

  const noiteInicio = 21 * 60; // 21:00 em minutos
  const noiteFim = 6 * 60;     // 06:00 em minutos

  // Obter o minuto atual do dia
  const now = new Date();
  const minutoAtual = now.getHours() * 60 + now.getMinutes();

  // minuto inicial da viagem (agora + tempoChegada)
  let minutoInicioViagem = (minutoAtual + tempoChegadaMotorista) % (24 * 60);

  let total = 0;

  for (let t = 0; t < duracaoMinutos; t++) {
    const minutoAbsoluto = (minutoInicioViagem + t) % (24 * 60);
    const isNoturno = minutoAbsoluto >= noiteInicio || minutoAbsoluto < noiteFim;
    total += preco * (isNoturno ? acrescimo : 1);
  }

  return parseFloat(total.toFixed(2));
}

