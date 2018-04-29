const express = require('express');
const bodyParser = require('body-parser');
const {actionssdk} = require('actions-on-google');
const requestPromise = require('request-promise');
const app = actionssdk({debug: true});
const port = process.env.PORT || 5000;
// fulfillment code here
app.intent('actions.intent.MAIN', (conv) => {
  conv.ask('<speak>Tweet! <break time="1"/> ' +
    'I can play you a birdsong ' +
    'Say a bird species and I\'ll play it for you.</speak>');
});

const getRandomArrayElement = (items) => {
  return items[Math.floor(Math.random()*items.length)];
}

app.intent('actions.intent.TEXT', (conv, input) => {
  if (input === 'bye') {
    return conv.close('Goodbye!');
  }
  let url = `https://www.xeno-canto.org/api/2/recordings?query=${encodeURIComponent(input)}%20type:song`;
  return requestPromise(url).then((body) => {
    let parsedBody = JSON.parse(body);
      console.log('Got response back from api');
        let recordings = parsedBody.recordings;

        if (!recordings || recordings.length == 0) {
          console.log('No recordings found');
          conv.ask('<speak>Sorry, I couldn\'t find any recordings of , ' +
          `${input}. `);
            return conv.close('Goodbye');
        }
      
        let randomRecording = getRandomArrayElement(recordings);
        let recordingUrl = `https://www.xeno-canto.org/${randomRecording.id}/download`;
        console.log(`Playing recording {${randomRecording.id}}`);
        conv.ask(`<speak>Here is a ${input} for you <audio src="${recordingUrl}"></audio></speak>`);
  });
});

express().use(bodyParser.json(), app).listen(port);