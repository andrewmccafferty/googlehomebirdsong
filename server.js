var express     = require('express');
var bodyParser  = require('body-parser');

var app         = express(); // Please do not remove this line, since CLI uses this line as guidance to import new controllers
const { actionssdk } = require('actions-on-google');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});

app.post('/api/birdsong', (req, res) => {
  const app = actionssdk()
  app.handleRequest(function(){
    app.intent('actions.intent.MAIN', (conv) => {
      conv.ask('<speak>Hi! <break time="1"/> ' +
        'I can play you a birdsong ' +
        'like Blackbird. Say a bird species and I\'ll play it for you.</speak>');
    });
  });
});