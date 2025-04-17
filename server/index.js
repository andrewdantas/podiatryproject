const express = require('express');
const bodyParser = require('body-parser');
const criarEvento = require('/Calendar');
const { oAuth2Client } = require('./GoogleAuth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rota para criar evento
app.post('/api/criar-evento', async (req, res) => {
  const dados = req.body; // Dados enviados no corpo da requisição

  try {
    // Usa o OAuth2Client para fazer a autenticação
    const auth = oAuth2Client;
    
    // Tenta criar o evento
    const eventoCriado = await criarEvento(auth, dados);
    
    // Retorna o evento criado no formato JSON
    res.status(200).json(eventoCriado);
  } catch (error) {
    // Se ocorrer erro, retorna uma resposta JSON com erro
    res.status(500).json({ message: 'Erro ao criar evento', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});