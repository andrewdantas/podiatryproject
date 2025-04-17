const { google } = require('googleapis');

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
        { email: 'dantasandrew05@gmail.com' }
      ]
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
    // Se ocorrer erro, captura e retorna um erro adequado
    console.error('Erro ao criar evento:', error);
    throw new Error('Erro ao criar evento');
  }
}

module.exports = criarEvento;