import { useEffect } from 'react'
import styles from './App.module.css'
import { CPU } from './components/CPU/CPU'
import { ProcessQueue } from './components/ProcessQueue/index'
import { useAppStore } from './stores/useAppStore'
import { ProcessFormPortal } from './components/ProcessFormPortal'



function App() {

  const isRAM = useAppStore((state) => state.isRAM)
  const CPU_1 = useAppStore((state) => state.CPU_1)
  const CPU_2 = useAppStore((state) => state.CPU_2)
  const newProcesses = useAppStore((state) => state.NEW_PROCESSES)
  const readyProcesses = useAppStore((state) => state.READY_PROCESSES)
  const terminatedProcesses = useAppStore((state) => state.TERMINATED)
  const waitingProcesses = useAppStore((state) => state.WAITING_PROCESSES)
  const RAM = useAppStore((state) => state.RAM)


  const moveToReady = useAppStore((state) => state.moveToReady)
  const moveToCPU = useAppStore((state) => state.moveToCPU)
  const processOnCPU = useAppStore((state) => state.processOnCPU)
  const clockTimer = useAppStore((state) => state.clockTimer)



  useEffect(() => {
    const timer = setInterval(() => {
      startSimulation()
    }, 3000)

    return () => { clearInterval(timer) }
  }, [])



  const startSimulation = () => {
    setTimeout(() => {
      clockTimer()
      moveToReady()
    }, 0)

    setTimeout(() => {
      moveToCPU()
    }, 1000)

    setTimeout(() => {
      processOnCPU()
    }, 2000)


  }

  return (
    <div className={styles.container}>
      <div className={styles.menu_container}>
        <h2 className={`${styles.RAM} ${!isRAM && styles.orange_bg}`}>RAM: {RAM}MB</h2>
        <div className={styles.cpus}>
          <div className={styles.cpu_1}>
            <CPU CPU_number={1} process={CPU_1} />
          </div>
          <div className={styles.cpu_2}>
            <CPU CPU_number={2} process={CPU_2} />
          </div>
        </div>
        <div><ProcessFormPortal /></div>
      </div>
      <div className={styles.new}><ProcessQueue typeQueue='NEW' processes={newProcesses} isRAM={isRAM} /></div>
      <div className={styles.ready}><ProcessQueue typeQueue='READY' processes={readyProcesses} isRAM={isRAM} /></div>
      <div className={styles.waiting}><ProcessQueue typeQueue='WAITING' processes={waitingProcesses} isRAM={isRAM} /></div>
      <div className={styles.terminated}><ProcessQueue typeQueue='TERMINATED' processes={terminatedProcesses} isRAM={isRAM} /></div>
    </div>
  )
}

export default App
