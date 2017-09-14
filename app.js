const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let drivers = {
  "some_id": {
    name: "Alpha Tester",
    availability: 0, //0 = offline, 1 = online but not busy, 2 = busy
    latitude: 0,
    longitude: 0,
    jobs: []
  }
}

let jobs = [];

io.on('connection', (socket) => {
  socket.on('update_driver_location', (driver_data) => {
    const {id, longitude, latitude} = driver_data;
    drivers[id].longitude = longitude;
    drivers[id].latitude = latitude;
    console.log('drivers[id] =', JSON.stringify(drivers[id], null, 3));
    io.sockets.emit('update_map', drivers[id]);
  })
})

app.post('/addJob', (req, res) => {
  const {long, lat} = req.body;
  let id = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 64; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  jobs.push({id: text, longitude: long, latitude: lat})
  res.json({id: text});
});

app.post('/removeJob', (req, res) => {
  const {id} = req.query;
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].id === id) {
      jobs.splice(i, 1);
      break;
    }
  }
});

app.post('/driverOnline', (req, res) => {
  const {id, longitude, latitude} = req.body;
  console.log('id =', id);
  console.log('longitude =', longitude);
  console.log('latitude =', latitude);
  if (drivers[id]) {
    drivers[id].longitude = longitude;
    drivers[id].latitude = latitude;
    drivers[id].availability = 1;
    console.log(JSON.stringify(drivers, null, 3));
    io.sockets.emit('update_map', drivers[id]);
    res.status(200);
  } else {
    res.status(403);
  }
});

app.post('/driverOffline', (req, res) => {
  const {id} = req.body;
  console.log('id =', id);
  if (drivers[id]) {
    drivers[id].availability = 0;
    console.log(JSON.stringify(drivers, null, 3));
    io.sockets.emit('update_map', drivers[id]);
    res.status(200);
  } else {
    res.status(403);
  }
})

app.get('/test', (req, res) => {})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

http.listen(80, () => {
  console.log('Listening on port 80.');
})
