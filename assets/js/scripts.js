// Atualizar automaticamente o ano (footer - copyright)  
let ano = document.getElementById("copyrightYear")
let anoAtual = new Date().getFullYear()
ano.textContent = anoAtual

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service_worker.js')
            .then((registration) => {
                console.log('Service Worker registrado com sucesso:', registration)
            })
            .catch((error) => {
                console.log('Falha ao registrar o Service Worker:', error)
            })
    })
}