import { format, parseISO } from "date-fns";
import { concat } from "rxjs";
import { Hino } from "./hino.interface";

export class ReuniaoFamiliar {
    datareuniaoStr: string = '';
    datareuniao?: Date = new Date();
    naomembro?: boolean = false;
    dirigidapor: number = 0;
    primeira_oracao: number = 0;
    primeiro_hino?: number;
    primeiro_hino_nome: string = '';
    mensagem: number = 0;
    ultima_oracao: number = 0;
    numero: number = 0;
    anuncio: string = '';
    observacao: string = '';
    Id: number = 0;
    regras_de_fe?: number[];
    regras_de_fe_str?: string = '';
    tipo_hinario?: string = '';
    
    constructor(data: string = '', numero: number = 0){    
        if(data) {
            this.datareuniaoStr = data;
            this.datareuniao = parseISO(data);
        }

        this.numero = numero;
    }
}