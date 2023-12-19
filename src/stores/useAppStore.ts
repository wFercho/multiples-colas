import { create } from "zustand";
import { IProcess } from "../types";
import { isEnoughRAM } from "../utils";

const initialProcess:IProcess[] = [{ PID: 1, arrivalTime: null, burstTime: 4, size: 1223, state: "NEW" }, { PID: 2, arrivalTime: null, burstTime: 8, size: 4432, state: "NEW" }, { PID: 3, arrivalTime: null, burstTime: 6, size: 3002, state: "NEW" }, { PID: 4, arrivalTime: null, burstTime: 2, size: 6332, state: "NEW" }, { PID: 5, arrivalTime: null, burstTime: 6, size: 3332, state: "NEW" }, { PID: 6, arrivalTime: null, burstTime: 3, size: 1002, state: "NEW" }]

interface AppActions {
    moveToReady: () => void
    moveToCPU: () => void
    // processOnCPU1: () => void
    // processOnCPU2: () => void
    processOnCPU: () => void
    clockTimer: () => void
    addProcess: (process: IProcess) => void
}

interface AppState {
    newId: number
    timer: number
    RAM: number
    NEW_PROCESSES: IProcess[]
    READY_PROCESSES: IProcess[]
    CPU_1: IProcess[]
    CPU_2: IProcess[]
    WAITING_PROCESSES: IProcess[]
    TERMINATED: IProcess[]
    isRAM: boolean
}

type AppStateWActions = AppState & AppActions

export const RAM = 7761
export const useAppStore = create<AppStateWActions>()((set) => ({
    newId: 0,
    timer: 0,
    RAM,
    NEW_PROCESSES: initialProcess,
    READY_PROCESSES: [],
    CPU_1: [],
    CPU_2: [],
    WAITING_PROCESSES: [],
    TERMINATED: [],
    isRAM: true,
    moveToReady: () => set((state) => implMoveToReady(state)),
    moveToCPU: () => set((state) => implMoveToCPU(state)),
    processOnCPU: () => set((state) => implProcessOnCPU(state)),
    clockTimer: () => set((state) => ({ timer: state.timer + 1 })),
    addProcess: (process: IProcess) => set((state) => implAddProcess(state, process))
}))


const implAddProcess = (state: AppState, process: IProcess): AppState => {
    const onnewProcess = state.NEW_PROCESSES?.map(p => p)
    let newId = state.newId
    if (state.newId === 0) {
        newId = initialProcess.length + 1
    } else {
        newId = state.newId + 1
    }
    onnewProcess.push({ ...process, PID: newId })
    return { ...state, newId, NEW_PROCESSES: onnewProcess }
}

const implMoveToReady = (state: AppState) => {
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
                //console.log("NO HAY PROCESOS EN NEW");

            }

        } else {
            //console.log("NO HAY RAM SUFICIENTE");
            isRAM = false
        }

        return { ...state, READY_PROCESSES: onreadyProcess, RAM: newRAM, NEW_PROCESSES: onnewProcess, isRAM }

    } else {
        //console.log("No hay procesos en NEW");

        return state
    }
}


const implMoveToCPU = (state: AppState) => {
    const timer = state.timer
    const onreadyProcess = state.READY_PROCESSES?.map(p => p)
    if (onreadyProcess?.length !== 0) {

        let newState: AppState = Object.create(state)
        const onCPU1 = state.CPU_1?.map(p => p)
        if (onCPU1?.length == 0 && onreadyProcess?.length !== 0) {
            const process = onreadyProcess.shift()
            if (process) {
                newState = { ...state, CPU_1: [...onCPU1, { ...process, state: "RUNNING", arrivalTime: timer }], READY_PROCESSES: onreadyProcess }
            }

        }
        const onCPU2 = state.CPU_2?.map(p => p)
        if (onCPU2?.length == 0 && onreadyProcess?.length > 0) {
            const process = onreadyProcess.shift()
            if (process) {
                newState = { ...newState, CPU_2: [...onCPU2, { ...process, state: "RUNNING", arrivalTime: timer }], READY_PROCESSES: onreadyProcess }
            }
        }

        return newState
    } else {
        return state
    }
}

const implProcessOnCPU1 = (state: AppState) => {
    let onCPU1 = state.CPU_1?.map(p => p)
    let RAM = state.RAM
    const terminated = state.TERMINATED?.map(p => p)



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
    return { ...state, CPU_1: onCPU1, TERMINATED: terminated, RAM }

}

const implProcessOnCPU2 = (state: AppState) => {
    let onCPU2 = state.CPU_2?.map(p => p)
    let RAM = state.RAM
    const terminated = state.TERMINATED?.map(p => p)



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

    return { ...state, CPU_2: onCPU2, TERMINATED: terminated, RAM }

}

const implProcessOnCPU = (state: AppState) => {
    let onCPU1 = state.CPU_1?.map(p => p)
    let RAM = state.RAM
    let onCPU2 = state.CPU_2?.map(p => p)
    const terminated = state.TERMINATED?.map(p => p)



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

    return { ...state, CPU_1: onCPU1, CPU_2: onCPU2, TERMINATED: terminated, RAM }
}
