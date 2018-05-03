const express = require('express');
const bodyParser = require('body-parser');
const {actionssdk, BasicCard} = require('actions-on-google');
const requestPromise = require('request-promise');
const app = actionssdk({debug: true});
const port = process.env.PORT || 5000;
// fulfillment code here
app.intent('actions.intent.MAIN', (conv) => {
  conv.ask('<speak><audio src="https://www.xeno-canto.org/383544/download"/>' +
    'I can play you a birdsong <break time="1"/>' +
    'Say a bird species and I\'ll play it for you, or say bye to cancel</speak>');
});

const getRandomArrayElement = (items) => {
  return items[Math.floor(Math.random()*items.length)];
}

app.intent('actions.intent.TEXT', (conv, input) => {
  if (input === 'bye') {
    return conv.close('Goodbye!');
  }
  let url = `https://www.xeno-canto.org/api/2/recordings?query=${encodeURIComponent(input)}%20type:song+cnt%3A"United+Kingdom"`;
  return requestPromise(url).then((body) => {
    let parsedBody = JSON.parse(body);
      console.log('Got response back from api');
        let recordings = parsedBody.recordings;

        if (!recordings || recordings.length == 0) {
          console.log('No recordings found');
          conv.ask('Sorry, I couldn\'t find any recordings of ' +
          `${input}. `);
            return conv.close('Goodbye');
        }
      
        let randomRecording = getRandomArrayElement(recordings);
        let recordingUrl = `https://www.xeno-canto.org/${randomRecording.id}/download`;
        conv.ask(new BasicCard({
          text: `the recording you're listening to was recorded by ${randomRecording.rec} at ${loc} in ${cnt} on ${randomRecording.date}`, // Note the two spaces before '\n' required for
                                       // a line break to be rendered in the card.
          title: `${input}`,
          buttons: new Button({
            title: 'See full recording details on xeno-canto.org',
            url: randomRecording.url,
          })
        }));
  conv.ask(`<speak>Here is a ${input} for you, courtesy of ${randomRecording.rec} and Xeno-Canto.org <audio src="${recordingUrl}"></audio></speak>`);      
  return conv.close('That\'s all folks!');
  });
});

express().use(bodyParser.json(), app).listen(port);