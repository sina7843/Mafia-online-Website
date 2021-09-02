const fs = require('fs');
const { PeerServer } = require('peer');

const peerServer = PeerServer({
   host: 'sinakhalegha.ir',
   port: '3004',
   secure: true,
   ssl: {
      key: fs.readFileSync('/etc/letsencrypt/live/sinakhalegha.ir/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/sinakhalegha.ir/fullchain.pem')
   }
});