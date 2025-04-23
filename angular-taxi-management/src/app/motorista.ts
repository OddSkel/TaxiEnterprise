import { Pessoa } from './pessoa';
import { Morada } from './morada';
export interface Motorista {
    _id: string;
    pessoa: Pessoa;
    morada: Morada;
    anoNascimento: number;
    cartaConducao: string;
}
