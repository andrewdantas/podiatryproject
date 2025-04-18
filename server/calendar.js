require('dotenv').config(); // Carregar variáveis de ambiente do .env
const { google } = require('googleapis');


// Criação do cliente OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Escopo para acessar o Google Calendar
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Função para gerar URL de autorização
function gerarUrlDeAutorizacao() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  return authUrl;
}

// Função para definir as credenciais usando o token de autorização
async function definirCredenciais(codigoDeAutorizacao) {
  try {
    const { tokens } = await oAuth2Client.getToken(codigoDeAutorizacao);
    oAuth2Client.setCredentials(tokens);
    console.log('Token configurado com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar as credenciais:', error);
  }
}

// Função para verificar e renovar o token, se necessário
async function verificarRenovacaoToken() {
  const tokenExpirado = oAuth2Client.credentials.expiry_date < Date.now();
  if (tokenExpirado) {
    try {
      // Tenta renovar o token
      const { tokens } = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(tokens);
      console.log('Token renovado com sucesso!');
    } catch (error) {
      console.error('Erro ao renovar o token:', error);
    }
  }
}

// Função para criar evento no Google Calendar
async function criarEvento(auth, dados) {
  // Verificando a necessidade de renovação do token antes de criar o evento
  await verificarRenovacaoToken();

  const calendar = google.calendar({ version: 'v3', auth });

  try {
    const evento = {
      summary: `Agendamento Shalom Adonai - ${dados.nome}`,
      location: 'Salão Shalom Adonai, Rua Nhatumani, 496',
      description: `Cliente: ${dados.nome}\nTelefone: ${dados.telefone}\nServiço: ${dados.servicos}`,
      start: {
        dateTime: dados.dataInicio,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: dados.dataFim,
        timeZone: 'America/Sao_Paulo',
      },
      attendees: [
        { email: 'dantasandrew05@gmail.com' }, // Adicionar os e-mails dos participantes
      ],
    };

    // Tentando criar o evento no Google Calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: evento,
      sendUpdates: 'all',
    });

    // Retorna a resposta do evento criado
    return response.data;
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    throw new Error('Erro ao criar evento');
  }
}

// Exportando as funções
module.exports = {
  gerarUrlDeAutorizacao,
  definirCredenciais,
  criarEvento,
};