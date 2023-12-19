import { IProcess } from "../types"
import { isEnoughRAM } from "../utils"

interface Payload {
    process?: IProcess
    type: "ADD_TO_NEW" | "MOVE_TO_READY" | "MOVE_TO_CPU" | "MOVE_TO_WAITING" | "MOVE_TO_TERMINATED" | "PROCESS_ON_CPU"
}

interface SimulatorState {
    RAM: number
    NEW_PROCESSES: IProcess[]
    READY_PROCESSES: IProcess[]
    CPU_1: IProcess[]
    CPU_2: IProcess[]
    WAITING_PROCESSES: IProcess[]
    TERMINATED: IProcess[],
    isRAM: boolean
}

export const initialState: SimulatorState = {
    RAM: 7761,
    NEW_PROCESSES: [{ PID: 1, arrivalTime: 0, burstTime: 4, size: 1223, state: "NEW" }, { PID: 2, arrivalTime: 0, burstTime: 8, size: 4432, state: "NEW" }, { PID: 3, arrivalTime: 0, burstTime: 6, size: 3332, state: "NEW" }, { PID: 4, arrivalTime: 0, burstTime: 2, size: 6332, state: "NEW" }, { PID: 5, arrivalTime: 0, burstTime: 6, size: 3332, state: "NEW" }],
    READY_PROCESSES: [],
    CPU_1: [],
    CPU_2: [],
    WAITING_PROCESSES: [],
    TERMINATED: [],
    isRAM: true
}


export const appReducer = (state: SimulatorState, payload: Payload): SimulatorState => {
    switch (payload.type) {
        case "MOVE_TO_READY": {
            let isRAM = state.isRAM
            const onreadyProcess = state.READY_PROCESSES?.map(p => p)
            const onnewProcess = state.NEW_PROCESSES?.map(p => p)
            if (onnewProcess?.length > 0) {
                let newRAM = state.RAM
                if (isEnoughRAM(newRAM, onnewProcess[0].size)) {
                    isRAM = true
                    if (onnewProcess.length !== 0) {
                        newRAM -= onnewProcess[0].size
                        onreadyProcess.push({ ...onnewProcess[0], state: "READY" })
                        onnewProcess.shift()
                    } else {
                        console.log("NO HAY PROCESOS EN NEW");

                    }

                } else {
                    console.log("NO HAY RAM SUFICIENTE");
                    isRAM = false
                }

                return { ...state, READY_PROCESSES: onreadyProcess, RAM: newRAM, NEW_PROCESSES: onnewProcess, isRAM }

            } else {
                console.log("No hay procesos en NEW");

                return state
            }

        }

        case "MOVE_TO_CPU": {
            const onreadyProcess = state.READY_PROCESSES?.map(p => p)
            if (onreadyProcess?.length !== 0) {

                let newState: SimulatorState = Object.create(state)
                const onCPU1 = state.CPU_1?.map(p => p)
                if (onCPU1?.length == 0 && onreadyProcess?.length !== 0) {
                    const process = onreadyProcess.shift()
                    if (process) {
                        newState = { ...state, CPU_1: [...onCPU1, { ...process, state: "RUNNING" }], READY_PROCESSES: onreadyProcess }
                    }

                }
                const onCPU2 = state.CPU_2?.map(p => p)
                if (onCPU2?.length == 0 && onreadyProcess?.length > 0) {
                    const process = onreadyProcess.shift()
                    if (process) {
                        newState = { ...newState, CPU_2: [...onCPU2, { ...process, state: "RUNNING" }], READY_PROCESSES: onreadyProcess }
                    }
                }

                return newState
            } else {
                return state
            }
        }
        case "MOVE_TO_TERMINATED": {


            return { ...state, CPU_1: [...state.CPU_1, { PID: 4, arrivalTime: 0, burstTime: 5, size: 4432, state: "READY" }] }

        }
        case "MOVE_TO_WAITING": {
            return state
        }
        case "ADD_TO_NEW": {
            return state
        }

        case "PROCESS_ON_CPU": {
            let onCPU1 = state.CPU_1?.map(p => p)
            let RAM = state.RAM
            let onCPU2 = state.CPU_2?.map(p => p)
            const terminated = state.TERMINATED?.map(p => p)

            console.log({ terminated });

            if (onCPU1?.length >= 0) {
                onCPU1 = onCPU1?.filter(p => {
                    if (p.burstTime > 0) {
                        return p
                    } else {
                        RAM = RAM + p.size
                        terminated.push({ ...p, state: "TERMINATED" })
                    }
                })

                onCPU1 = onCPU1.map(p => {
                    p.burstTime--
                    return p
                })
            }


            if (onCPU2?.length >= 0) {
                onCPU2 = onCPU2?.filter(p => {
                    if (p) {
                        if (p.burstTime > 0) {
                            return p
                        } else {
                            RAM = RAM + p.size
                            terminated?.push({ ...p, state: "TERMINATED" })
                        }
                    }
                })

                onCPU2 = onCPU2?.map(p => {
                    p.burstTime--
                    return p
                })
            }

            if (terminated === undefined) {
                const ter = state.TERMINATED?.map(p => p)
                console.log({ ter });

                return { ...state, CPU_1: onCPU1, CPU_2: onCPU2, TERMINATED: [], RAM }

            }
            return { ...state, CPU_1: onCPU1, CPU_2: onCPU2, TERMINATED: terminated, RAM }
        }

        default:
            return state
    }
}
