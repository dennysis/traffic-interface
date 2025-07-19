import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urlsToPing = [
  "https://traffic-44o7.onrender.com/",
  "https://traffic-tmsl.onrender.com/",
  "https://traffic-e1fj.onrender.com",
  "https://traffic-j9e2.onrender.com",
  "https://traffic-ci12.onrender.com",
  "https://traffic-q37l.onrender.com"
];

let pingStatus = urlsToPing.map(url => ({
  url,
  status: "Not pinged yet",
  time: "N/A"
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/status', (req, res) => {
  res.json(pingStatus);
});

const pingWebsites = async () => {
  console.log(`[${new Date().toLocaleTimeString()}] Starting ping...`);
  const timeNow = new Date().toLocaleString();
  
  for (let i = 0; i < urlsToPing.length; i++) {
    try {
      const res = await fetch(urlsToPing[i]);
      pingStatus[i].status = `✅ ${res.status} ${res.statusText}`;
      pingStatus[i].time = timeNow;
    } catch (err) {
      pingStatus[i].status = `❌ Failed (${err.message})`;
      pingStatus[i].time = timeNow;
    }
  }
};

// Initial ping and repeat every 5 mins
pingWebsites();
setInterval(pingWebsites, 5 * 60 * 1000);

app.listen(port, () => {
  console.log(`Traffic Pinger running on port ${port}`);
});
