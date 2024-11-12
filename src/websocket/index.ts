import WebSocket from "ws";
import http from 'http';

class WssGlobal {
    wss: WebSocket.Server
    constructor (wss: WebSocket.Server) {
        this.wss = wss;
    }
}
const iniWebsocket = (server: http.Server) => {
    const wss = new WebSocket.Server({
        server
    });

    return;
}

export {
    iniWebsocket,
}