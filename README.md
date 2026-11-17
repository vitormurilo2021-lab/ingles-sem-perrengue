# Inglês Sem Perrengue — funil (quiz + oferta)

Site estático (HTML/CSS/JS puro), pronto para a Vercel.

- `/` — Quiz "Teste do Ouvido" (9 perguntas, 2 testes de áudio, resultado com passaporte)
- `/oferta` — Página de vendas. Lê `?r=` (percentual do quiz) e repassa UTMs para o checkout.

## Antes de rodar tráfego
1. `public/assets/js/config.js`: preencha `PIXEL_ID`, `CHECKOUT_URL` e o preço.
2. `public/assets/audio/`: adicione `hotel.mp3` e `lanchonete.mp3` (ver LEIA-ME).
3. Rodapé de `public/oferta/index.html`: nome da empresa, CNPJ, links de termos e privacidade.

## Eventos do Pixel
PageView, QuizStart, QuizStep, QuizComplete, QuizToOffer (custom) · ViewContent e InitiateCheckout (padrão) na oferta.

## Rodar local
`npx serve public`
