import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getDadosDiarios } from '@/lib/queries'

export const revalidate = 3600

export const metadata = {
  title: 'Painéis e Indicadores — Observatório de Segurança Pública do Amazonas',
  description: 'Indicadores de segurança pública do Amazonas: CVLI, roubos, violência doméstica e municípios monitorados.',
}

const METRICAS_METODOLOGIA = [
  { sigla: 'CVLI', nome: 'Crimes Violentos Letais e Intencionais', descricao: 'Homicídios dolosos, latrocínios e lesões corporais seguidas de morte. Principal indicador de violência letal.' },
  { sigla: 'CVNLI', nome: 'Crimes Violentos Não Letais', descricao: 'Tentativas de homicídio, estupros e outros crimes violentos que não resultam em morte.' },
  { sigla: 'RONE', nome: 'Roubo a Negócios e Estabelecimentos', descricao: 'Roubos a bancos, comércios, postos de combustível e estabelecimentos em geral.' },
  { sigla: 'VD', nome: 'Violência Doméstica', descricao: 'Crimes registrados com vítimas em contexto doméstico e familiar, conforme Lei Maria da Penha.' },
]

const FONTES = [
  { nome: 'SSP-AM', descricao: 'Secretaria de Segurança Pública do Amazonas — registros policiais diários' },
  { nome: 'SINESP/MJ', descricao: 'Sistema Nacional de Informações de Segurança Pública — consolidação federal' },
  { nome: 'IML-AM', descricao: 'Instituto Médico Legal — laudos de causas de morte violenta' },
  { nome: 'TJAM', descricao: 'Tribunal de Justiça do Amazonas — dados processuais' },
]

export default async function PaineisPage() {
  const dados = await getDadosDiarios()
  const ind = dados.indicadores

  const cards = [
    {
      label: 'CVLI — últimos 12 meses',
      valor: ind.cvli_12m.toLocaleString('pt-BR'),
      variacao: ind.cvli_variacao,
      unidade: 'casos',
      descricao: 'Crimes Violentos Letais e Intencionais acumulados nos últimos 12 meses em todo o estado.',
    },
    {
      label: 'Roubos — ano atual',
      valor: ind.roubos_ano.toLocaleString('pt-BR'),
      variacao: ind.roubos_variacao,
      unidade: 'ocorrências',
      descricao: 'Total de registros de roubo (com violência ou grave ameaça) no ano corrente.',
    },
    {
      label: 'Violência doméstica — ano atual',
      valor: ind.violencia_domestica_ano.toLocaleString('pt-BR'),
      variacao: ind.violencia_domestica_variacao,
      unidade: 'casos',
      descricao: 'Ocorrências registradas em contexto doméstico e familiar, incluindo flagrantes e TCO.',
    },
    {
      label: 'Municípios monitorados',
      valor: String(ind.municipios_monitorados),
      variacao: null,
      unidade: 'de 62',
      descricao: 'Municípios com dados validados e integrados ao sistema de monitoramento do Observatório.',
    },
  ]

  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Dados atualizados</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Painéis e Indicadores</h1>
          <p className="text-white/60 text-sm max-w-xl mb-2">
            Indicadores de segurança pública do Amazonas consolidados a partir de dados oficiais.
            Atualização: <span className="text-obs-gold">{new Date(ind.atualizado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Manaus' })}</span>
          </p>
          <p className="text-white/35 text-xs">Fonte: {ind.fonte}</p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-12">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="border border-white/10 bg-white/5 p-5">
              <p className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-3 leading-tight">{c.label}</p>
              <p className="text-white font-bold text-3xl mb-1">{c.valor}</p>
              <p className="text-white/40 text-xs mb-3">{c.unidade}</p>
              {c.variacao !== null && (
                <p className={`text-xs font-semibold mb-3 ${c.variacao < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {c.variacao > 0 ? '+' : ''}{c.variacao.toFixed(1)}% vs. período anterior
                </p>
              )}
              <p className="text-white/40 text-xs leading-relaxed">{c.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0F2A45] px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Municípios em destaque</h2>
          <p className="text-white/50 text-sm mb-8">Classificação de risco baseada em taxa de CVLI por 100 mil habitantes.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/50 text-xs font-bold tracking-widest uppercase pb-3 pr-6">Município</th>
                  <th className="text-right text-white/50 text-xs font-bold tracking-widest uppercase pb-3 pr-6">CVLI (12m)</th>
                  <th className="text-left text-white/50 text-xs font-bold tracking-widest uppercase pb-3">Nível de risco</th>
                </tr>
              </thead>
              <tbody>
                {dados.municipios_destaque.map((m, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 pr-6 text-white font-medium">{m.nome}</td>
                    <td className="py-3 pr-6 text-right text-white/80">{m.cvli.toLocaleString('pt-BR')}</td>
                    <td className="py-3">
                      <span className={`text-xs font-bold px-2 py-1 ${
                        m.risco === 'Alto' ? 'bg-red-500/20 text-red-400' :
                        m.risco === 'Médio' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {m.risco}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-obs-navy px-4 md:px-8 py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Metodologia</h2>
          <p className="text-white/50 text-sm mb-8">Definições dos indicadores utilizados no monitoramento.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {METRICAS_METODOLOGIA.map((m) => (
              <div key={m.sigla} className="border border-white/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-obs-gold/20 text-obs-gold text-xs font-bold px-2 py-1">{m.sigla}</span>
                  <span className="text-white/80 text-xs font-semibold">{m.nome}</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{m.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A1628] px-4 md:px-8 py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Fontes de dados</h2>
          <p className="text-white/50 text-sm mb-8">Organismos que alimentam o sistema de monitoramento do Observatório.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {FONTES.map((f) => (
              <div key={f.nome} className="flex gap-4 border border-white/10 p-4">
                <span className="text-obs-gold font-bold text-sm flex-shrink-0 w-20">{f.nome}</span>
                <span className="text-white/55 text-xs leading-relaxed">{f.descricao}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
