const { google } = require('googleapis');

async function criarEvento(auth, dados) {
  const calendar = google.calendar({ version: 'v3', auth });

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
      { email: 'dantasandrew05@gmail.com' }
    ]
  };

  return await calendar.events.insert({
    calendarId: 'primary',
    resource: evento,
    sendUpdates: 'all',
  });
}

module.exports = criarEvento;
