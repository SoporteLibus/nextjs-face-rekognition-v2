"use client"
import styles from './style/faceregister.module.css'
import { alertError } from '@/app/utils';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { TfiReload } from "react-icons/tfi";
import Swal from 'sweetalert2';

declare var window: any

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
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [ratio, setRatio] = useState(0)

  const videoConstraints = {
    facingMode: facingMode,
    aspectRatio: ratio
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

  useEffect(() => {
    const ratio = (innerHeight <= innerWidth) ? innerWidth / innerHeight : innerHeight / innerWidth;
    setRatio(ratio);
    setWidth(innerWidth);
    setHeight(innerHeight);
  }, [])
  
  return (
    <>
      {/* Elemento de lectura de video */}
      <Webcam
        ref={webcamRef}
        mirrored={false}
        videoConstraints={{
          ...videoConstraints,
          facingMode,
        }}
        width={width}
        height={height}
        screenshotFormat="image/jpeg"
      />
      <div className={styles.searchBox}>
        <form onSubmit={sendForm}>
          <input type="number" value={legajo} onChange={e => setLegajo(e.target.value)}
            placeholder='N° de legajo' required />
          <button type="submit">
            Cargar
          </button>
          <button type="button" onClick={() => (facingMode == "user") ? setFacingMode("environment") : setFacingMode("user")}>
            <TfiReload size={15} />
          </button>
        </form>
      </div>
    </>
  )
}