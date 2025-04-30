document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('agendamentoForm');
  const dataInput = document.getElementById('data');
  const horaSelect = document.getElementById('hora');
  const telefoneInput = document.getElementById('telefone');

  // Impede datas passadas
  const hoje = new Date();
  dataInput.min = hoje.toISOString().split('T')[0];

  telefoneInput.addEventListener('input', () => {
    telefoneInput.value = formatarTelefone(telefoneInput.value);
  });

  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length === 0) return '';
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }

  dataInput.addEventListener('change', () => {
    const data = new Date(dataInput.value + 'T12:00:00');
    const diaSemana = data.getDay();
    const hojeStr = new Date().toDateString();

    if (diaSemana === 0 || diaSemana === 1) {
      horaSelect.innerHTML = `<option>❌ Fechado aos domingos e segundas</option>`;
      alert('Atendemos de terça a sábado.');
      return;
    }

    horaSelect.innerHTML = `<option disabled selected>⏳ Carregando horários...</option>`;
    const horarios = [];
    const inicio = 9;
    const fim = 19;
    const agora = new Date();

    for (let h = inicio; h < fim; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hora = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const horaCompleta = new Date(`${dataInput.value}T${hora}`);
        if (data.toDateString() === hojeStr && horaCompleta <= agora) continue;
        horarios.push(`<option value="${hora}">${hora}</option>`);
      }
    }

    horaSelect.innerHTML = horarios.length
      ? `<option disabled selected>Escolha um horário</option>` + horarios.join('')
      : `<option>😢 Nenhum horário disponível</option>`;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const data = dataInput.value;
    const hora = horaSelect.value;

    const checkboxes = document.querySelectorAll('input[name="servicos[]"]:checked');
    const servicos = Array.from(checkboxes).map(checkbox => checkbox.value);

    if (servicos.length === 0 || !data || !hora) {
      alert('Preencha todos os campos e selecione pelo menos um serviço.');
      return;
    }

    const [ano, mes, dia] = data.split('-');
    const [h, min] = hora.split(':');
    const dataInicio = new Date(ano, mes - 1, dia, h, min);
    const dataFim = new Date(dataInicio.getTime() + 60 * 60000); // 1h depois
    const servicosTexto = servicos.join(', ');

    const payload = {
      nome,
      telefone,
      servicos: servicosTexto,
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString()
    };

    try {
      // Primeiro tenta criar o evento diretamente
      const res = await fetch('/criar-evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        // Não autenticado: redireciona para login e salva os dados no localStorage
        localStorage.setItem('agendamentoPendente', JSON.stringify(payload));
        const auth = await fetch('/gerar-url-autorizacao');
        const data = await auth.json();
        window.location.href = data.authUrl;
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        alert('Erro ao criar evento: ' + err.message);
        return;
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao tentar agendar.');
    }
  });

  // Se o usuário voltou da autenticação, verifica se há dados salvos
  const agendamentoPendente = localStorage.getItem('agendamentoPendente');
  if (agendamentoPendente) {
    const dados = JSON.parse(agendamentoPendente);
    fetch('/criar-evento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(res => res.json())
      .then(res => {
        console.log('Evento criado após autenticação:', res);
        localStorage.removeItem('agendamentoPendente');
        alert('Agendamento confirmado após login!');
      })
      .catch(err => {
        console.error('Erro após autenticação:', err);
      });
  }
});
