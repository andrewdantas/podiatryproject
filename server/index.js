const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir todos os arquivos estáticos corretamente
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use('/bootstrap', express.static(path.join(__dirname, '..', 'bootstrap')));
app.use('/pages', express.static(path.join(__dirname, '..', 'pages')));

// Servir o index.html diretamente da raiz
app.use(express.static(path.join(__dirname, '..')));

// Página inicial (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Função para verificar e renovar o token, se necessário
async function verificarRenovacaoToken() {
  const tokenExpirado = oAuth2Client.credentials.expiry_date < Date.now();
  if (tokenExpirado) {
    try {
      const { tokens } = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(tokens);
      console.log('Token renovado com sucesso!');
    } catch (error) {
      console.error('Erro ao renovar o token:', error);
      throw new Error('Erro ao renovar o token');
    }
  }
}

// Rota para gerar URL de autorização
app.get('/gerar-url-autorizacao', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar'
  });
  res.json({ authUrl: url });
});

// Rota de callback do Google OAuth
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    res.send('<h1>Autenticado com sucesso! Você pode fechar esta janela.</h1>');
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    res.status(500).send('Erro ao autenticar');
  }
});

// Criar evento no Google Agenda
app.post('/criar-evento', async (req, res) => {
  const { nome, telefone, servicos, dataInicio, dataFim } = req.body;

  if (!oAuth2Client.credentials.access_token) {
    return res.status(401).json({ erro: 'Não autenticado no Google' });
  }

  // Verifica se o token precisa ser renovado antes de criar o evento
  try {
    await verificarRenovacaoToken();

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const evento = {
      summary: `Agendamento - ${nome}`,
      description: `Serviços: ${servicos} | Telefone: ${telefone}`,
      start: {
        dateTime: dataInicio,
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: dataFim,
        timeZone: 'America/Sao_Paulo'
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: evento
    });
    res.json({ mensagem: 'Evento criado com sucesso!', evento: response.data });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).send('Erro ao criar evento no Google Calendar');
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});