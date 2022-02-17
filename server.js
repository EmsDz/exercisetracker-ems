const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

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

let exerciseSessionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String,
});

let userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [exerciseSessionSchema],
});

let Session = mongoose.model('Session', exerciseSessionSchema);
let User = mongoose.model('User', userSchema);

app.post('/api/users', (request, response) => {
  let newUser = new User({ username: request.body.username });

  newUser.save((error, savedUser) => {
    if (!error) {
      let responseObject = {};
      responseObject['username'] = savedUser.username;
      responseObject['_id'] = savedUser.id;
      response.json(responseObject);
    }
  });
});

app.get('/api/users', (request, response) => {
  User.find({}, (error, arrayOfUsers) => {
    if (!error) {
      response.json(arrayOfUsers);
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
