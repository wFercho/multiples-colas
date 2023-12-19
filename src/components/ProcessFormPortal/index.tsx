import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css'
import { IProcess } from '../../types';
import { RAM, useAppStore } from '../../stores/useAppStore';

const ProcessFormPortal = () => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <button onClick={() => setShowModal(true)}>
                Crear Proceso
            </button>
            {showModal && createPortal(
                <ModalContent onClose={() => setShowModal(false)} />,
                document.body
            )}
        </>
    );
}

export { ProcessFormPortal }


const ModalContent = ({ onClose }: { onClose: () => void }) => {

    const [form, setForm] = useState<IProcess>({ PID: -1, arrivalTime: null, burstTime: 0, size: 0, state: "NEW" })
    const addProcess = useAppStore((state) => state.addProcess)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form) {
            addProcess(form)
            onClose()
        }
    }

    const handleOnChangeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)

        if (value) {
            setForm({ ...form, size: value })
        }
    }

    const handleOnChangeBurstTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)

        if (value) {
            setForm({ ...form, burstTime: value })
        }
    }
    return (
        <div className={styles.modal}>

            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="">
                    RAM:
                    <input type="number" min={1} max={RAM} value={form?.size} onChange={e => handleOnChangeSize(e)} />
                </label>

                <label htmlFor="">
                    Tiempo en CPU:
                    <input type="number" value={form?.burstTime} onChange={e => handleOnChangeBurstTime(e)} />
                </label>
                <button>Crear</button>
            </form>
            <button onClick={onClose}>Close</button>
        </div>
    );
}