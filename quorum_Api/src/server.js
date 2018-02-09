import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import moment from 'moment-timezone';
import { quorumInterface } from '../../blockchain';

process.on('unhandledRejection', function(reason, p) {
  console.error('Unhandled Rejection:', p, '\nreason:', reason.stack || reason);
});

const WEB_SERVER_PORT = process.env.SERVER_PORT || 8181;

const app = express();

// --- JSON ---
// app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
// app.use(bodyParser.json({ limit: '2mb' }));

// --- plaintext ---
app.use(bodyParser.text({ type: '*/*' }));

app.post('/send_all/:seq', (req, res) => {
  var seq = req.params.seq;
  var data = req.body;
  quorumInterface.createTransaction(seq, data);
  res.send('Success');
});

app.post('/send_idp/:seq', (req, res) => {
  var seq = req.params.seq;
  var data = req.body;
  quorumInterface.createTransaction(seq, data);
  res.send('Success');
});

const server = http.createServer(app);
server.listen(WEB_SERVER_PORT);

console.log(
  `Quorum RESTful API is running. Listening to port ${WEB_SERVER_PORT}`
);
