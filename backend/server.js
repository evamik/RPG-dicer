const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const rollsRouter = require('./routes/rolls');

app.use('/rolls', rollsRouter);

const Roll = require('./models/roll')

io.on('connection', (socket) => {

    Roll.find().sort({createdAt: -1}).limit(10).exec((err, rolls) => {
      if (err) return console.error(err);
  
      socket.emit('init', rolls.reverse());
    });
  
    socket.on('roll', (rll) => {
      const roll = new Roll({
        username: rll.username,
        description: rll.description,
        rollCount: rll.rollCount,
        rollSize: rll.rollSize,
        rollResult: rll.rollResult,
        date: rll.date,
        R: rll.R,
        G: rll.G,
        B: rll.B
      });
  
      roll.save((err) => {
        if (err) return console.error(err);
      });
  
      socket.broadcast.emit('push', rll);
    });
});
  
http.listen(port, () => {
    console.log('listening on *:' + port);
});

