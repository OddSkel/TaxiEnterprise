import { Component, OnInit } from '@angular/core';
import { ViagemService } from '../viagem.service';
import { Viagem } from '../viagem';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Client } from '../cliente';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  novaViagem: Viagem = {} as Viagem;
  cliente: Client = {
    _id: '',
    pessoa: {
      _id: '',
      nome: '',
      nif: '',
      genero: ''
    }
  };
  origem: string = '';
  destino: string = '';
  conforto: string = '';
  numPessoas: number = 1;
  map: any;
  motoristaResposta: { motoristaId: string, viagemId: string } | null = null;
  viagemConfirmada: boolean = false;

  constructor(private viagemService: ViagemService, private http: HttpClient) {}

  ngOnInit() {
    setTimeout(() => {
      this.iniciarMapa();
    }, 0);

    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.origem = `${lat}, ${lon}`;
        this.novaViagem.origem = {
          _id: '',
          rua: '',
          numPorta: '',
          codigoPostal: '',
          localidade: '',
          coordenadas: { latitude: lat, longitude: lon }
        };
        this.map.setView([lat, lon], 13);
        L.marker([lat, lon]).addTo(this.map).bindPopup('Sua localização').openPopup();
      });
    } else {
      alert("Geolocalização não suportada pelo navegador.");
    }
  }

  iniciarMapa(): void {
    this.map = L.map('map').setView([38.7169, -9.1399], 13); // Lisboa como fallback
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
  const latLon = e.latlng;
  this.destino = `${latLon.lat}, ${latLon.lng}`;
  this.novaViagem.destino = {
    _id: '',
    rua: this.destino,
    numPorta: '',
    codigoPostal: '',
    localidade: '',
    coordenadas: {
      latitude: latLon.lat,
      longitude: latLon.lng
    }
  };
    this.marcarPontoNoMapa(latLon);
  });
  }

  marcarPontoNoMapa(latLon: any): void {
    L.marker([latLon.lat, latLon.lng]).addTo(this.map)
      .bindPopup("Destino")
      .openPopup();
  }

  pedirViagem(): void {
    if (!this.novaViagem.origem || !this.novaViagem.destino) {
      alert('Origem e destino são obrigatórios.');
      return;
    }

    const viagem: Viagem = {
      _id: '',
      cliente: this.cliente,
      origem: this.novaViagem.origem,
      destino: this.novaViagem.destino,
      conforto: this.conforto,
      num_pessoas: this.numPessoas,
      estado: 'PENDENTE',
      motorista: undefined,
      taxi: undefined,
      seq: 0,
      turno: undefined
    };

    this.viagemService.pedirViagem(viagem).subscribe({
      next: (res) => {
        console.log('Viagem pedida com sucesso!', res);
        alert('Viagem pedida com sucesso!');
        this.viagemConfirmada = false;
        this.motoristaResposta = null;
      },
      error: (err) => {
        console.error('Erro ao pedir viagem', err);
        alert('Erro ao pedir a viagem.');
      }
    });
  }

// Aceitar viagem
aceitarViagem(): void {
  if (this.motoristaResposta && this.motoristaResposta.viagemId && this.motoristaResposta.motoristaId) {
    this.viagemService.confirmarViagem(this.motoristaResposta.motoristaId, this.motoristaResposta.viagemId).subscribe({
      next: (viagem) => {
        console.log('Viagem confirmada!', viagem);
        this.viagemConfirmada = true;
        alert('Viagem confirmada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao confirmar viagem', err);
        alert('Erro ao confirmar a viagem. Tente novamente!');
      }
    });
  } else {
    console.error('Informações do motorista ou viagem ausentes!');
    alert('Erro: Informações do motorista ou viagem ausentes.');
  }
}

// Rejeitar viagem
rejeitarViagem(): void {
  if (this.motoristaResposta && this.motoristaResposta.viagemId && this.motoristaResposta.motoristaId) {
    this.viagemService.rejeitarViagem(this.motoristaResposta.motoristaId, this.motoristaResposta.viagemId).subscribe({
      next: () => {
        console.log('Viagem rejeitada');
        alert('Viagem rejeitada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao rejeitar viagem', err);
        alert('Erro ao rejeitar a viagem. Tente novamente!');
      }
    });
  } else {
    console.error('Informações do motorista ou viagem ausentes!');
    alert('Erro: Informações do motorista ou viagem ausentes.');
  }
}

// Método para tratar a resposta do motorista
receberRespostaMotorista(motorista: any): void {
  if (motorista && motorista.motoristaId && motorista.viagemId) {
    this.motoristaResposta = motorista;
    console.log('Resposta do motorista:', motorista);
  } else {
    console.error('Informações incompletas do motorista');
    alert('Erro: Informações incompletas do motorista.');
  }
}

}
