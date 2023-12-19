import { IProcess } from "../../types"
import styles from './process.module.css'

interface Props {
    process:IProcess | null | undefined
    bg: "CPU"| "NO_RAM" | "NORMAL"
}

export const Process = ({process, bg}:Props) => {

    if(!process) return <></>
    const {PID,arrivalTime, size, burstTime} = process
    return (
        <div className={`${styles.container} ${bg === "NORMAL" && styles.blue_bg} ${bg === "NO_RAM" && styles.orange_bg} ${bg === "CPU" && styles.green_bg}`}>
            <p><strong>PID: </strong>{PID}</p>
            {arrivalTime ? <p><strong>Tiempo llegada: </strong>{arrivalTime}</p>:<></>}
            <p><strong>Tamaño: </strong>{size}MB</p>
            <p><strong>Restante: </strong>{burstTime}</p>
        </div>
    )
}
