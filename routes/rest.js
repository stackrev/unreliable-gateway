const express = require("express");
const router = express.Router();

const MIN_RATELIMIT = 0;
const MAX_RATELIMIT = 3;
const FAILURE_CHANCE = 30;
const MIN_REQUEST_TIMEOUT = 1000;
const MAX_REQUEST_TIMEOUT = 40000;

let activeRequests = 0;

let greeting = null;
let person = null;

/**
 * GREETING API
 */
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

/**
 * PERSON API
 */
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

/**
 * MESSAGE API
 */
router.get("/message", async function (req, res) {
  if (!greeting || !person) {
    failCommonOperations(res, 400, "Required data not set");
  } else if (shouldItFail()) {
    failCommonOperations(res, 500, "Random failure");
  } else if (rateLimitReached()) {
    failCommonOperations(res, 429, "Rate limit reached");
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

/**
 * Common failure operations.
 *
 * @param {Response} res
 * @param {number} status
 * @param {string} statusMsg
 */
function failCommonOperations(res, status, statusMsg) {
  greeting = null;
  person = null;

  res.status(status);
  res.send(statusMsg);
}

/**
 * Test if the random rate limit was reached.
 * @returns {bool} true or false.
 */
function rateLimitReached() {
  const currentRate = Math.floor(Math.random() * MAX_RATELIMIT) + MIN_RATELIMIT;

  return activeRequests > currentRate;
}

/**
 * Test if a random server failure ought to happen.
 * @returns {bool} true or false.
 */
function shouldItFail() {
  let failRoll = Math.floor(Math.random() * 100);

  return failRoll < FAILURE_CHANCE;
}

/**
 * Wrap the callback which runs an API request with a random delay.
 * @param {*} cbFunction A callback function
 * @returns {*} Whatever the callback returns.
 */
async function timeDelayedResponse(cbFunction) {
  let RESP_JSON = null;

  let randomDelayMS =
    Math.floor(Math.random() * MAX_REQUEST_TIMEOUT) + MIN_REQUEST_TIMEOUT;
  console.log(`Time delay for this call is: ${randomDelayMS}`);

  await new Promise((resolve) => setTimeout(resolve, randomDelayMS));
  if (cbFunction !== null) {
    RESP_JSON = cbFunction();
  }

  return RESP_JSON;
}

module.exports = router;
