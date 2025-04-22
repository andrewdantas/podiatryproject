const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const TOKEN_PATH = path.join(__dirname, 'token.json');

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Escopos da Google Agenda
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// 🔁 Tenta carregar token salvo ao iniciar
if (fs.existsSync(TOKEN_PATH)) {
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
}

// 🔗 Gera URL de autenticação
function getAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
}

// 🔐 Define as credenciais a partir do código e salva o token
function setCredentialsFromCode(code) {
  return oAuth2Client.getToken(code).then(res => {
    const tokens = res.tokens;
    oAuth2Client.setCredentials(tokens);

    // Salvar tokens no disco
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    return oAuth2Client;
  });
}

module.exports = {
  oAuth2Client,
  getAuthUrl,
  setCredentialsFromCode
};
