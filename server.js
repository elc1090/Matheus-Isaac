const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir os arquivos HTML/CSS/JS da pasta atual
app.use(express.static(path.join(__dirname)));

// Token da API WGER
const API_URL = "https://wger.de/api/v2";
const TOKEN = "Token 64d8c065b332bb379e054068191a0cde4b155220";

// Proxy para as requisições à API WGER
app.use("/api", async (req, res) => {
  const apiPath = req.originalUrl.replace("/api", "");
  const targetUrl = `${API_URL}${apiPath}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Authorization: TOKEN,
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ Erro ao acessar a API da WGER:", error);
    res.status(500).json({ error: "Erro interno ao acessar a API WGER" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Tudo pronto! Acesse: http://localhost:${PORT}/index.html`);
});