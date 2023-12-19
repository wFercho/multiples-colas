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
            <div className={`${styles.processes_container} ${!isRAM && queueName === "Procesos Nuevos" ? styles.orange_bg : styles.green_bg}`}>
                {processes?.map(p => <Process key={`${queueName}-${p.PID}`}  {...p} />)}
            </div>
        </div>
    )
}