# TechnicalTest

> Version 1.0.0

Technical Test - unreliable server.

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| POST | [/greeting](#postgreeting) | The greeting to use. |
| GET | [/message](#getmessage) | The built message. |
| POST | [/person](#postperson) | The person to greet. |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |

## Path Details

***

### [POST]/greeting

- Summary  
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

- Summary  
The built message.

#### Responses

- 200 A JSON object containing user's greeting message.

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

- Summary  
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

## References