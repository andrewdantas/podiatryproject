const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getAuthUrl, setCredentialsFromCode, oAuth2Client } = require('./googleAuth');
const criarEvento = require('./calendar');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota para obter URL de autenticação
app.get('/auth', (req, res) => {
  res.send({ url: getAuthUrl() });
});

// Callback após autorização do Google
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  await setCredentialsFromCode(code);
  res.send('Autenticado com sucesso! Você pode fechar esta janela.');
});

// Rota para criar evento
app.post('/criar-evento', async (req, res) => {
  try {
    const dados = req.body;
    const response = await criarEvento(oAuth2Client, dados);
    res.send({ status: 'ok', eventoId: response.data.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar evento');
  }
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
