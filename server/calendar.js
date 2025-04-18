const { google } = require('googleapis');

// Dados do cliente OAuth2
const CLIENT_ID = '862704649748-rhg0b1l83ssdinc019pqr453br8927sk.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://podiatryproject.onrender.com/auth/callback';

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

// Função para criar evento no Google Calendar
async function criarEvento(auth, dados) {
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
        { email: 'dantasandrew05@gmail.com' } // Aqui, você pode adicionar os emails dos participantes
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
