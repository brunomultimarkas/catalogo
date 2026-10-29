// Robô do catálogo: puxa as fotos do feed do Instagram e atualiza dados/posts.json
// Roda automaticamente no GitHub Actions. Precisa do segredo IG_TOKEN.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const TOKEN = process.env.IG_TOKEN;
const MAX_POSTS = Number(process.env.MAX_POSTS || 500); // quantos posts mais recentes entram
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

async function contaInstagramDaPagina() {
  const r = await fetch(`${FB_API}/me?fields=instagram_business_account{id,username}&access_token=${TOKEN}`);
  const j = await r.json();
  if (j.error) throw new Error("Facebook respondeu: " + j.error.message);
  if (!j.instagram_business_account) throw new Error("Esta Página do Facebook não está ligada a um Instagram profissional.");
  console.log("Instagram encontrado: @" + j.instagram_business_account.username);
  return j.instagram_business_account.id;
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

async function buscarPosts() {
  const campos = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  let url = VIA_FACEBOOK
    ? `${FB_API}/${await contaInstagramDaPagina()}/media?fields=${campos}&limit=100&access_token=${TOKEN}`
    : `${API}/me/media?fields=${campos}&limit=100&access_token=${TOKEN}`;
  const lista = [];
  while (url && lista.length < MAX_POSTS) {
    const r = await fetch(url);
    const j = await r.json();
    if (j.error) throw new Error("Instagram respondeu: " + j.error.message);
    lista.push(...j.data);
    url = j.paging?.next;
  }
  return lista.slice(0, MAX_POSTS);
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

async function main() {
  await fs.mkdir(PASTA_FOTOS, { recursive: true });
  await renovarToken();

  const posts = await buscarPosts();
  console.log(`Instagram devolveu ${posts.length} posts.`);

  const saida = [];
  for (const p of posts) {
    if (await baixarFoto(p)) {
      saida.push({
        id: p.id,
        tipo: p.media_type, // IMAGE, CAROUSEL_ALBUM ou VIDEO
        foto: `fotos/${p.id}.jpg`,
        legenda: p.caption || "",
        link: p.permalink,
        data: p.timestamp
      });
    }
  }

  // Apaga fotos de posts que saíram do feed (arquivados/excluídos)
  const ids = new Set(saida.map(p => p.id));
  for (const f of await fs.readdir(PASTA_FOTOS)) {
    if (f.endsWith(".jpg") && !ids.has(f.replace(".jpg", ""))) await fs.unlink(path.join(PASTA_FOTOS, f));
  }

  // Só grava se algo mudou (evita atualização à toa)
  let antigo = { posts: [] };
  try { antigo = JSON.parse(await fs.readFile(ARQ, "utf8")); } catch {}
  if (JSON.stringify(antigo.posts) === JSON.stringify(saida)) { console.log("Nada novo no feed."); return; }

  await fs.writeFile(ARQ, JSON.stringify({ atualizado: new Date().toISOString(), posts: saida }, null, 1));
  console.log(`Catálogo atualizado com ${saida.length} peças.`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
