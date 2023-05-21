import { RekognitionClient, SearchFacesByImageCommand } from "@aws-sdk/client-rekognition";
import axios from "axios";
// import { cookies } from 'next/headers';

// Credenciales globales para la configuracion de AWS
const client = new RekognitionClient({
  credentials: {
    accessKeyId: `${process.env.ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`
  },
  region: `${process.env.REGION}`
});

// Nombre de la coleccion
const collection = `${process.env.COLLECTION_NAME}`

async function fetchData(object: string) {
  // const nextCookies = cookies()
  // const token = nextCookies.get('token')
  // console.log("cookie>>>",token?.value)
  const res = await axios.put(`http://172.18.6.138:5005/api/v1/rrhh/empleados/fichar/${object}`)
    .then(response => response.data)
    .catch(error => error)
  return res
}

/* Funcion para la busqueda de un rostro ya registrado
en la DB de Azure rekognition */
export async function POST(request: Request) {
  const { imageSrc }: any | null | string = await request.json();
  if (imageSrc) {
    console.log("Comienzo de api search")
    // Se elimina la primera parte del string en base64 
    const base64Img = imageSrc.replace('data:image/jpeg;base64,', '');
    // Se transforma a binario para enviarlo como parametro a la api
    const imgBuffer = Buffer.from(base64Img, 'base64');
    // Se busca entre los rostros registrados
    const params = {
      // Coleccion de rostros registrados
      CollectionId: collection,
      // Imagen tomada en tiempo real pasada de base64 a binario
      Image: {
        Bytes: imgBuffer,
      },
      // Devuelve la respuesta si hay como minimo un 70% de coinsidencia
      // FaceMatchThreshold: 70,
      // Maximo de coinsidencias a mostrar
      MaxFaces: 1
    }
    const command = new SearchFacesByImageCommand(params);
    const resp = await client.send(command)
      .then(data => {
        // Si la consulta se realiza con exito, devuelve un objeto con:
        // La similitud en la busqueda, el id de rostro, el legajo y la fecha.
        if (data.FaceMatches) {
          console.log("respApiSearch>>>",data)
          const id = `${data.FaceMatches[0].Face?.FaceId}`
          const similarity = `${data.FaceMatches[0].Similarity}`
          const docket = `${data.FaceMatches[0].Face?.ExternalImageId}`
          const date = new Date()
          const toDay = date.toLocaleString()
          return { id, similarity, toDay, docket }
        }
      })
      .catch(error => console.log(error))
    const { id, similarity, toDay, docket }: any = resp
    const fetch = await fetchData(docket)
    const { nombre }: any = fetch
    if (id && similarity && toDay && nombre && docket) {
      return new Response(JSON.stringify({
        name: `${nombre}`,
        similarity: similarity,
        docket: `${docket}`,
        id: id,
        date: `${toDay}`
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      })
    } else {
      return new Response(JSON.stringify({
        error: fetch
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      })
    }
  } else {
  return new Response(JSON.stringify({
      error: 'Unauthorized',
    }),
    {
      status: 403,
      headers: {
        'content-type': 'application/json',
      },
    })
  }
}