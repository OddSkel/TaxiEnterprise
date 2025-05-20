import { Component, OnInit } from '@angular/core';
import { ViagemService } from '../viagem.service';
import { Viagem } from '../viagem';
import * as L from 'leaflet';
import { Client } from '../cliente';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  cliente: Client = {
    pessoa: { nome: '', nif: '', genero: '', _id: '' },
    _id: '',
  };

  novaViagem: Viagem = {
    cliente: this.cliente,
    origem: {
      _id: '',
      rua: '',
      numPorta: '',
      codigoPostal: '',
      localidade: '',
      coordenadas: { latitude: 0, longitude: 0 },
    },
    destino: {
      _id: '',
      rua: '',
      numPorta: '',
      codigoPostal: '',
      localidade: '',
      coordenadas: { latitude: 0, longitude: 0 },
    },
    conforto: '',
    num_pessoas: 1,
    _id: '',
    motorista: undefined,
    taxi: undefined,
    estado: '',
    seq: undefined,
    turno: undefined,
    custo_total: 0,
    quilometros: 0,
    inicio: new Date(),
    fim: new Date(),
  };

  origem: string = '';
  destino: string = '';
  conforto: string = '';
  numPessoas: number = 1;

  map: any;
  origemMarker: any;
  destinoMarker: any;

  viagemConfirmada = false;
  motoristaResposta: any = null;

  markers: L.Marker[] = [];

  constructor(private viagemService: ViagemService, private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([38.736946, -9.142685], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Leaflet © OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const latLon = e.latlng;
      this.destino = `${latLon.lat}, ${latLon.lng}`;
      this.novaViagem.destino.coordenadas = {
        latitude: latLon.lat,
        longitude: latLon.lng,
      };
      this.marcarDestinoNoMapa(latLon);
    });
  }

  marcarDestinoNoMapa(coords: { lat: number; lon: number }): void {
    console.log('Coordenadas na função marcarDestinoNoMapa:', coords);

    // Verificar se as coordenadas são válidas
    if (isNaN(coords.lat) || isNaN(coords.lon)) {
      alert('Coordenadas inválidas.');
      return;
    }

    // Criar e adicionar o marcador no mapa
    const marcador = L.marker([coords.lat, coords.lon]).addTo(this.map);

    // Adicionar o marcador de destino à lista para poder removê-lo depois
    this.markers.push(marcador);

    // Centralizar o mapa no destino com zoom fixo
    this.map.setView([coords.lat, coords.lon], 13);
  }

  marcarOrigemNoMapa(coords: { lat: number; lon: number }) {
    console.log('Coordenadas na função marcarOrigemNoMapa:', coords);

    // Verificar se as coordenadas são válidas
    if (isNaN(coords.lat) || isNaN(coords.lon)) {
      alert('Coordenadas inválidas.');
      return;
    }

    // Remover os marcadores antigos antes de adicionar o novo marcador de origem
    this.removerMarcadores();

    // Criar e adicionar o marcador de origem no mapa
    const marcadorOrigem = L.marker([coords.lat, coords.lon]).addTo(this.map);

    // Adicionar o marcador de origem à lista para poder removê-lo depois
    this.markers.push(marcadorOrigem);

    // Centralizar o mapa na origem com zoom fixo
    this.map.setView([coords.lat, coords.lon], 13);
  }

  // Função para remover todos os marcadores do mapa
  removerMarcadores(): void {
    // Iterar sobre todos os marcadores e removê-los do mapa
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });

    // Limpar a lista de marcadores
    this.markers = [];
  }

  usarLocalizacaoAtual(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.origem = `${lat}, ${lon}`;
        this.novaViagem.origem.coordenadas = { latitude: lat, longitude: lon };
        this.map.setView([lat, lon], 13);
        this.marcarOrigemNoMapa({ lat, lon });
      });
    } else {
      alert('Geolocalização não suportada.');
    }
  }

  async geocodificarEndereco(endereco: string): Promise<{
    lat: number;
    lon: number;
    rua: string;
    numPorta: string;
    codigoPostal: string;
    localidade: string;
  } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
      endereco
    )}`;
    try {
      const resposta: any = await this.http.get(url).toPromise();
      if (resposta.length > 0) {
        const resultado = resposta[0];
        const address = resultado.address || {};
        return {
          lat: parseFloat(resultado.lat),
          lon: parseFloat(resultado.lon),
          rua: address.road || '',
          numPorta: address.house_number || '',
          codigoPostal: address.postcode || '',
          localidade: address.city || address.town || address.village || '',
        };
      }
    } catch {
      alert('Erro ao converter endereço.');
    }
    return null;
  }

  async obterEnderecoPorCoordenadas(latitude: number, longitude: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      return {
        rua: data.address.road || '',
        numPorta: data.address.house_number || '',
        codigoPostal: data.address.postcode || '',
        localidade:
          data.address.city || data.address.town || data.address.village || '',
      };
    } catch (error) {
      console.error('Erro ao obter endereço pelas coordenadas:', error);
      return null;
    }
  }

  async pedirViagem(): Promise<void> {
    let origemCoords, destinoCoords;

    console.log(this.origem);
    console.log(this.destino);

    // Para a origem
    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(this.origem.trim())) {
      const [lat, lon] = this.origem.split(',').map(Number);
      if (isNaN(lat) || isNaN(lon)) {
        alert('Coordenadas de origem inválidas.');
        return;
      }
      origemCoords = { latitude: lat, longitude: lon };
      const endereco = await this.obterEnderecoPorCoordenadas(lat, lon);
      if (!endereco) return;
      this.novaViagem.origem = {
        _id: '',
        rua: endereco.rua,
        numPorta: endereco.numPorta,
        codigoPostal: endereco.codigoPostal,
        localidade: endereco.localidade,
        coordenadas: origemCoords,
      };
      this.marcarOrigemNoMapa({ lat, lon });
    } else {
      const coords = await this.geocodificarEndereco(this.origem);
      if (!coords || isNaN(Number(coords.lat)) || isNaN(Number(coords.lon))) {
        alert('Falha ao obter coordenadas válidas da origem.');
        return;
      }

      console.log('Coordenadas geocodificadas da origem:', coords);

      if (!coords) return;
      origemCoords = { latitude: coords.lat, longitude: coords.lon };
      this.novaViagem.origem = {
        _id: '',
        rua: coords.rua,
        numPorta: '',
        codigoPostal: '',
        localidade: coords.localidade,
        coordenadas: origemCoords,
      };
      this.marcarOrigemNoMapa({ lat: coords.lat, lon: coords.lon });
    }

    // Para o destino
    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(this.destino.trim())) {
      const [lat, lon] = this.destino.split(',').map(Number);
      if (isNaN(lat) || isNaN(lon)) {
        alert('Coordenadas de destino inválidas.');
        return;
      }
      destinoCoords = { latitude: lat, longitude: lon };

      const endereco = await this.obterEnderecoPorCoordenadas(lat, lon);
      if (!endereco) return;

      this.novaViagem.destino = {
        _id: '',
        rua: endereco.rua,
        numPorta: endereco.numPorta,
        codigoPostal: endereco.codigoPostal,
        localidade: endereco.localidade,
        coordenadas: destinoCoords,
      };

      this.marcarDestinoNoMapa({ lat, lon });
    } else {
      const coords = await this.geocodificarEndereco(this.destino);
      if (!coords || isNaN(Number(coords.lat)) || isNaN(Number(coords.lon))) {
        alert('Falha ao obter coordenadas válidas do destino.');
        return;
      }

      console.log('Coordenadas geocodificadas da origem:', coords);

      if (!coords) return;
      destinoCoords = { latitude: coords.lat, longitude: coords.lon };
      this.novaViagem.destino = {
        _id: '',
        rua: coords.rua,
        numPorta: '',
        codigoPostal: '',
        localidade: coords.localidade,
        coordenadas: destinoCoords,
      };
      this.marcarDestinoNoMapa({ lat: coords.lat, lon: coords.lon });
    }

    this.novaViagem.origem.coordenadas = origemCoords;
    this.novaViagem.destino.coordenadas = destinoCoords;

    const viagem = {
      cliente: {
        nome: this.cliente.pessoa.nome,
        nif: this.cliente.pessoa.nif,
        genero: this.cliente.pessoa.genero,
      },
      origem: this.novaViagem.origem,
      destino: this.novaViagem.destino,
      conforto: this.conforto,
      num_pessoas: this.numPessoas,
    };

    console.log('JSON a ser enviado:', JSON.stringify(viagem, null, 2));

    this.viagemService.pedirViagem(viagem).subscribe({
      next: (res) => {
        alert('Viagem pedida com sucesso!');
        this.viagemConfirmada = false;
        this.motoristaResposta = null;
      },
      error: () => alert('Erro ao pedir viagem.'),
    });
  }

  aceitarViagem(): void {
    if (!this.motoristaResposta) return alert('Sem dados do motorista.');
    const { motoristaId, viagemId } = this.motoristaResposta;
    this.viagemService.confirmarViagem(motoristaId, viagemId).subscribe({
      next: () => {
        this.viagemConfirmada = true;
        alert('Viagem confirmada!');
      },
      error: () => alert('Erro ao confirmar viagem.'),
    });
  }

  rejeitarViagem(): void {
    if (!this.motoristaResposta) return alert('Sem dados do motorista.');
    const { motoristaId, viagemId } = this.motoristaResposta;
    this.viagemService.rejeitarViagem(motoristaId, viagemId).subscribe({
      next: () => alert('Viagem rejeitada!'),
      error: () => alert('Erro ao rejeitar viagem.'),
    });
  }

  receberRespostaMotorista(motorista: any): void {
    this.motoristaResposta = motorista;
  }
}
