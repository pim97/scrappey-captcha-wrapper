import os
import time
import requests

BASE_URL = os.getenv("CAPTCHA_API_BASE_URL", "https://captcha.scrappey.com")
CLIENT_KEY = os.getenv("CAPTCHA_CLIENT_KEY", "YOUR_SCRAPPEY_API_KEY")


def post_json(path, body):
    response = requests.post(f"{BASE_URL}{path}", json=body, timeout=120)
    response.raise_for_status()
    return response.json()


def solve_turnstile():
    created = post_json(
        "/createTask",
        {
            "clientKey": CLIENT_KEY,
            "task": {
                "type": "AntiTurnstileTaskProxyLess",
                "websiteURL": "https://stake.com/",
                "websiteKey": "0x4AAAAAAAGD4gMGOTFnvupz",
            },
        },
    )

    if created.get("errorId") != 0 or not created.get("taskId"):
        raise RuntimeError(f"createTask failed: {created}")

    task_id = created["taskId"]

    while True:
        time.sleep(1.5)
        result = post_json(
            "/getTaskResult",
            {
                "clientKey": CLIENT_KEY,
                "taskId": task_id,
            },
        )

        if result.get("errorId") not in (0, None):
            raise RuntimeError(f"getTaskResult error: {result}")

        status = result.get("status")
        if status == "ready":
            return result.get("solution", {}).get("token")
        if status == "failed":
            raise RuntimeError(f"Task failed: {result}")


if __name__ == "__main__":
    token = solve_turnstile()
    print("Token:", token)
