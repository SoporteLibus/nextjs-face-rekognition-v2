"use client"
import styles from '@/app/styles/page.module.css'
import { alertError, alertSuccess } from '@/app/utils';
import axios from 'axios';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function FaceRegister() {
  // Referencia utilizada para el elemento Webcam
  const webcamRef = useRef<Webcam>(null)
  const [legajo, setLegajo] = useState("")
  const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
    const imgBase64 = webcamRef.current?.getScreenshot()
    try {
      const faceRegister = await axios.post('/api/index-face', { docket: legajo, imageSrc: imgBase64 })
      alertSuccess(faceRegister.data)
    } catch (error: any) {
      alertError("Comuniquese con Recursos Humanos!")
    }
  }

  return (
    <main className={styles.main}>
      <form onSubmit={sendForm}>
        <input type="text" value={legajo} onChange={e => setLegajo(e.target.value)}
          placeholder='N° de legajo' required />
        <button type='submit' >Registrar</button>
      </form>
      <>
    {/* Elemento de lectura de video */}
    <Webcam
      ref={webcamRef}
      mirrored={false}
      screenshotFormat="image/jpeg"
      style={{ width: 800, height: 600, marginTop: 15 }}
      />
    </>
    </main>
  )
}