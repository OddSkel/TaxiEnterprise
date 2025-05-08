import { Turno } from './turno';

export interface Viagem {
  _id: string;
  num_pessoas: number;
  seq: number;
  turno: Turno;
}
