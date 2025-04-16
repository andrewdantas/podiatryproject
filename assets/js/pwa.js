// Registra o Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service_worker.js')
            .then((registration) => {
                console.log('ServiceWorker registrado com sucesso:', registration.scope)
            })
            .catch((error) => {
                console.log('Falha no registro do ServiceWorker:', error)
            });
    });
}

// Trigger para instalação do PWA
let deferredPrompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    // Mostra um botão "Instalar" personalizado aqui (opcional)
    console.log('PWA pronto para instalação!')
})