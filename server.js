const express = require('express');
const axios = require('axios');
const { meow, slackConf } = require('./index');

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.post('/slack', function(req, res) {
  if (slackConf) {
    const { body } = req;
    switch (body.command) {
      case '/pet':
        meow('purr');
        break;
      case '/feed-cat':
        meow('ZZZZzzzz...');
        break;
      case '/pic':
        axios
          .get('https://api.thecatapi.com/v1/images/search?size=full')
          .then(data => {
            meow(data.data[0].url);
          });
        break;
      default:
        break;
    }
    res.sendStatus(200);
  } else {
    res.status(400).send('Ignore this request.');
  }
});

app.listen(3000);
