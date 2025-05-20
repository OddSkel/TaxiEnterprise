import { Pessoa } from "./pessoa";

export interface Cliente {
    _id: string;
    pessoa: Pessoa;
}
