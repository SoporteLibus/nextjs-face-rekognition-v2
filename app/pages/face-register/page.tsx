"use client"
import styles from './style/faceregister.module.css'
import { alertError, alertSuccess } from '@/app/utils';
import axios from 'axios';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { BiSearch } from "react-icons/bi";

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
      <div className={styles.searchBox}>
        <form onSubmit={sendForm}>
          <input type="text" value={legajo} onChange={e => setLegajo(e.target.value)}
            placeholder='N° de legajo' required />
          <button style={{ border: "none", cursor: "pointer" }}
            type="submit">
            <BiSearch size={20} />
          </button>
        </form>
      </div>
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