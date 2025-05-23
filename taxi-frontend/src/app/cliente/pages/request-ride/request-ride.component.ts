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
    distanciaCliente: 0
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

    this.map.on('click', async (e: any) => {
      const latLng = e.latlng;
      this.novaViagem.destino.coordenadas = { latitude: latLng.lat, longitude: latLng.lng };
      this.marcarDestinoNoMapa(latLng);

      const endereco = await this.obterEnderecoPorCoordenadas(latLng.lat, latLng.lng);
      if (endereco) {
        this.destino = this.formatarEnderecoParaString(endereco);
        this.novaViagem.destino.rua = endereco.rua;
        this.novaViagem.destino.numPorta = endereco.numPorta;
        this.novaViagem.destino.localidade = endereco.localidade;
      } else {
        this.destino = `${latLng.lat}, ${latLng.lng}`;
      }
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
      
      this.novaViagem.origem.coordenadas = { latitude: lat, longitude: lng };
      this.marcarOrigemNoMapa({ lat, lng });
      this.map.setView([lat, lng], 13);
      
      // Aqui usamos .then() porque obterEnderecoPorCoordenadas retorna uma Promise
      this.obterEnderecoPorCoordenadas(lat, lng).then((endereco) => {
        if (endereco) {
          this.origem = this.formatarEnderecoParaString(endereco);
          this.novaViagem.origem.rua = endereco.rua;
          this.novaViagem.origem.numPorta = endereco.numPorta;
          this.novaViagem.origem.localidade = endereco.localidade;
        } else {
          this.origem = `${lat}, ${lng}`;
        }
      }).catch(() => {
        this.origem = `${lat}, ${lng}`;
      });
    }, () => {
      alert("Erro ao obter localização.");
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

  validarCampos(): boolean {
  if (!this.cliente.pessoa.nome?.trim()) {
    this.errorMessage = 'O campo nome é obrigatório.';
    return false;
  }
  if (!this.cliente.pessoa.nif?.trim()) {
    this.errorMessage = 'O campo NIF é obrigatório.';
    return false;
  }
  if (!this.cliente.pessoa.genero?.trim()) {
    this.errorMessage = 'O campo gênero é obrigatório.';
    return false;
  }
  if (!this.origem?.trim()) {
    this.errorMessage = 'O campo origem é obrigatório.';
    return false;
  }
  if (!this.destino?.trim()) {
    this.errorMessage = 'O campo destino é obrigatório.';
    return false;
  }
  if (!this.conforto?.trim()) {
    this.errorMessage = 'O campo conforto é obrigatório.';
    return false;
  }
  if (!this.numPessoas || this.numPessoas < 1 || this.numPessoas > 6) {
    this.errorMessage = 'O número de pessoas deve ser entre 1 e 6.';
    return false;
  }
  this.errorMessage = '';
  return true;
}

async montarLocalizacao(enderecoOuCoords: string): Promise<{
  endereco: any,
  coords: { latitude: number, longitude: number }
} | null> {
  // Detecta se é coordenada (lat,lng)
  if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(enderecoOuCoords.trim())) {
    const [lat, lng] = enderecoOuCoords.split(',').map(Number);
    if (isNaN(lat) || isNaN(lng)) return null;
    const endereco = await this.obterEnderecoPorCoordenadas(lat, lng);
    if (!endereco) return null;
    return { endereco, coords: { latitude: lat, longitude: lng } };
  } else {
    // Se não for coordenada, geocodifica
    const coords = await this.geocodificarEndereco(enderecoOuCoords);
    if (!coords) return null;
    return { endereco: coords, coords: { latitude: coords.lat, longitude: coords.lng } };
  }
}

async pedirViagem(): Promise<void> {
  if (!this.validarCampos()) return;

  const origemData = await this.montarLocalizacao(this.origem);
  if (!origemData) {
    this.errorMessage = "Falha ao obter origem.";
    return;
  }
  this.novaViagem.origem = {
    _id: '',
    rua: origemData.endereco.rua,
    numPorta: origemData.endereco.numPorta || '',
    codigoPostal: origemData.endereco.codigoPostal || '',
    localidade: origemData.endereco.localidade,
    coordenadas: origemData.coords
  };
  this.marcarOrigemNoMapa({ lat: origemData.coords.latitude, lng: origemData.coords.longitude });

  const destinoData = await this.montarLocalizacao(this.destino);
  if (!destinoData) {
    this.errorMessage = "Falha ao obter destino.";
    return;
  }
  this.novaViagem.destino = {
    _id: '',
    rua: destinoData.endereco.rua,
    numPorta: destinoData.endereco.numPorta || '',
    codigoPostal: destinoData.endereco.codigoPostal || '',
    localidade: destinoData.endereco.localidade,
    coordenadas: destinoData.coords
  };
  this.marcarDestinoNoMapa({ lat: destinoData.coords.latitude, lng: destinoData.coords.longitude });

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

  this.viagemService.pedirViagem(viagem).subscribe({
    next: (res) => {
      this.errorMessage = '';
      this.router.navigate(['/cliente/cliente', res._id, 'waiting']);
    },
    error: (error) => {
      this.errorMessage = "Erro ao pedir viagem.";
      console.error(error);
    }
  });
}


  formatarEnderecoParaString(endereco: { rua: string, numPorta: string, localidade: string }): string {
    let enderecoStr = endereco.rua || '';
    if (endereco.numPorta) {
      enderecoStr += ` ${endereco.numPorta}`;
    }
    if (endereco.localidade) {
      enderecoStr += `, ${endereco.localidade}`;
    }
    return enderecoStr;
  }

}
