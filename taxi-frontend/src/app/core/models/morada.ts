export interface Morada {
    _id: string;
    rua: string;
    numPorta: string;
    codigoPostal: string;
    localidade: string
    coordenadas?: { // Adicionar coordenadas como um campo opcional
        latitude: number;
        longitude: number;
    };
}