import { IProcess } from "../../types"
import styles from './process.module.css'

export const Process = (process:IProcess | null | undefined) => {

    if(!process) return <></>
    const {PID,arrivalTime, size, burstTime} = process
    return (
        <div className={styles.container}>
            <p><strong>PID: </strong>{PID}</p>
            <p><strong>Tiempo llegada: </strong>{arrivalTime}</p>
            <p><strong>Tamaño: </strong>{size}MB</p>
            <p><strong>Restante: </strong>{burstTime}</p>
        </div>
    )
}
