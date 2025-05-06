SALAOV2/
│
├── 📁 assets/                      # Arquivos estáticos (visuais e scripts personalizados)
│   ├── 📁 css/                    # Estilos CSS criados por você
│   │   └── style.css             # Arquivo principal de estilos customizados
│   │
│   ├── 📁 js/                     # Scripts JS próprios (interações, animações, etc.)
│   │   └── script.js             # Exemplo de script principal (se tiver)
│   │
│   ├── 📁 img/                    # Imagens utilizadas no site (logos, banners, etc.)
│   │   └── background.png        # Imagem usada no banner principal, por exemplo
│   │
│   └── 📁 icons/                  # Ícones usados para o aplicativo PWA (instalação no celular)
│       ├── 📁 Android/           # Ícones específicos para dispositivos Android
│       │   └── icons_android.png
│       │
│       ├── 📁 IOS/               # Ícones específicos para dispositivos Apple (iOS)
│       │   └── icons_IOS.png
│       │
│       └── 📁 Windows/           # Ícones específicos para dispositivos com Windows
│           └── icons_windows.png
│
├── 📁 bootstrap/                  # Framework Bootstrap local (caso não use via CDN)
│   ├── css/                      # Arquivos de estilo do Bootstrap
│   └── js/                       # Scripts JavaScript do Bootstrap
│
├── 📁 pages/                      # Páginas internas separadas por serviço ou sessão
│   ├── agendamento.html          # Página para agendamento de serviços
│   ├── cabelos.html              # Página sobre serviços de cabelo
│   ├── depilacao.html            # Página sobre serviços de depilação
│   ├── podologia.html            # Página sobre podologia
│   ├── sobrancelhas.html         # Página sobre sobrancelhas
│   └── unhas.html                # Página sobre unhas
│
├── 📁 service/                    # Arquivos relacionados ao funcionamento do PWA
│   ├── manifest.json             # Descreve aparência do app (nome, ícone, cor, etc.)
│   └── service_worker.js         # Controla o cache, funcionamento offline, e atualizações
│
├── index.html                    # Página inicial do site
├── LICENSE                       # Licença de uso do projeto (opcional)
└── README.md                     # Explicação sobre o projeto, como rodar, dependências, etc.
