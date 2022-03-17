const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const User = require('./models/Users');
const Session = require('./models/Sessions');

const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.post('/api/users', (request, response) => {
  let newUser = new User({ username: request.body.username });

  newUser.save((error, savedUser) => {
    if (!error) {
      let responseObject = {};
      responseObject['username'] = savedUser.username;
      responseObject['_id'] = savedUser.id;
      response.status(200).json(responseObject);
    } else {
      response.status(400).send(error);
    }
  });
});

app.get('/api/users', (request, response) => {
  User.find({}, (error, arrayOfUsers) => {
    if (!error) {
      response.status(200).json(arrayOfUsers);
    } else {
      response.status(400).send(error);
    }
  });
});

app.post('/api/users/:_id/exercises', (request, response) => {
  let newSession = new Session({
    description: request.body.description,
    duration: parseInt(request.body.duration),
    date: request.body.date,
  });

  if (newSession.date === '') {
    newSession.date = new Date().toISOString().substring(0, 10);
  }

  let id = request.params._id;
  User.findOne({ _id: id }, function (err, result) {
    if (!result) response.send(`${id} is not found`);
    else {
      result.log.push(newSession);
      response.json({
        _id: id,
        username: result.username,
        duration: newSession.duration,
        date: newSession.date,
        description: newSession.description,
      });
      result.save();
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
