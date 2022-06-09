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



app.get('/api/users/:_id/logs', (request, response) => {
  User.findById(req.params._id, (error, result) => {
    if (!error) {
      let responseObject = result;

      if (request.query.from || request.query.to) {
        let fromDate = new Date(0);
        let toDate = new Date();

        if (request.query.from) {
          fromDate = new Date(request.query.from);
        }

        if (request.query.to) {
          toDate = new Date(request.query.to);
        }

        fromDate = fromDate.getTime();
        toDate = toDate.getTime();

        responseObject.log = responseObject.log.filter((session) => {
          let sessionDate = new Date(session.date).getTime();

          return sessionDate >= fromDate && sessionDate <= toDate;
        });
      }

      if (request.query.limit) {
        responseObject.log = responseObject.log.slice(0, request.query.limit);
      }

      responseObject = responseObject.toJSON();
      responseObject['count'] = result.log.length;
      response.json(responseObject);
    }
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
