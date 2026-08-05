import localtunnel from 'localtunnel';
import fs from 'fs';

const tunnel = await localtunnel({ port: 3000 });
fs.writeFileSync('tunnel.txt', tunnel.url);
console.log('Tunnel started at', tunnel.url);
