const WebSocket = require('ws');
const crypto = require('crypto');

const wss = new WebSocket.Server({ port: 7171, path: '/cursor' });
const clients = new Map();

wss.on('headers', (headers, req) => {
  headers.push(`Access-Control-Allow-Origin: lunalux.io`);
});

wss.on('connection', (ws) => {
  const id = crypto.randomUUID();
  const color = Math.floor(Math.random() * 360);
  let path = "";
  const metadata = { id, color, path};

  clients.set(ws, metadata);
  console.log(`WebSocket connection established: ${clients.size} clients`);

  ws.on('message', (messageAsString) => {
    const message = JSON.parse(messageAsString);
    const metadata = clients.get(ws);

    metadata.path = message.path;

    message.sender = metadata.id;
    message.color = metadata.color;

    const outbound = JSON.stringify(message);

    [...clients.keys()].forEach((client) => {
      // don't show own cursor
      if (client === ws) {
        return;
      }

      // only show cursors from the same page
      // todo delete cursor when path changes
      if (clients.get(client).path == message.path) {
        client.send(outbound);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`WebSocket connection closed: ${clients.size} clients`);
  });
});

wss.onerror = (error) => {
  console.error('Websocket error:', error);
};