import { Turno } from './turno';
import { Cliente } from './cliente';
import { Motorista } from './motorista';
import { Taxi } from './taxi';
import { Morada } from './morada';

export interface Viagem {
  _id: string;
  cliente: Cliente;
  motorista: Motorista | undefined;
  taxi: Taxi | undefined;
  origem: Morada;
  destino: Morada;
  conforto: String;
  num_pessoas: number;
  estado: string;
  seq: number | undefined;
  turno: Turno | undefined;
  custo_total: number | undefined;
  quilometros: number | undefined;
  inicio: Date | undefined;
  fim: Date | undefined;
  distanciaKm?: number
}
