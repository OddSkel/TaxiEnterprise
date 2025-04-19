import { Motorista } from './motorista';
import { Client } from './cliente';
export interface Taxi {
  _id: string;
  matricula: string;
  ano_compra: number;
  marca: string;
  modelo: string;
  nivel_conforto: string;
  motorista: Motorista;
  cliente: Client;
  createdAt: number;
}
