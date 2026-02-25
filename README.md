# Scrappey Captcha Wrapper API (Anti-Captcha Style)

Use this API exactly like common anti-captcha providers: create a task, then poll for result.

## Base URL

- Domain: `https://captcha.scrappey.com`

## Pricing

- Base price: **1 EUR per 1000 requests**
- Volume pricing: **the more you buy, the cheaper it gets**

## Authentication

Send your Scrappey API key in request body as:

```json
{
  "clientKey": "YOUR_SCRAPPEY_API_KEY"
}
```

## Endpoints

- `POST /createTask`
- `POST /getTaskResult`

## Supported Task Types

1. `AntiTurnstileTaskProxyLess`
2. `MtCaptchaTaskProxyLess`
3. `MtCaptchaTask` (requires `proxy`)

## 1) Create Task

`POST /createTask`

### Turnstile Example

```json
{
  "clientKey": "YOUR_SCRAPPEY_API_KEY",
  "task": {
    "type": "AntiTurnstileTaskProxyLess",
    "websiteURL": "https://stake.com/",
    "websiteKey": "0x4AAAAAAAGD4gMGOTFnvupz",
    "metadata": {
      "action": "login",
      "cdata": "optional-cdata",
      "invisible": true
    }
  }
}
```

### MTCaptcha ProxyLess Example

```json
{
  "clientKey": "YOUR_SCRAPPEY_API_KEY",
  "task": {
    "type": "MtCaptchaTaskProxyLess",
    "websiteURL": "https://example.com",
    "websiteKey": "MTPublic-xxxxxxxxx"
  }
}
```

### MTCaptcha With Proxy Example

```json
{
  "clientKey": "YOUR_SCRAPPEY_API_KEY",
  "task": {
    "type": "MtCaptchaTask",
    "websiteURL": "https://example.com",
    "websiteKey": "MTPublic-xxxxxxxxx",
    "proxy": "http://ip:port@user:pass"
  }
}
```

### Create Task Response

```json
{
  "errorId": 0,
  "errorCode": "",
  "errorDescription": "",
  "status": "idle",
  "taskId": "61138bb6-19fb-11ec-a9c8-0242ac110006"
}
```

## 2) Get Task Result

`POST /getTaskResult`

### Request

```json
{
  "clientKey": "YOUR_SCRAPPEY_API_KEY",
  "taskId": "61138bb6-19fb-11ec-a9c8-0242ac110006"
}
```

### Processing Response

```json
{
  "errorId": 0,
  "taskId": "61138bb6-19fb-11ec-a9c8-0242ac110006",
  "status": "processing"
}
```

### Ready Response

```json
{
  "errorId": 0,
  "taskId": "61138bb6-19fb-11ec-a9c8-0242ac110006",
  "status": "ready",
  "errorCode": null,
  "errorDescription": null,
  "solution": {
    "token": "TOKEN_VALUE",
    "type": "turnstile",
    "userAgent": "Mozilla/5.0 ..."
  }
}
```

For MTCaptcha, `solution.type` is `mtcaptcha`.

### Failed Response

```json
{
  "errorId": 0,
  "taskId": "61138bb6-19fb-11ec-a9c8-0242ac110006",
  "status": "failed",
  "errorCode": "ERROR_SCRAPPEY",
  "errorDescription": "Reason here"
}
```

## Polling Strategy

1. Call `createTask`.
2. Store `taskId`.
3. Poll `getTaskResult` every 1-2 seconds.
4. Stop on `ready` or `failed`.

## Node.js Example

See [node-example.js](./node-example.js).

## Python Example

See [python-example.py](./python-example.py).

## Compatibility Notes

- Flow is anti-captcha style (`createTask` + `getTaskResult`).
- `clientKey` is your Scrappey API key.
- Response shape follows common captcha-task APIs.
- If your app already supports Anti-Captcha/CapSolver style APIs, you can usually just switch the base URL to `https://captcha.scrappey.com` and keep the same `createTask`/`getTaskResult` flow.

### Quick Provider Switch

Before:
- `https://api.capsolver.com/createTask`
- `https://api.capsolver.com/getTaskResult`

After:
- `https://captcha.scrappey.com/createTask`
- `https://captcha.scrappey.com/getTaskResult`
