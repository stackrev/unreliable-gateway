var express = require('express');
var router = express.Router();

let activeRequests = 0;

router.get('/', async function(req, res, next) {
  if (shouldItFail()){
    console.log(`This call will fail`);
    res.status(500);
    res.send("Random failure");
  }
  else if (rateLimitReached()){
    console.log(`This call reached its ratelimit`);
    res.status(429);
    res.send("Rate limit reached");
  }
  else{
    activeRequests++;
    const resJSON = await getTimeDelayedResponse();
    activeRequests--;

    res.send(resJSON);
  }
})

function rateLimitReached(){
  const MAX_REQUESTS = 1;

  return activeRequests > MAX_REQUESTS;
}

function shouldItFail(){
  const FAILURE_CHANCE = 30;
  
  let failRoll = Math.floor(Math.random() * 100);

  return failRoll < FAILURE_CHANCE;
}

async function getTimeDelayedResponse(){
  const MIN_MS = 1000;
  const MAX_MS = 10000;
  const RESP_JSON = {'text': 'Hello World'};

  let randomDelayMS = Math.floor(Math.random() * MAX_MS) + MIN_MS;
  console.log(`Time delay for this call is: ${randomDelayMS}`);

  await new Promise(resolve => setTimeout(resolve, randomDelayMS));

  return RESP_JSON
}


module.exports = router;
