# SmartQuiz - Shared Scoreboard

This project runs a simple quiz and stores shared scores on the server. It can optionally email the admin whenever a player finishes the quiz.

## Run locally

1. Install dependencies:

```bash
cd e:/smartquiz
npm install
```

2. Start server:

```bash
npm start
```

3. Open the app:

```
http://localhost:3000
```

## Email notifications (optional)

To enable email notifications, set the following environment variables before running the server:

- `ADMIN_EMAIL` — the admin email address to receive notifications
- `SMTP_HOST` — your SMTP host (e.g., `smtp.gmail.com`)
- `SMTP_PORT` — SMTP port (e.g., `587` or `465`)
- `SMTP_USER` — SMTP username (often your email)
- `SMTP_PASS` — SMTP password or app-specific password

Example (PowerShell):

```powershell
$env:ADMIN_EMAIL = "you@example.com"
$env:SMTP_HOST = "smtp.gmail.com"
$env:SMTP_PORT = "587"
$env:SMTP_USER = "you@example.com"
$env:SMTP_PASS = "your-app-password"
npm start
```

Notes:
- For Gmail, you must create an App Password if your account has 2FA. Do not use your normal password.
- If you prefer, use an email API provider (SendGrid, Mailgun) and provide their SMTP credentials.

## Access from other devices

- Use your machine IP and port `3000`: `http://<YOUR_PC_IP>:3000`
- Or use `ngrok http 3000` to create a temporary public URL.

## Security

- Do not commit SMTP credentials to source control.
- Use environment variables or a secrets manager in production.
