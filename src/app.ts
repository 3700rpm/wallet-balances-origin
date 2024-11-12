import express from 'express';
import http from 'http'
import router from './routes';
import ws from 'ws';
import { iniWebsocket } from './websocket';
import cors from 'cors'; // Import cors

const app = express();

app.use(cors());

app.use(router);

const server = http.createServer(app);
iniWebsocket(server);

server.listen(3000, () => {
    console.log('Server started');
})
