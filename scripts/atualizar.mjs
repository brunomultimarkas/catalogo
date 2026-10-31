// Robô do catálogo: puxa as fotos do feed do Instagram e atualiza dados/posts.json
// Roda automaticamente no GitHub Actions. Precisa do segredo IG_TOKEN.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const TOKEN = process.env.IG_TOKEN;
const MAX_POSTS = Number(process.env.MAX_POSTS || 500); // quantos posts mais recentes entram
// MODO "rapido": só confere os posts mais novos (poucas consultas, roda várias vezes ao dia)
// MODO "completo": revisa o feed inteiro e tira o que foi apagado/arquivado (1x por dia)
const MODO = process.env.MODO === "completo" ? "completo" : "rapido";
const POSTS_RAPIDO = 25;
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ARQ = path.join(RAIZ, "dados", "posts.json");
const PASTA_FOTOS = path.join(RAIZ, "fotos");
const API = process.env.IG_API || "https://graph.instagram.com";

if (!TOKEN) { console.error("Falta o segredo IG_TOKEN."); process.exit(1); }

// Dois tipos de chave funcionam:
//  - Token de PÁGINA do Facebook (começa com "EAA"): não vence. Usa graph.facebook.com.
//  - Token do login do Instagram (começa com "IG"): vence em 60 dias e é renovado aqui.
const VIA_FACEBOOK = TOKEN.startsWith("EAA");
const FB_API = process.env.FB_API || "https://graph.facebook.com/v21.0";

const espera = ms => new Promise(r => setTimeout(r, ms));
// Busca na API com novas tentativas em falhas passageiras (internet, limite de uso, instabilidade da Meta)
async function api(url) {
  const passageiros = [1, 2, 4, 17, 32, 341, 613, 80002];
  for (let tentativa = 1; ; tentativa++) {
    let j;
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
      j = await r.json();
    } catch (e) { j = { error: { message: e.message, code: 2 } }; }
    if (!j.error) return j;
    const passageiro = passageiros.includes(j.error.code) || j.error.is_transient;
    if (!passageiro || tentativa >= 4) {
      const e = new Error(`Meta respondeu (código ${j.error.code ?? "?"}): ${j.error.message}`);
      e.chave = !passageiro; // problema de chave/permissão, não adianta repetir
      throw e;
    }
    console.log(`Falha passageira (${j.error.message}). Tentando de novo em ${tentativa * 30}s...`);
    await espera(tentativa * 30000);
  }
}

async function contaInstagramDaPagina() {
  if (process.env.IG_USER_ID) return process.env.IG_USER_ID;
  const j = await api(`${FB_API}/me?fields=instagram_business_account,connected_instagram_account&access_token=${TOKEN}`);
  const conta = j.instagram_business_account || j.connected_instagram_account;
  if (!conta) throw new Error("Esta Página do Facebook não está ligada a um Instagram profissional.");
  console.log("Instagram encontrado: " + conta.id);
  return conta.id;
}

async function renovarToken() {
  if (VIA_FACEBOOK) return; // token de página não vence
  // A chave dura 60 dias; renovando sempre, ela nunca vence.
  try {
    const r = await fetch(`${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`);
    const j = await r.json();
    if (j.access_token) {
      await fs.writeFile(path.join(RAIZ, ".novo_token"), j.access_token);
      console.log(`Chave renovada (vale mais ${Math.round(j.expires_in / 86400)} dias).`);
    } else console.log("Renovação não necessária agora:", j.error?.message || "");
  } catch (e) { console.log("Não deu pra renovar a chave agora:", e.message); }
}

async function buscarPosts(maximo) {
  const limite = Math.min(maximo, 100);
  const campos = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  let url = VIA_FACEBOOK
    ? `${FB_API}/${await contaInstagramDaPagina()}/media?fields=${campos}&limit=${limite}&access_token=${TOKEN}`
    : `${API}/me/media?fields=${campos}&limit=${limite}&access_token=${TOKEN}`;
  const lista = [];
  while (url && lista.length < maximo) {
    const j = await api(url);
    lista.push(...j.data);
    url = j.paging?.next;
  }
  return lista.slice(0, maximo);
}

async function baixarFoto(post) {
  const arquivo = path.join(PASTA_FOTOS, `${post.id}.jpg`);
  try { await fs.access(arquivo); return true; } catch {}
  const origem = post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url;
  if (!origem) return false;
  try {
    const r = await fetch(origem);
    if (!r.ok) return false;
    const buf = Buffer.from(await r.arrayBuffer());
    await sharp(buf).resize({ width: 900, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(arquivo);
    return true;
  } catch (e) { console.log("Falhou foto", post.id, e.message); return false; }
}

function paraCatalogo(p) {
  return {
    id: p.id,
    tipo: p.media_type, // IMAGE, CAROUSEL_ALBUM ou VIDEO
    foto: `fotos/${p.id}.jpg`,
    legenda: p.caption || "",
    link: p.permalink,
    data: p.timestamp
  };
}

async function main() {
  await fs.mkdir(PASTA_FOTOS, { recursive: true });
  await renovarToken();

  let antigo = { posts: [] };
  try { antigo = JSON.parse(await fs.readFile(ARQ, "utf8")); } catch {}

  const posts = await buscarPosts(MODO === "completo" ? MAX_POSTS : POSTS_RAPIDO);
  console.log(`Modo ${MODO}: Instagram devolveu ${posts.length} posts.`);

  const novos = [];
  for (const p of posts) if (await baixarFoto(p)) novos.push(paraCatalogo(p));

  let saida;
  if (MODO === "completo") {
    saida = novos;
    // Apaga fotos de posts que saíram do feed (arquivados/excluídos)
    const ids = new Set(saida.map(p => p.id));
    for (const f of await fs.readdir(PASTA_FOTOS)) {
      if (f.endsWith(".jpg") && !ids.has(f.replace(".jpg", ""))) await fs.unlink(path.join(PASTA_FOTOS, f));
    }
  } else {
    // Junta os posts mais novos com o que já estava no catálogo
    const ids = new Set(novos.map(p => p.id));
    saida = [...novos, ...antigo.posts.filter(p => !ids.has(p.id))]
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, MAX_POSTS);
  }

  // Segurança: nunca esvazia o catálogo por causa de uma resposta estranha
  if (!saida.length) { console.log("Resposta vazia; catálogo mantido como estava."); return; }

  if (JSON.stringify(antigo.posts) === JSON.stringify(saida)) { console.log("Nada novo no feed."); return; }
  await fs.writeFile(ARQ, JSON.stringify({ atualizado: new Date().toISOString(), posts: saida }, null, 1));
  console.log(`Catálogo atualizado com ${saida.length} peças.`);
}

main().catch(async e => {
  console.error(e.message);
  if (e.chave) await fs.writeFile(path.join(RAIZ, ".erro_chave"), e.message).catch(() => {});
  process.exit(1);
});
