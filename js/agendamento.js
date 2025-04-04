document.addEventListener('DOMContentLoaded', function() {
    const dataInput = document.getElementById('data');
    const horaSelect = document.getElementById('hora');
    const hoje = new Date();
    
    // Formata data para YYYY-MM-DD
    const formatarData = (date) => {
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset * 60 * 1000));
        return date.toISOString().split('T')[0];
    };
    
    // Define data mínima como hoje
    dataInput.min = formatarData(hoje);
    
    // Bloqueia fisicamente domingos (0) e segundas (1)
    dataInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const diaSemana = selectedDate.getDay();
        
        if (diaSemana === 0 || diaSemana === 1) {
            this.value = ''; // Limpa a seleção inválida
            horaSelect.innerHTML = '<option value="" selected disabled>Selecione um horário</option>';
            return;
        }
        
        // Se passou da validação, gera os horários
        const isToday = selectedDate.toDateString() === hoje.toDateString();
        horaSelect.innerHTML = '<option value="" selected disabled>Selecione um horário</option>';
        
        // Terça a Sábado (2-6)
        const startHour = isToday ? Math.max(9, hoje.getHours() + 1) : 9;
        const endHour = 19;
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                if (isToday && hour === hoje.getHours() && minute <= hoje.getMinutes()) {
                    continue;
                }
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                horaSelect.innerHTML += `<option value="${timeString}">${timeString}</option>`;
            }
        }
        
        if (horaSelect.options.length <= 1) {
            horaSelect.innerHTML = '<option value="" selected disabled>Não há horários disponíveis hoje</option>';
        }
    });
    
    // Envio do formulário
    document.getElementById('agendamentoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const servico = document.getElementById('servico').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        
        if (!nome || !telefone || !servico || !data || !hora) {
            alert('Por favor, preencha todos os campos corretamente!');
            return;
        }

        // Formata a data e hora para o Google Agenda
        const [year, month, day] = data.split('-');
        const [hour, minute] = hora.split(':');
        const startDate = new Date(year, month - 1, day, hour, minute);
        const endDate = new Date(startDate);
        
        // Define duração do serviço
        if (servico.includes("Design") || servico.includes("Manicure") || servico.includes("Pedicure")) {
            endDate.setHours(endDate.getHours(), endDate.getMinutes() + 30);
        } else if (servico.includes("Coloração") || servico.includes("Podologia")) {
            endDate.setHours(endDate.getHours() + 2);
        } else {
            endDate.setHours(endDate.getHours() + 1);
        }
        
        // Cria link para o Google Agenda
        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(servico)}` +
                                `&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}` +
                                `/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}` +
                                `&details=Cliente: ${encodeURIComponent(nome)}%0ATelefone: ${encodeURIComponent(telefone)}` +
                                `&location=Nanda - Shalon Adonai&sf=true&output=xml`;
        
        // Mostra modal de confirmação
        document.getElementById('confirmacaoTexto').textContent = 
            `Olá ${nome}, seu agendamento para ${servico} no dia ${day}/${month}/${year} às ${hora} foi confirmado!`;
        document.getElementById('googleCalendarLink').href = googleCalendarUrl;
        
        new bootstrap.Modal(document.getElementById('confirmacaoModal')).show();
    });
});
// Função auxiliar para formatar data (YYYY-MM-DD)
function formatDate(date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset * 60 * 1000));
    return date.toISOString().split('T')[0];
}

// Função para criar link do Google Agenda
function createGoogleCalendarLink(nome, telefone, servico, startDate, endDate) {
    const startISO = startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const endISO = endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    
    const details = `Cliente: ${nome}%0ATelefone: ${telefone}%0A%0AObservações:`;
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(servico)}` +
           `&dates=${startISO}/${endISO}` +
           `&details=${details}` +
           `&location=Nanda - Shalon Adonai` +
           `&sf=true&output=xml`;
}