import { Turno } from './turno';
import { Cliente } from './cliente';
import { Motorista } from './motorista';
import { Taxi } from './taxi';
import { Morada } from './morada';
import { Conforto } from './conforto';

export interface Viagem {
  _id: string;
  cliente: Cliente;
  motorista: Motorista | undefined;
  taxi: Taxi | undefined;
  origem: Morada;
  destino: Morada;
  conforto: string;
  num_pessoas: number;
  estado: string;
  seq: number | undefined;
  turno: Turno | undefined;
  distanciaKm?: number;
  aguardandoConfirmacao?: boolean;
}

