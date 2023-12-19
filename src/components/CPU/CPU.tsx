import { IProcess } from '../../types'
import { Process } from '../Process'
import styles from './CPU.module.css'
interface Props {
    CPU_number:number,
    process: IProcess[] | undefined
}
export const CPU = ({CPU_number, process}:Props) => {

  return (
    <div className={styles.container}>
        <h3>CPU{CPU_number}</h3>
        {/* {process ? <Process {...process}/> : <></>} */}
        <div className={styles.process}>{process?.map(p => <Process key={`CPU${CPU_number}-${p.PID}`}  {...p}/>)}</div>
    </div>
  )
}
