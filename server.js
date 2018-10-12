const PORT = 4200;
const HOST = '10.0.0.118';

const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const express = require('express');
const request = require('request');
const path = require('path');

const app = express();
let udp = require('udp-packet')
let StringDecoder = require('string_decoder').StringDecoder;

app.listen(4200, function() {
  console.log(`listening on port ${PORT}`)
});

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname + '/app/index.html'));
});

app.get(`/app.js`, (req, res) => {
  res.sendFile(path.join(__dirname + '/app/app.js'));
});

app.get(`/styles.css`, (req, res) => {
  res.sendFile(path.join(__dirname + '/app/styles.css'));
});

server.on('listening', function () {
  let address = server.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
  const raceIsOn = message.slice(0, 4).readInt8(0);
  if (raceIsOn) {

    const rpmMax = message.slice(8, 12).readFloatLE(0);
    const rpmIdle = message.slice(12, 16).readFloatLE(0);
    const rpmCurrent = message.slice(16, 20).readFloatLE(0);

    console.log(rpmCurrent, rpmIdle, rpmMax);

  }
});

server.bind(PORT, HOST);