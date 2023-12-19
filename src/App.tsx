import { useReducer, useLayoutEffect } from 'react'
import styles from './App.module.css'
import { CPU } from './components/CPU/CPU'
import { ProcessQueue } from './components/ProcessQueue/index'
import { appReducer, initialState } from './reducers/appReducer'



function App() {

  const [state, dispatch] = useReducer(appReducer, initialState)


  useLayoutEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "MOVE_TO_READY" })

    }, 2000)

    const timer2 = setInterval(() => {
      dispatch({ type: "MOVE_TO_CPU" })
    }, 5000)

    const timer3 = setInterval(() => {

      dispatch({ type: "PROCESS_ON_CPU" })
    }, 3000)
    return () => { clearInterval(timer); clearInterval(timer2); clearInterval(timer3) }
  }, [])



  const handleStartSimulation = () => {


  }

  return (
    <div className={styles.container}>
      <div className={styles.menu_container}>
        <h2 className={`${styles.RAM} ${!state.isRAM && styles.orange_bg}`}>RAM: {state.RAM}</h2>
        <div className={styles.cpus}>
          <div className={styles.cpu_1}>
            <CPU CPU_number={1} process={state.CPU_1} />
          </div>
          <div className={styles.cpu_2}>
            <CPU CPU_number={2} process={state.CPU_2} />
          </div>
        </div>
        <div>{/* <button onClick={handleStartSimulation}>INICIAR</button> */}</div>
      </div>
      <div className={styles.new}><ProcessQueue typeQueue='NEW' processes={state.NEW_PROCESSES} isRAM={state.isRAM} /></div>
      <div className={styles.ready}><ProcessQueue typeQueue='READY' processes={state.READY_PROCESSES} isRAM={state.isRAM} /></div>
      <div className={styles.waiting}><ProcessQueue typeQueue='WAITING' processes={state.WAITING_PROCESSES} isRAM={state.isRAM} /></div>
      <div className={styles.terminated}><ProcessQueue typeQueue='TERMINATED' processes={state.TERMINATED} isRAM={state.isRAM} /></div>
    </div>
  )
}

export default App
