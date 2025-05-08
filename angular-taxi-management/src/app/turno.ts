import { Taxi } from './taxi';
import { Motorista } from './motorista';
import { Periodo } from './periodo';

export interface Turno {
  _id: string;
  periodo: Periodo;
  price: Float32Array;
  taxi: Taxi;
  motorista: Motorista;
}
