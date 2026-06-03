# Como publicar o ACAF como app

## 1. Publicar como site/app instalavel

1. Suba a pasta do projeto no Vercel, Netlify ou GitHub Pages.
2. Acesse o link pelo Chrome no Android.
3. Toque em **Instalar app** ou no menu do navegador > **Adicionar a tela inicial**.

O projeto ja possui `manifest.webmanifest` e `sw.js`, entao funciona como PWA: abre em tela cheia, pode ficar na tela inicial e guarda os dados no navegador do usuario.

## 2. Publicar na Play Store

Para colocar na Play Store, use o PWA como base e empacote com uma ferramenta como:

- Bubblewrap / Trusted Web Activity
- Capacitor
- Android Studio com WebView

Antes de publicar, use um dominio com HTTPS, icones finais, politica de privacidade e conta Google Play Console.

## 3. O que ja foi preparado

- Perfil com foto do aluno.
- Perfil com nome e foto do professor.
- Fotos de antes/depois.
- Meta de peso, peso perdido e meta batida.
- Treinos adaptados por nivel e restricao.
- Videos de execucao por exercicio.
- Layout responsivo para celular.
