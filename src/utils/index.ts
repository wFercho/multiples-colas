import { ProcessQueueName } from "../types";

export const resolveQueueProcessName = (name:ProcessQueueName)=>{
    switch (name) {
        case "NEW":
            return "Procesos Nuevos"
            
        case "READY":
            return "Procesos Listos"
    
        case "RUNNING":
            return "Procesos en CPU"
        case "WAITING":
            return "Procesos en Espera"
        case "TERMINATED":
            return "Procesos Terminados"
        default:
            break;
    }
}


export const isEnoughRAM = (currentRAM:number, processRAM:number) => {
    return currentRAM > processRAM
}