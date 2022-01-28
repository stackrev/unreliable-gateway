const express = require("express");
const router = express.Router();

let activeRequests = 0;

let greeting = null;
let person = null;

router.post("/greeting", async function (req, res) {
  if (shouldItFail()) {
    console.log(`This call will fail`);
    res.status(500);
    res.send("Random failure");
  } else if (rateLimitReached()) {
    console.log(`This call reached its ratelimit`);
    res.status(429);
    res.send("Rate limit reached");
  } else {
    activeRequests++;
    const ok = await timeDelayedResponse(() => {
      console.log(JSON.stringify(req.body, null, 2));
      greeting = req.body?.greeting_str;
      return "ok";
    });
    activeRequests--;

    res.send(ok);
  }
});

router.post("/person", async function (req, res) {
  if (shouldItFail()) {
    console.log(`This call will fail`);
    res.status(500);
    res.send("Random failure");
  } else if (rateLimitReached()) {
    console.log(`This call reached its ratelimit`);
    res.status(429);
    res.send("Rate limit reached");
  } else {
    activeRequests++;
    const ok = await timeDelayedResponse(() => {
      person = req.body;
      return "ok";
    });
    activeRequests--;

    res.send(ok);
  }
});

router.get("/message", async function (req, res) {
  if (!greeting || person) {
    res.status(400);
    res.send("Required data not set");
  }
  if (shouldItFail()) {
    console.log(`This call will fail`);
    res.status(500);
    res.send("Random failure");
  } else if (rateLimitReached()) {
    console.log(`This call reached its ratelimit`);
    res.status(429);
    res.send("Rate limit reached");
  } else {
    activeRequests++;
    const resJSON = await timeDelayedResponse(() => {
      return {
        message_str: `${greeting} ${person?.firstname_str} ${person?.lastname_str}`,
      };
    });
    activeRequests--;

    res.send(resJSON);
  }
});

function rateLimitReached() {
  const MAX_REQUESTS = 1;

  return activeRequests > MAX_REQUESTS;
}

function shouldItFail() {
  const FAILURE_CHANCE = 30;

  let failRoll = Math.floor(Math.random() * 100);

  return failRoll < FAILURE_CHANCE;
}

async function timeDelayedResponse(cbFunction) {
  const MIN_MS = 1000;
  const MAX_MS = 10000;
  let RESP_JSON = null;

  let randomDelayMS = Math.floor(Math.random() * MAX_MS) + MIN_MS;
  console.log(`Time delay for this call is: ${randomDelayMS}`);

  await new Promise((resolve) => setTimeout(resolve, randomDelayMS));
  if (cbFunction !== null) {
    RESP_JSON = cbFunction();
  }

  return RESP_JSON;
}

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

module.exports = router;
