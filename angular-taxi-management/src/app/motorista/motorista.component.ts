import { Component, OnInit } from '@angular/core';

import { Motorista } from '../motorista';
import { MotoristaService } from '../motorista.service';

@Component({
  selector: 'app-motorista',
  templateUrl: './motorista.component.html',
  styleUrls: ['./motorista.component.css']
})
export class MotoristaComponent implements OnInit {
  motoristas: Motorista[] = [];

  motorista: Motorista = {
    _id: '',
    pessoa: {
      _id: '',
      nome: '',
      nif: '',
      genero: '',
    },
    morada: {
      _id: '',
      rua: '',
      numPorta: '',
      codigoPostal: '',
      localidade: '',
    },
    anoNascimento: 0,
    cartaConducao: '',
  };
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  formValid: boolean = false;

  constructor(private motoristaService: MotoristaService) {}

  ngOnInit(): void {
    this.getMotoristas();
  }

  getMotoristas(): void {
    this.motoristaService.getMotoristas().subscribe({
      next: (data) => this.motoristas = data,
      error: (err) => console.error('Erro ao carregar motoristas', err)
    });
  }

  add(): void {
    this.fieldErrors = {};
    if (
      !this.motorista.pessoa.nome ||
      !this.motorista.pessoa.nif ||
      !this.motorista.pessoa.genero ||
      !this.motorista.morada.rua||
      !this.motorista.morada.numPorta ||
      !this.motorista.morada.codigoPostal ||
      !this.motorista.anoNascimento ||
      !this.motorista.cartaConducao
    ) {
      return;
    }

    this.motoristaService.addMotorista(this.motorista).subscribe({
      next: (motorista) => {
        this.motoristas.push(motorista);
        this.getMotoristas();
        this.clearForm();
        this.fieldErrors = {};
        this.errorMessage = '';
      },
      error: (error) => {
        this.fieldErrors = {};
        const err = error.error;
        if (err?.fieldErrors) {
          this.fieldErrors = err.fieldErrors;
        } else {
          this.errorMessage = err?.error || 'Something went wrong.';
        }
      },
    });
  }

  clearForm(): void {
    this.motorista = {
      _id: '',
      pessoa: {
        _id: '',
        nome: '',
        nif: '',
        genero: '',
      },
      morada: {
        _id: '',
        rua: '',
        numPorta: '',
        codigoPostal: '',
        localidade: '',
      },
      anoNascimento: 0,
      cartaConducao: '',
    };
    this.errorMessage = '';
    this.fieldErrors = {};
    this.formValid = false;
  }

  delete(motorista:Motorista): void {
    this.motoristaService.deleteMotorista(motorista._id).subscribe({
      next: () => {
        this.motoristas = this.motoristas.filter((h) => h !== motorista);
      },
      error: (err) => {
        console.error('Failed to delete motorista:', err);
      },
    });
  }

  validateNif() {
    const nif = this.motorista.pessoa.nif;
    const isValid = /^\d{9}$/.test(nif);
    
    if (!isValid) {
      this.fieldErrors['nif'] = 'NIF inválido (deve conter 9 dígitos numéricos)';
    } else {
      delete this.fieldErrors['nif'];
    }
    this.checkFormValidity();
  }

  validateCodigoPostal() {
    const codigo = this.motorista.morada.codigoPostal;
    const isValid = /^\d{4}-\d{3}$/.test(codigo);
    
    if (!isValid) {
      this.fieldErrors['codigoPostal'] = 'Código postal inválido (deve conter 4 dígitos seguidos de um traco e 3 dígitos)';
    } else {
      delete this.fieldErrors['codigoPostal'];
    }
    this.checkFormValidity();
  }
  
  onCodigoPostalChange(): void {
    const codigo = this.motorista.morada.codigoPostal;
    const localidade = this.obterLocalidade(codigo);
      
    if (localidade !== null) {
      this.motorista.morada.localidade = localidade
      delete this.fieldErrors['codigoPostal'];
    } else {
      this.motorista.morada.localidade = '';
      this.fieldErrors['codigoPostal'] = 'Código postal não reconhecido.';
    }
    this.checkFormValidity();
  }
  obterLocalidade(codigoPostal : string) {
    const prefixo = parseInt(codigoPostal.slice(0, 2), 10);
  
    if (prefixo >= 10 && prefixo <= 19) return "Lisboa";
    if (prefixo >= 20 && prefixo <= 23) return "Santarém";
    if (prefixo === 24 || prefixo === 25) return "Leiria";
    if (prefixo === 26) return "Vila Franca de Xira";
    if (prefixo === 27) return "Amadora";
    if (prefixo === 28) return "Almada";
    if (prefixo === 29) return "Setúbal";
  
    if (prefixo === 30 || prefixo === 31) return "Coimbra";
    if (prefixo >= 32 && prefixo <= 34) return "Castelo Branco";
    if (prefixo === 35 || prefixo === 36) return "Viseu";
    if (prefixo === 37 || prefixo === 38) return "Aveiro";
  
    if (prefixo >= 40 && prefixo <= 43) return "Norte";
    if (prefixo >= 40 && prefixo <= 49) return "Norte";
    if (prefixo >= 50 && prefixo <= 54) return "Trás-os-Montes";
  
    if (prefixo >= 60 && prefixo <= 64) return "Centro Interior";
    if (prefixo >= 70 && prefixo <= 79) return "Alentejo";
    if (prefixo >= 80 && prefixo <= 89) return "Algarve";
    if (prefixo >= 90 && prefixo <= 94) return "Madeira";
    if (prefixo >= 95 && prefixo <= 99) return "Açores";
  
    return null;
  }

  checkFormValidity() {
    const { pessoa, morada, anoNascimento, cartaConducao } = this.motorista;

    console.log(this.motorista);
    console.log(this.motorista.pessoa);
    console.log(this.motorista.morada);
  
    const allFieldsFilled =
      !!pessoa?.nome &&
      !!pessoa?.nif &&
      !!pessoa?.genero &&
      !!morada?.rua &&
      !!morada?.numPorta &&
      !!morada?.codigoPostal &&
      !!morada?.localidade &&
      !!anoNascimento &&
      !!cartaConducao;
  
    const noFieldErrors = Object.keys(this.fieldErrors).length === 0;
  
    this.formValid = allFieldsFilled && noFieldErrors;
  }

}

