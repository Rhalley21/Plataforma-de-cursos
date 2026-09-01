# INETRIS — site

## Por que deu 404 antes

O arquivo `.jsx` que você tinha era um **artifact** (roda só dentro do Claude,
que fornece React, ícones e armazenamento prontos). Ele não tem `index.html`
nem passou por um build — por isso o GitHub Pages não achava nada pra
mostrar. Este projeto aqui é o site completo, pronto pra build e deploy.

## Passo a passo (GitHub Pages)

1. **Instale as dependências** (só na primeira vez, ou quando mudar alguma):
   ```
   npm install
   ```

2. **Teste localmente** antes de publicar:
   ```
   npm run dev
   ```
   Abre em `http://localhost:5173`.

3. **Gere o build de produção**:
   ```
   npm run build
   ```
   Isso cria a pasta `dist/` com o site pronto (HTML, CSS, JS).

4. **Publique no GitHub Pages** usando o pacote `gh-pages` (já incluso):
   ```
   npm run deploy
   ```
   Esse comando sobe o conteúdo de `dist/` para a branch `gh-pages` do seu
   repositório.

5. No GitHub, vá em **Settings → Pages** do repositório e confirme que a
   fonte ("Source") está configurada como a branch `gh-pages`, pasta `/`
   (raiz). Se estiver em outra branch/pasta, é aí que mora o 404.

6. O site fica disponível em:
   ```
   https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
   ```
   (o `base: "./"` já configurado no `vite.config.js` evita o erro mais
   comum de 404 em assets quando o site fica dentro de um subcaminho como
   esse).

## Importante sobre os dados salvos

Este projeto usa o armazenamento do **navegador** (localStorage) no lugar
do armazenamento que o Claude fornece dentro do chat. Isso significa:

- As aulas/formatos que você cadastrar no Painel, e as assinaturas feitas
  no checkout, ficam salvas **só no navegador de quem está usando**.
- Um visitante não vê o que outro visitante cadastrou — cada um tem sua
  própria cópia local.

Pra ter um catálogo de verdade **compartilhado entre todo mundo** que
acessa o site (o que provavelmente é o que você quer no fim das contas),
o próximo passo é conectar isso a um banco de dados real (Firebase,
Supabase, ou um backend próprio). Posso te ajudar a planejar isso quando
for a hora.
