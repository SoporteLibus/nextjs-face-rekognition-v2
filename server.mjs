import {createServer} from 'https';
import next from 'next';
import fs from "fs"

const hostname ='localhost';
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync('/home/mateo/nextjs-face-rekognition-v2/cert/RootCA.key'),
  cert: fs.readFileSync('/home/mateo/nextjs-face-rekognition-v2/cert/RootCA.crt'),
  ca:[fs.readFileSync('/home/mateo/nextjs-face-rekognition-v2/cert/RootCA.pem')]
};

app.prepare().then(() => {
  createServer(options, (req, res) => {
    const parsedUrl = new URL(req.url, `https://${hostname}:${port}`);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw console.log(err);
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});