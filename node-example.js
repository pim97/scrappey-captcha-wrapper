const BASE_URL = process.env.CAPTCHA_API_BASE_URL || "https://captcha.scrappey.com";
const CLIENT_KEY = process.env.CAPTCHA_CLIENT_KEY || "YOUR_SCRAPPEY_API_KEY";

async function postJson(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });

  return res.json();
}

async function solveTurnstile() {
  const created = await postJson("/createTask", {
    clientKey: CLIENT_KEY,
    task: {
      type: "AntiTurnstileTaskProxyLess",
      websiteURL: "https://stake.com/",
      websiteKey: "0x4AAAAAAAGD4gMGOTFnvupz"
    }
  });

  if (created.errorId !== 0 || !created.taskId) {
    throw new Error(`createTask failed: ${JSON.stringify(created)}`);
  }

  while (true) {
    await new Promise((r) => setTimeout(r, 1500));
    const result = await postJson("/getTaskResult", {
      clientKey: CLIENT_KEY,
      taskId: created.taskId
    });

    if (result.errorId && result.errorId !== 0) {
      throw new Error(`getTaskResult error: ${JSON.stringify(result)}`);
    }

    if (result.status === "ready") {
      return result.solution.token;
    }

    if (result.status === "failed") {
      throw new Error(`Task failed: ${JSON.stringify(result)}`);
    }
  }
}

solveTurnstile()
  .then((token) => console.log("Token:", token))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
