export interface Morada {
    _id: string;
    rua: string;
    numPorta: string;
    codigoPostal: string;
    localidade: string
    coordenadas?: { 
        latitude: number;
        longitude: number;
    };
}