// /httpdocs/app.js
const next = require('next');
const http = require('http');
 
const port = process.env.PORT || 3000;   // Plesk/Passenger PORT atar
const dev = false;                       // production
const app = next({ dev });
const handle = app.getRequestHandler();
 
app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(port);
}).catch(() => {
  process.exit(1);
});
