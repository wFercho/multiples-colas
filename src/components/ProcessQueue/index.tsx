import { IProcessQueueProps } from "../../types"
import { resolveQueueProcessName } from "../../utils"
import { Process } from "../Process"
import styles from './processqueue.module.css'

export const ProcessQueue = ({ typeQueue, processes, isRAM }: IProcessQueueProps) => {
    const queueName = resolveQueueProcessName(typeQueue)
    return (
        <div className={styles.container}>
            <h2>
                {queueName}
            </h2>
            <div className={`${styles.processes_container}`}>
                {processes?.map(p => <Process key={`${queueName}-${p.PID}`} process={p} bg={!isRAM && queueName === "Procesos Nuevos" ? "NO_RAM" : "NORMAL"} />)}
            </div>
        </div>
    )
}