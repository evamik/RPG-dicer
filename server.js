const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path')
const moment = require('moment')

require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
app.set('port', (process.env.PORT || 5000))
const io = require('socket.io')(http)

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const rollsRouter = require('./routes/rolls');

app.use('api/rolls', rollsRouter);

const RollContainer = require('./models/rollContainer')
const InitiativeReset = require('./models/initiativeReset')

io.on('connection', (socket) => {
    console.log(socket.id + ' connected')

    RollContainer.find().sort({createdAt: -1}).limit(10).exec((err, rolls) => {
      if (err) return console.error(err);
  
      socket.emit('init', rolls.reverse());
      resetInitiative('2020-03-28')
    });

    function resetInitiative(date){
      InitiativeReset.find().sort({createdAt: -1}).limit(4).exec((err, el) =>{
        if (err) return console.error(err)

        let endDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')

        if(el.length !== 0) date = el[0].date

        RollContainer.find({ createdAt: { $gte: date, $lte: endDate}, description: "initiative"}).sort({ createdAt: 1}).exec((err, rolls) => {
          if(err) return console.error(err)
    
          socket.emit('initiative', {rolls: rolls, date: date})
        })
      })
    }
    
    socket.on('resetInitiative', (date) => {
      const datetime = moment(date).format('YYYY-MM-DDTHH:mm:ss')
      const initiativeReset = new InitiativeReset({
        date: datetime
      })
      initiativeReset.save((err) => {
        if (err) return console.error(err);
        resetInitiative(datetime)
      })
    })

    socket.on('removeRoll', (rll) => {
      let rolls = [rll, '']
      RollContainer.aggregate([
        { $sort: {"createdAt": -1}},
        { $limit: 10},
        { $sort: {"createdAt": 1}},
        { $limit: 1},
      ]).exec((err, roll) => {
        if(err) return console.log(err)
        rolls[1] = roll[0]
        RollContainer.estimatedDocumentCount().exec((err, count) => {
          if(err) console.log(err)
          console.log(count)

          if(count < 10)
          rolls[1] = ""
        
          RollContainer.findByIdAndRemove(rll._id, (err, roll) =>{
            if(err) return console.error(err)
          
            io.emit('removeAndAdd', rolls)
          })
        })
      })
    })
  
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

    socket.on('disconnect', () => {
      socket.disconnect()
      console.log(socket.id + " disconnected")
    })
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