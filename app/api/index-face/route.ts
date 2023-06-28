import { RekognitionClient, IndexFacesCommand } from "@aws-sdk/client-rekognition";


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

/* Funcion para la busqueda de un rostro ya registrado
en la DB de Azure rekognition */
export async function POST(request: Request) {
  const { docket, imageSrc }: any | null | string = await request.json();
  if (imageSrc && docket) {
  console.log("Comenzando registro de rostro...")
  // Se elimina la primera parte del string en base64 
  const base64Img = imageSrc.replace('data:image/jpeg;base64,', '');
  // Se transforma a binario para enviarlo como parametro a la api
  const imgBuffer = Buffer.from(base64Img, 'base64');
  // Se registra un rostro
  const params = {
    CollectionId: collection,
    ExternalImageId: docket,
    Image: {
      Bytes: imgBuffer,
    },
  }
  const command = new IndexFacesCommand(params);
  const resp = await client.send(command)
    .then(data => data)
    .catch((error) => error)
  console.log(resp)
  if (resp.FaceRecords) {
    console.log("Rostro registrado con exito!")
    return new Response(JSON.stringify({
      message: "Rostro Registrado con exito!"
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
  } else {
    console.log("Error en el registro del rostro!")

    return new Response(JSON.stringify({
      error: "No se pudo registrar el rostro!"
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
      error: 'Falta parametro en el cuerpo del mensaje!',
    }),
    {
      status: 400,
      headers: {
        'content-type': 'application/json',
      },
    })
  }
}