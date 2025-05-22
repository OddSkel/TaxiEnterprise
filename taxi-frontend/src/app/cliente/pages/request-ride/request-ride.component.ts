import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { ViagemService } from 'src/app/core/services/viagem.service';
import { Viagem } from 'src/app/core/models/viagem';
import { Cliente } from 'src/app/core/models/cliente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-ride',
  templateUrl: './request-ride.component.html',
  styleUrls: ['./request-ride.component.css']
})
export class RequestRideComponent {
  viagemPedida:Viagem | undefined;

  cliente: Cliente = {
    pessoa: { nome: '', nif: '', genero: '', _id: '' },
    _id: ''
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

  origemMarker: L.Marker | null = null;
  destinoMarker: L.Marker | null = null;

  viagemConfirmada = false;
  motoristaResposta: any = null;

  errorMessage: string = '';

  constructor(
    private viagemService: ViagemService, 
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([38.736946, -9.142685], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Leaflet © OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const latLng = e.latlng;
      this.destino = `${latLng.lat}, ${latLng.lng}`;
      this.novaViagem.destino.coordenadas = { latitude: latLng.lat, longitude: latLng.lng };
      this.marcarDestinoNoMapa(latLng);
    });
  }

  marcarDestinoNoMapa(coords: { lat: number, lng: number }): void {
    console.log("Coordenadas na função marcarDestinoNoMapa:", coords);

    if (isNaN(coords.lat) || isNaN(coords.lng)) {
      this.errorMessage = "Coordenadas Destino inválidas.";
      return;
    }

    // Remove marcador antigo do destino antes de adicionar o novo
    if (this.destinoMarker) {
      this.map.removeLayer(this.destinoMarker);
    }

    this.destinoMarker = L.marker([coords.lat, coords.lng]).addTo(this.map);
    this.map.setView([coords.lat, coords.lng], 13);
  }

  marcarOrigemNoMapa(coords: { lat: number, lng: number }): void {
    console.log("Coordenadas na função marcarOrigemNoMapa:", coords);

    if (isNaN(coords.lat) || isNaN(coords.lng)) {
      this.errorMessage = "Coordenadas Origem inválidas.";
      return;
    }

    // Remove marcador antigo da origem antes de adicionar o novo
    if (this.origemMarker) {
      this.map.removeLayer(this.origemMarker);
    }

    this.origemMarker = L.marker([coords.lat, coords.lng]).addTo(this.map);
    this.map.setView([coords.lat, coords.lng], 13);
  }

  usarLocalizacaoAtual(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.origem = `${lat}, ${lng}`;
        this.novaViagem.origem.coordenadas = { latitude: lat, longitude: lng };
        this.map.setView([lat, lng], 13);
        this.marcarOrigemNoMapa({ lat, lng });
      });
    } else {
      alert("Geolocalização não suportada.");
    }
  }

  async geocodificarEndereco(endereco: string): Promise<{
    lat: number,
    lng: number,
    rua: string,
    numPorta: string,
    codigoPostal: string,
    localidade: string
  } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(endereco)}`;
    try {
      const resposta: any = await this.http.get(url).toPromise();
      if (resposta.length > 0) {
        const resultado = resposta[0];
        const address = resultado.address || {};
        return {
          lat: parseFloat(resultado.lat),
          lng: parseFloat(resultado.lon),  // usar lng aqui
          rua: address.road || '',
          numPorta: address.house_number || '',
          codigoPostal: address.postcode || '',
          localidade: address.city || address.town || address.village || ''
        };
      }
    } catch {
      alert("Erro ao converter endereço.");
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
        localidade: data.address.city || data.address.town || data.address.village || '',
      };
    } catch (error) {
      console.error('Erro ao obter endereço pelas coordenadas:', error);
      return null;
    }
  }

  async pedirViagem(): Promise<void> {
    this.errorMessage = ''; // Limpa mensagens anteriores
    let origemCoords, destinoCoords;

    // Verificações adicionais
    if (!this.cliente.pessoa.nome || this.cliente.pessoa.nome.trim() === '') {
      this.errorMessage = 'O campo nome é obrigatório.';
      return;
    }

    if (!this.cliente.pessoa.nif || this.cliente.pessoa.nif.trim() === '') {
      this.errorMessage = 'O campo NIF é obrigatório.';
      return;
    }

    if (!this.cliente.pessoa.genero || this.cliente.pessoa.genero.trim() === '') {
      this.errorMessage = 'O campo genero é obrigatório.';
      return;
    }

    if (!this.origem || this.origem.trim() === '') {
      this.errorMessage = 'O campo origem é obrigatório.';
      return;
    }

    if (!this.destino || this.destino.trim() === '') {
      this.errorMessage = 'O campo destino é obrigatório.';
      return;
    }

    if (!this.conforto || this.conforto.trim() === '') {
      this.errorMessage = 'O campo conforto é obrigatório.';
      return;
    }

    if (!this.numPessoas || this.numPessoas < 1 || this.numPessoas > 6) {
      this.errorMessage = 'O número de pessoas deve ser entre 1 e 6.';
      return;
    }

    console.log(this.origem);
    console.log(this.destino);

    // Para a origem
    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(this.origem.trim())) {
      const [lat, lng] = this.origem.split(',').map(Number);
      if (isNaN(lat) || isNaN(lng)) {
        this.errorMessage = "Coordenadas Origem inválidas.";
        return;
      }
      origemCoords = { latitude: lat, longitude: lng };
      const endereco = await this.obterEnderecoPorCoordenadas(lat, lng);
      if (!endereco) {
        this.errorMessage = "Erro ao obter endereço a partir da origem.";
        return;
      }
      this.novaViagem.origem = {
        _id: '',
        rua: endereco.rua,
        numPorta: endereco.numPorta,
        codigoPostal: endereco.codigoPostal,
        localidade: endereco.localidade,
        coordenadas: origemCoords
      };
      this.marcarOrigemNoMapa({ lat, lng });
    } else {
      const coords = await this.geocodificarEndereco(this.origem);
      if (!coords || isNaN(Number(coords.lat)) || isNaN(Number(coords.lng))) {
        this.errorMessage = "Falha a geocodificar origem.";
        return;
      }

      console.log("Coordenadas geocodificadas da origem:", coords);

      origemCoords = { latitude: coords.lat, longitude: coords.lng };
      this.novaViagem.origem = {
        _id: '',
        rua: coords.rua,
        numPorta: '',
        codigoPostal: '',
        localidade: coords.localidade,
        coordenadas: origemCoords
      };
      this.marcarOrigemNoMapa({ lat: coords.lat, lng: coords.lng });
    }

    // Para o destino
    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(this.destino.trim())) {
      const [lat, lng] = this.destino.split(',').map(Number);
      if (isNaN(lat) || isNaN(lng)) {
        this.errorMessage = "Coordenadas Destino inválidas.";
        return;
      }
      destinoCoords = { latitude: lat, longitude: lng };

      const endereco = await this.obterEnderecoPorCoordenadas(lat, lng);
      if (!endereco) {
        this.errorMessage = "Erro ao obter endereço a partir do destino.";
        return;
      }

      this.novaViagem.destino = {
        _id: '',
        rua: endereco.rua,
        numPorta: endereco.numPorta,
        codigoPostal: endereco.codigoPostal,
        localidade: endereco.localidade,
        coordenadas: destinoCoords
      };

      this.marcarDestinoNoMapa({ lat, lng });
    } else {
      const coords = await this.geocodificarEndereco(this.destino);
      if (!coords || isNaN(Number(coords.lat)) || isNaN(Number(coords.lng))) {
        this.errorMessage = "Falha a geocodificar destino.";
        return;
      }

      console.log("Coordenadas geocodificadas do destino:", coords);

      destinoCoords = { latitude: coords.lat, longitude: coords.lng };
      this.novaViagem.destino = {
        _id: '',
        rua: coords.rua,
        numPorta: '',
        codigoPostal: '',
        localidade: coords.localidade,
        coordenadas: destinoCoords
      };
      this.marcarDestinoNoMapa({ lat: coords.lat, lng: coords.lng });
    }

    this.novaViagem.origem.coordenadas = origemCoords;
    this.novaViagem.destino.coordenadas = destinoCoords;

    const viagem = {
      cliente: {
        nome: this.cliente.pessoa.nome,
        nif: this.cliente.pessoa.nif,
        genero: this.cliente.pessoa.genero
      },
      origem: this.novaViagem.origem,
      destino: this.novaViagem.destino,
      conforto: this.conforto,
      num_pessoas: this.numPessoas
    };

    console.log("Objeto viagem a enviar:", viagem);

    this.viagemService.pedirViagem(viagem).subscribe({
      next: (res) => {
        console.log("Viagem recebida:", res);
        this.errorMessage = '';
        this.router.navigate(['/cliente/cliente', res._id, 'waiting']);
      },
      error: (error) => {
        this.errorMessage = "Erro ao pedir viagem.";
        console.error(error);
      }
    });
  }
}
