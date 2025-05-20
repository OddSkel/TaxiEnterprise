import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Motorista } from 'src/app/core/models/motorista';
import { MotoristaService } from 'src/app/core/services/motorista.service';

@Component({
  selector: 'app-driver-edit',
  templateUrl: './driver-edit.component.html',
  styleUrls: ['./driver-edit.component.css']
})
export class DriverEditComponent {
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

  errorMessage = '';
  fieldErrors: any;
  valid: boolean = false;

  constructor(
    private motoristaService: MotoristaService,
    private location: Location,
    private route: ActivatedRoute,  // corrigido o nome
    private router: Router          // corrigido o nome
  ) {}

  ngOnInit(): void {
    this.getMotorista();
  }

  getMotorista(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.motoristaService.getMotorista(id).subscribe((motorista) => {
        this.motorista = motorista;
        this.checkFormValidity();  // verifica validade inicial
      });
    } else {
      this.errorMessage = 'ID do motorista não fornecido.';
    }
  }

  save(): void {
    this.checkFormValidity();  // garante que validade está atualizada antes de salvar

    if (!this.motorista._id) {
      this.errorMessage = 'ID do motorista inválido.';
      return;
    }
    if (!this.valid) {
      this.errorMessage = 'Corrija os erros do formulário antes de salvar.';
      return;
    }
    this.motoristaService.updateMotorista(this.motorista).subscribe({
      next: () => this.router.navigate(['/motoristas', this.motorista._id]),
      error: (err) => (this.errorMessage = 'Erro ao salvar: ' + err.message),
    });
  }

  goBack(): void {
    this.location.back();
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
      this.fieldErrors['codigoPostal'] =
        'Código postal inválido (deve conter 4 dígitos seguidos de um traço e 3 dígitos)';
    } else {
      delete this.fieldErrors['codigoPostal'];
    }
    this.checkFormValidity();
  }

  validateAnoNascimento(): void {
    const anoAtual = new Date().getFullYear();
    const idade = anoAtual - this.motorista.anoNascimento;

    if (idade < 18) {
      this.fieldErrors['anoNascimento'] = 'O motorista deve ter pelo menos 18 anos.';
    } else {
      delete this.fieldErrors['anoNascimento'];
    }

    this.checkFormValidity();
  }

  checkFormValidity() {
    const { pessoa, morada, anoNascimento, cartaConducao } = this.motorista;

    const allFieldsFilled =
      pessoa?.nome.trim() !== '' &&
      pessoa?.nif.trim() !== '' &&
      pessoa?.genero.trim() !== '' &&
      morada?.rua.trim() !== '' &&
      morada?.numPorta.trim() !== '' &&
      morada?.codigoPostal.trim() !== '' &&
      morada?.localidade.trim() !== '' &&
      anoNascimento > 0 &&
      cartaConducao.trim() !== '';

    const noFieldErrors = Object.keys(this.fieldErrors).length === 0;

    this.valid = allFieldsFilled && noFieldErrors;
  }
}
