

export type ProcessQueueName = "NEW" | "READY" | "RUNNING" | "WAITING" | "TERMINATED"

export interface IProcessQueueProps {
    typeQueue: ProcessQueueName,
    processes?: IProcess[]
    isRAM:boolean
}


export interface IProcess {
    PID:number
    size:number
    arrivalTime:number | null
    burstTime:number
    state:ProcessQueueName
}