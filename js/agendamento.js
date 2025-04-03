document.addEventListener('DOMContentLoaded', function() {
    // Configura datas permitidas (terça a sábado)
    const dataInput = document.getElementById('data');
    const hoje = new Date();
    const dataMinima = new Date(hoje);
    
    // Define a data mínima como hoje ou o próximo dia útil
    if (hoje.getDay() === 0) { // Domingo
        dataMinima.setDate(hoje.getDate() + 1);
    } else if (hoje.getDay() === 6) { // Sábado
        if (hoje.getHours() >= 19) {
            dataMinima.setDate(hoje.getDate() + 2); // Segunda não abre, vai para terça
        }
    } else if (hoje.getDay() === 1 && hoje.getHours() >= 19) { // Segunda à noite
        dataMinima.setDate(hoje.getDate() + 1);
    }
    
    dataInput.min = formatDate(dataMinima);
    
    // Define a data máxima (3 meses à frente)
    const dataMaxima = new Date(hoje);
    dataMaxima.setMonth(hoje.getMonth() + 3);
    dataInput.max = formatDate(dataMaxima);
    
    // Preenche os horários disponíveis
    dataInput.addEventListener('change', function() {
        const horaSelect = document.getElementById('hora');
        horaSelect.innerHTML = '<option value="" selected disabled>Selecione um horário</option>';
        
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay();
        
        // Verifica se é um dia válido (terça a sábado)
        if (dayOfWeek >= 2 && dayOfWeek <= 6) {
            // Horário de funcionamento: 9h às 19h
            const startHour = 9;
            const endHour = 19;
            
            // Cria opções de horário a cada 30 minutos
            for (let hour = startHour; hour < endHour; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    const option = document.createElement('option');
                    option.value = timeString;
                    option.textContent = timeString;
                    horaSelect.appendChild(option);
                }
            }
        } else {
            horaSelect.innerHTML = '<option value="" selected disabled>Não há horários disponíveis neste dia</option>';
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
        
        // Formata a data e hora para o Google Agenda
        const [year, month, day] = data.split('-');
        const [hour, minute] = hora.split(':');
        const startDate = new Date(year, month - 1, day, hour, minute);
        const endDate = new Date(startDate);
        
        // Define duração do serviço (padrão: 1 hora)
        if (servico.includes("Design") || servico.includes("Manicure") || servico.includes("Pedicure")) {
            endDate.setHours(endDate.getHours(), endDate.getMinutes() + 30);
        } else if (servico.includes("Coloração") || servico.includes("Podologia")) {
            endDate.setHours(endDate.getHours() + 2);
        } else {
            endDate.setHours(endDate.getHours() + 1);
        }
        
        // Cria link para o Google Agenda
        const googleCalendarUrl = createGoogleCalendarLink(nome, telefone, servico, startDate, endDate);
        
        // Mostra modal de confirmação
        document.getElementById('confirmacaoTexto').textContent = 
            `Olá ${nome}, seu agendamento para ${servico} no dia ${day}/${month}/${year} às ${hora} foi confirmado!`;
        
        document.getElementById('googleCalendarLink').href = googleCalendarUrl;
        const modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
        modal.show();
        
        // Aqui você pode adicionar código para enviar os dados para seu backend
        // e então integrar com a API do Google Agenda do lado do servidor
    });
});

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

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