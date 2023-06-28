"use client"
import styles from './style/faceregister.module.css'
import { alertError, alertSuccess } from '@/app/utils';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { TfiReload } from "react-icons/tfi";
import Swal from 'sweetalert2';

export interface UserApi {
  name: string,
  similarity: string,
  docket: string,
  id: string,
  date: string
}

export default function FaceRegister() {
  // Referencia utilizada para el elemento Webcam
  const webcamRef = useRef<Webcam>(null)
  const [legajo, setLegajo] = useState("")
  const [facingMode, setFacingMode] = useState("user");

  const videoConstraints = {
    facingMode: facingMode
  };

  const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const imgBase64 = webcamRef.current?.getScreenshot()
    await axios.post('/api/index-face', { docket: legajo, imageSrc: imgBase64 })
      .then((response: any) => Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Validado!',
        text: response.data.message,
        showConfirmButton: false,
        timer: 5500
      }))
      .catch(error => {
        alertError(`${error.data.error} Comuniquese con Recursos Humanos!`)
      })
  }

  return (
    <main className={styles.main}>
      <div className={styles.searchBox}>
        <form onSubmit={sendForm}>
          <input type="text" value={legajo} onChange={e => setLegajo(e.target.value)}
            placeholder='N° de legajo' required />
          <button type="submit">
            Cargar
          </button>
          <button type="button" onClick={() => (facingMode == "user") ? setFacingMode("environment") : setFacingMode("user")}>
            <TfiReload size={15} />
          </button>
        </form>
      </div>
      <>
        {/* Elemento de lectura de video */}
        <Webcam
          ref={webcamRef}
          mirrored={false}
          allowFullScreen={true}
          videoConstraints={{
            ...videoConstraints,
            facingMode
          }}
          screenshotFormat="image/jpeg"
          style={{ width: 800, height: 600, marginTop: 15 }}
          />
    </>
    </main>
  )
}