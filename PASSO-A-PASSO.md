# Catálogo Virtual · Bruno Multimarcas
Passo a passo para colocar no ar (custo zero). Tempo: uns 30–40 minutos, uma vez só.

---

## Parte 1 — Pegar a chave do Instagram (Meta for Developers)

1. Entre em **developers.facebook.com** com o Facebook ligado à página/Instagram da loja e clique em **Começar** (se for a primeira vez, confirme seu número).
2. Clique em **Meus apps → Criar app**.
   - Nome: `Catalogo BM`
   - Caso de uso: **"Gerenciar mensagens e conteúdo no Instagram"** (ou "Outro → Empresa", se aparecer assim).
3. Dentro do app, vá em **Instagram → Configuração da API com login do Instagram**.
4. Na parte **"Gerar tokens de acesso"**, clique em **Adicionar conta**, entre com o **@brunomultimarkas** e autorize.
5. Clique em **Gerar token** ao lado da conta. Copie o código grandão que aparecer (começa com `IG...`).
   - Guarde em lugar seguro. **Não mande essa chave pra ninguém**, nem em print.
   - O app pode continuar em "modo de desenvolvimento". Não precisa publicar nem passar por análise da Meta, porque só vai ler a sua própria conta.

> Obs.: a Meta muda os nomes dos menus de vez em quando. Se algo estiver diferente, me chame que eu te guio na tela.

---

## Parte 2 — Criar o site no GitHub

1. Crie uma conta grátis em **github.com** (sugestão de usuário: `brunomultimarkas`; ele vira parte do link).
2. Clique no **+** (canto superior direito) → **New repository**.
   - Nome: `catalogo`
   - Marque **Public** (precisa ser público pra ficar 100% grátis)
   - Clique em **Create repository**.
3. Clique em **uploading an existing file** e arraste estes itens da pasta que te mandei:
   `index.html`, `config.js`, `package.json`, `.gitignore`, `PASSO-A-PASSO.md` e as pastas `dados`, `fotos` e `scripts`.
   Depois clique em **Commit changes**.
4. O robô fica numa pasta escondida (`.github`), que o arrastar às vezes ignora. Então crie ele na mão:
   - **Add file → Create new file**
   - No nome, digite exatamente: `.github/workflows/atualizar-catalogo.yml`
   - Abra o arquivo `atualizar-catalogo.yml` (dentro de `.github/workflows` na pasta) com o Bloco de Notas, copie tudo e cole lá.
   - **Commit changes**.

## Parte 3 — Guardar a chave no GitHub (seguro e escondido)

1. No repositório: **Settings → Secrets and variables → Actions → New repository secret**.
2. Name: `IG_TOKEN` · Secret: cole a chave da Parte 1 → **Add secret**.

**Recomendado (pra chave nunca vencer):**
3. Clique na sua foto → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
   - Nome: `robo catalogo` · Expiração: a maior possível (ou "No expiration")
   - Repository access: **Only select repositories → catalogo**
   - Permissions → Repository permissions → **Secrets: Read and write**
   - Gere e copie.
4. Volte em **Settings → Secrets and variables → Actions → New repository secret** do repositório:
   Name: `GH_PAT` · Secret: cole esse token.

## Parte 4 — Ligar o site

1. No repositório: **Settings → Pages**.
2. Em **Source**: *Deploy from a branch* → Branch **main** → pasta **/(root)** → **Save**.
3. Vá na aba **Actions** → clique em **Atualizar catálogo** → **Run workflow**. A primeira vez demora alguns minutos (baixa até 500 fotos).
4. Pronto! Seu link fica:
   **https://SEU-USUARIO.github.io/catalogo/**
   Coloque na bio, nos Destaques, no WhatsApp Business e em QR Code na loja.

---

## Dia a dia
- **Postou no feed → em até 1 hora aparece no catálogo.** Não precisa fazer nada.
- Quer atualizar na hora? **Actions → Atualizar catálogo → Run workflow**.
- Arquivou/apagou o post → some do catálogo na próxima atualização.
- **Categorias**: o catálogo lê a legenda. Escrevendo "tênis", "boné", "perfume", "kit", "% off" etc. a peça cai no filtro certo. Pra garantir, use hashtags: `#tenis #bones #perfumes #chinelos #kits #acessorios #camisas #ofertas`.
- **Mudar palavras, WhatsApp, endereços**: edite o `config.js` no GitHub (ícone do lápis).
- **Mudar quantidade de fotos** (padrão: 500 mais recentes): no `.github/workflows/atualizar-catalogo.yml`, troque `MAX_POSTS: 500`.

## Limites (tudo grátis)
| Item | Limite |
|---|---|
| GitHub Pages | site até 1 GB e 100 GB de visitas/mês (dá pra milhares de clientes) |
| GitHub Actions | ilimitado em repositório público |
| Instagram API | sem custo; ~200 consultas/hora (o robô usa poucas) |
| Chave do Instagram | 60 dias, renovada sozinha pelo robô (com o `GH_PAT`) |
| Atualização | de hora em hora, não é instantânea |
| Robô parado | o GitHub pausa o robô se o repositório ficar 60 dias sem nenhuma mudança (sem post novo). É só clicar em "Enable workflow" em Actions |
| Vendas | é vitrine: o botão "Quero essa peça" leva pro WhatsApp com o link do post |
