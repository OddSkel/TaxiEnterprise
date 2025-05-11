import { Pessoa } from "./pessoa";

export interface Client {
    _id: string;
    pessoa: Pessoa;
}
