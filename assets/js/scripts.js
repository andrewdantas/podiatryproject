// Atualizar automaticamente o ano (footer - copyright)  
let ano = document.getElementById("copyrightYear")
let anoAtual = new Date().getFullYear()
ano.textContent = anoAtual

document.getElementById('iosShareBtn').addEventListener('click', function() {
    // Verifica se a API de compartilhamento é suportada
    if (navigator.share) {
        navigator.share({
            title: 'Nanda - Shalom Adonai',
            text: 'Conheça o salão Shalom Adonai',
            url: window.location.href
        })
        .catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        // Fallback para dispositivos sem suporte
        alert('Toque no ícone de compartilhamento do seu navegador (normalmente no centro inferior da tela) e selecione "Adicionar à Tela de Início".');
    }
})