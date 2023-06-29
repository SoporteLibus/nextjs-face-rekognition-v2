"use client"
import React, { useRef, useEffect } from 'react'
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';
import Webcam from "react-webcam";
import { MediaPipeFaceMeshTfjsModelConfig, FaceLandmarksDetector } from '@tensorflow-models/face-landmarks-detection';
import axios from 'axios';
import { alertError, alertSuccess } from '@/app/utils';

export default function FaceDetect() {
  // Referencia utilizada para el elemento Webcam
  const webcamRef = useRef<any>(null);
  // Referencia utilizada para el elemento cambas
  const canvasRef = useRef<any>(null);
  // Variables utilizadas como banderas (Como si fueran BOOLEAN)
  let request = 0;
  let estado = 0;
  let count = 0;
  // const windowWidth: any = window.innerWidth
  // const windowHeight: any = window.innerHeight

  // Funcion principal iniciada en el useEffect
  const runFaceLandmark = async () => {
    // Importacion dinamica de la libreria de tensorflow para la descripcion de un rostro en una imagen
    const faceLandmarksDetection = (await import("@tensorflow-models/face-landmarks-detection"));
    // Se carga el modelo por defecto
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    // Se carga su configuracion
    const detectorConfig: MediaPipeFaceMeshTfjsModelConfig = {
      runtime: 'tfjs', // o 'mediapipe'
      refineLandmarks: false
    }
    // Se carga el detector con el modelo y la configuracion ya definida anteriormente
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    // Se llama a la funcion detect cada 10 milisegundos y se le pasa la constante detector
    setInterval(() => {
      detect(detector)
    }, 10);
  }
  
  // Esta funcion es la encargada de la lectura y señalizacion de la posicion del rostro
  const detect = async (detector: FaceLandmarksDetector) => {
    // Si la referencia a Webcam no esta vacia
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Obtener las propiedades de video
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      const screenShot = webcamRef?.current?.getScreenshot();

      // Se establece el tamaño de video
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Se establece el tamaño del canvas
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Crea la deteccion y toma la imagen de video del elemento Webcam
      const faces = await detector.estimateFaces(video);
      const face = faces[0]
      
      // Si se detecta un rostro
      if (faces.length === 1) {
        // Se comprueba los parametros en tiempo real de la nariz
        const nariz = face.keypoints[60].y - face.keypoints[79].y
        
        // Si el sostro es detectado 47 veces
        if (estado <= 47) {
          // Se inicia el contador en 0
          count -= count
          // count es igualado a la variable estado (la primera vez será 0)
          count += estado
          // La variable estado es reiniciada a 0
          estado -= estado
          // A la variable estado se le suma 1
          estado += count + 1
        }
        /* Si el rostro es leido correctamente 20 veces , los parametros son 
        los indicados y la consulta a la api de AWS aun no se realizo */
        if (estado > 20 && nariz > 6 && request === 0) {
          // La consulta ya fue realizada
          request += 1
          // Se inicia la busqueda en la coleccion de rostros registrados en la DB
          await axios.post("/api/search-face/", { imageSrc: screenShot })
            .then(response => alertSuccess(response.data))
            .catch(error => {
              error.response.data.error ? alertError(error.response.data.error + `, Comunicate con RRHH`) : alertError("Comunicate con RRHH")
            })
        }
      } else {
        // Si no se detecta ningun rostro se resetea la variable estado
        estado -= estado
      }
      // Si no se detecta ningun rostro y ya se realizo la consulta a la api
      if (estado === 0 && request === 1) {
        // Se reinicia a 0 la variable request
        request -= 1
        // Se reinicia a 0 la variable estado
        estado -= estado
      }

      // Funcion para dibujar el recuadro del rostro con canvas
      const drawMesh = (faces: any, ctxs: any) => {
        faces.forEach((element: any) => {
          // Comienzo de la estructura a visualizar en el canvas
          ctxs.beginPath();
          // Grosor de la linea
          ctxs.lineWidth = 4;
          // Color
          (request == 0) ? ctxs.strokeStyle = "red" : ctxs.strokeStyle = "green";
          // Puntos de referencia a dibujar
          ctxs.rect(
            element.box.xMin,
            element.box.yMin,
            element.box.xMax - element.box.xMin,
            element.box.yMax - element.box.yMin
          );
          // Dibujar el contorno en el lienzo
          ctxs.stroke();
        });
      }
      
      // Obtencion del contexto de canvas
      const ctx = canvasRef.current.getContext("2d");
      // Se toman los parametros del rostro y luego se los pasa al canvas 
      requestAnimationFrame(() => { drawMesh(faces, ctx) });
    }
  }

  // La funcion principal es iniciada al cargar la pagina
  useEffect(() => {
    runFaceLandmark()
  }, []);

  return (
    <>
    {/* Elemento de lectura de video */}
    <Webcam
      ref={webcamRef}
      mirrored={false}
      screenshotFormat="image/jpeg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        textAlign: "center",
        zIndex: 999,
        width: "100vw",
        height: "100vh",
        backgroundColor: "Gray"
      }}
      />
      {/* Elemento de recuadro de rostro */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          textAlign: "center",
          zIndex: 999,
          width: "100vw",
          height: "100vh"
        }}
      />
    </>
  )
}