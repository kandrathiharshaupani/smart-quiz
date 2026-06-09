const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "scores.json");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = process.env.SMTP_PORT || "";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

function readScores() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function writeScores(scores) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2), "utf8");
}

app.get("/api/scores", (req, res) => {
  const scores = readScores();
  res.json(scores);
});

app.post("/api/scores", (req, res) => {
  const { name, score, attempted, timestamp } = req.body;
  if (!name || score == null || attempted == null) {
    return res.status(400).json({ error: "Missing score data." });
  }

  const scores = readScores();
  const entry = { name, score, attempted, timestamp: timestamp || new Date().toISOString() };
  scores.push(entry);
  writeScores(scores);
  res.status(201).json({ success: true });

  console.log("Score received:", entry);

  (async () => {
    try {
      if (!ADMIN_EMAIL || !SMTP_HOST || !SMTP_USER) {
        console.log("Admin email not configured. Set ADMIN_EMAIL, SMTP_HOST, SMTP_USER, and SMTP_PASS to send emails.");
        return;
      }
      console.log(`Sending admin email to ${ADMIN_EMAIL} for player ${name}`);
      await sendAdminEmail(entry);
      console.log("Admin email sent successfully.");
    } catch (err) {
      console.error("Error sending admin email:", err);
    }
  })();
});

async function sendAdminEmail(entry) {
  if (!ADMIN_EMAIL || !SMTP_HOST || !SMTP_USER) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  const subject = `New quiz score: ${entry.name} — ${entry.score}`;
  const html = `
    <p>New quiz submission:</p>
    <ul>
      <li><strong>Name:</strong> ${entry.name}</li>
      <li><strong>Score:</strong> ${entry.score}</li>
      <li><strong>Attempted:</strong> ${entry.attempted}</li>
      <li><strong>Time:</strong> ${entry.timestamp}</li>
    </ul>
  `;

  await transporter.sendMail({
    from: SMTP_USER,
    to: ADMIN_EMAIL,
    subject,
    html
  });
}

app.listen(PORT, () => {
  console.log(`SmartQuiz server running at http://localhost:${PORT}`);
});
