const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path')

require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
app.set('port', (process.env.PORT || 5000))
const io = require('socket.io')(http)

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const rollsRouter = require('./routes/rolls');

app.use('api/rolls', rollsRouter);

const RollContainer = require('./models/rollContainer')

io.on('connection', (socket) => {
    console.log('a user connected')

    RollContainer.find().sort({createdAt: -1}).limit(10).exec((err, rolls) => {
      if (err) return console.error("erroras: "+err);
  
      socket.emit('init', rolls.reverse());
    });
  
    socket.on('roll', (rll) => {
      const rollContainer = new RollContainer({
        username: rll.username,
        description: rll.description,
        date: rll.date,
        result: rll.result,
        bonus: rll.bonus,
        R: rll.R,
        G: rll.G,
        B: rll.B,
        rolls: rll.rolls
      });
  
      rollContainer.save((err) => {
        if (err) return console.error(err);
      });
  
      socket.broadcast.emit('push', rll);
    });
});

app.use(express.static(path.join(__dirname, 'client/build')));

if(process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
}

http.listen(app.get('port'), () => {
  console.log(`listening on ${app.get('port')}`);
});