/**
 * API route: /api/noticias
 * Busca notícias sobre segurança pública no Amazonas e sobre o
 * Deputado Comandante Dan automaticamente via Google Notícias (RSS).
 *
 * Sem chave de API, sem custo. Cache de 30 minutos.
 */

import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'

export const revalidate = 1800 // 30 minutos

/** Buscas executadas no Google Notícias. A ordem define a prioridade de categoria. */
const BUSCAS: { q: string; categoria: string }[] = [
  { q: '"Comandante Dan" Amazonas', categoria: 'Comandante Dan' },
  { q: 'Comandante Dan segurança pública', categoria: 'Comandante Dan' },
  { q: 'segurança pública Amazonas', categoria: 'Segurança Pública' },
  { q: 'violência Manaus', categoria: 'Manaus' },
  { q: 'polícia Amazonas operação', categoria: 'Polícia' },
  { q: 'tráfico de drogas Amazonas apreensão', categoria: 'Drogas' },
  { q: 'ALEAM segurança pública', categoria: 'ALEAM' },
]

export interface NoticiaExterna {
  titulo: string
  link: string
  fonte: string
  data: string // ISO
  categoria: string
  resumo: string
}

export interface NoticiasResponse {
  ok: boolean
  noticias: NoticiaExterna[]
  atualizadoEm: string
  erro?: string
}

function googleNewsUrl(q: string): string {
  const query = encodeURIComponent(q)
  return `https://news.google.com/rss/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
}

function limparHtml(s: string): string {
  return String(s ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
})

async function buscarFeed(q: string, categoria: string): Promise<NoticiaExterna[]> {
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), 8000)
  try {
    const res = await fetch(googleNewsUrl(q), {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ObservatorioSegurancaAM/1.0)' },
      signal: ctrl.signal,
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const data = parser.parse(xml)
    const itens = data?.rss?.channel?.item
    if (!itens) return []
    const lista = Array.isArray(itens) ? itens : [itens]
    return lista.map((item: Record<string, unknown>) => {
      const tituloBruto = limparHtml(String(item.title ?? ''))
      // Google News formata como "Título - Fonte"
      const sep = tituloBruto.lastIndexOf(' - ')
      const fonteSource =
        typeof item.source === 'object' && item.source !== null
          ? String((item.source as Record<string, unknown>)['#text'] ?? '')
          : ''
      const fonte = fonteSource || (sep > 0 ? tituloBruto.slice(sep + 3) : 'Google Notícias')
      const titulo = sep > 0 ? tituloBruto.slice(0, sep) : tituloBruto
      const pub = String(item.pubDate ?? '')
      const dataIso = pub ? new Date(pub).toISOString() : new Date().toISOString()
      return {
        titulo,
        link: String(item.link ?? ''),
        fonte,
        data: dataIso,
        categoria,
        resumo: limparHtml(String(item.description ?? '')).slice(0, 220),
      }
    })
  } catch {
    return []
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET(): Promise<NextResponse<NoticiasResponse>> {
  try {
    const resultados = await Promise.all(BUSCAS.map((b) => buscarFeed(b.q, b.categoria)))
    const todas = resultados.flat()

    // Dedup por título normalizado
    const vistos = new Set<string>()
    const unicas: NoticiaExterna[] = []
    for (const n of todas) {
      if (!n.titulo || !n.link) continue
      const chave = n.titulo.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60)
      if (vistos.has(chave)) continue
      vistos.add(chave)
      unicas.push(n)
    }

    // Ordena por data desc
    unicas.sort((a, b) => +new Date(b.data) - +new Date(a.data))

    if (unicas.length === 0) {
      throw new Error('Nenhuma notícia retornada pelas buscas')
    }

    return NextResponse.json({
      ok: true,
      noticias: unicas.slice(0, 60),
      atualizadoEm: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[/api/noticias]', msg)
    return NextResponse.json(
      { ok: false, noticias: [], atualizadoEm: new Date().toISOString(), erro: msg },
      { status: 502 }
    )
  }
}
