import { Taxi } from './taxi';
import { Motorista } from './motorista';

export interface Turno {
  _id: string;
  start: string;
  end: string;
  taxi: Taxi;
  motorista: Motorista;
}
