# Time for Chaos!

![chaosgorilla](./chaos.jpg)

## How it works

This is an unreliable API Server that can be used in code challenges and tests to see how participants would deal with an unreliable service.

The servers' happy path is:
1. POST a greeting, e.g. hello
2. POST a Name and optionally Surname, e.g. Adam
3. GET a greeting, Hello Adam.  

But it comes with these challenges:
- Every request (POST or GET) suffers from a potential delay of 1-40 seconds.
- Every request has a 40% chance of failing. If one of the POSTs fails, the result of the other successful POST will be cancelled and the GET will fail.
- The server has a random rate limit of 0-3.

## Challenges

- Can we throttle our requests.
- How can we handle ordered requests.
- Can we timeout.
- Can we retry without failing.


# Technical Test OpenAPI - unreliable server.

## Path Table

| Method | Path                       | Description          |
| ------ | -------------------------- | -------------------- |
| POST   | [/greeting](#postgreeting) | The greeting to use. |
| GET    | [/message](#getmessage)    | The built message.   |
| POST   | [/person](#postperson)     | The person to greet. |

## Reference Table

| Name | Path | Description |
| ---- | ---- | ----------- |

## Path Details

***

### [POST]/greeting

The greeting to use.

#### RequestBody

- application/json

```ts
{
greeting_str: string
}
```

#### Responses

- 200 OK
- 400 Bad request or wrong order.
- 429 Rate limit reached.
- 500 An Internal error.

***

### [GET]/message

The built message.

#### Responses

- 200 A JSON object containing user's greeting message.
- 400 Required data not available.
- 429 Rate limit reached.
- 500 An Internal error.

`application/json`

```ts
{
message_str?: string
}
```

- 429 Rate limit reached.

- 500 An Internal error.

***

### [POST]/person

The person to greet.

#### RequestBody

- application/json

```ts
{
firstname_str: string
lastname_str?: string
}
```

#### Responses

- 200 OK
- 400 Bad request or wrong order.
- 429 Rate limit reached.
- 500 An Internal error.

