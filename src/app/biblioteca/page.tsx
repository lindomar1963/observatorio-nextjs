import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Biblioteca Técnica — Observatório de Segurança Pública do Amazonas',
  description: 'Acervo de legislação, estudos, cartilhas e referências bibliográficas em segurança pública.',
}

const ACERVO = [
  {
    categoria: 'Legislação Federal',
    itens: [
      { titulo: 'Lei nº 13.675/2018 — Sistema Único de Segurança Pública (SUSP)', tipo: 'Lei', ano: '2018', link: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13675.htm' },
      { titulo: 'Lei nº 11.340/2006 — Lei Maria da Penha', tipo: 'Lei', ano: '2006', link: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm' },
      { titulo: 'Lei nº 12.850/2013 — Organizações Criminosas', tipo: 'Lei', ano: '2013', link: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12850.htm' },
      { titulo: 'Lei nº 10.826/2003 — Estatuto do Desarmamento', tipo: 'Lei', ano: '2003', link: 'https://www.planalto.gov.br/ccivil_03/leis/2003/l10.826.htm' },
      { titulo: 'Lei nº 8.069/1990 — Estatuto da Criança e do Adolescente (ECA)', tipo: 'Lei', ano: '1990', link: 'https://www.planalto.gov.br/ccivil_03/leis/l8069.htm' },
      { titulo: 'Decreto nº 9.489/2018 — Regulamenta o SUSP', tipo: 'Decreto', ano: '2018', link: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/decreto/d9489.htm' },
    ],
  },
  {
    categoria: 'Legislação Estadual',
    itens: [
      { titulo: 'Resolução ALEAM nº 003/2023 — Cria o Observatório de Segurança Pública', tipo: 'Resolução', ano: '2023', link: 'https://www.aleam.gov.br/diario/' },
      { titulo: 'Lei Estadual nº 4.124/2015 — Política Estadual de Segurança Pública', tipo: 'Lei Estadual', ano: '2015', link: 'https://sapl.al.am.leg.br/sapl_documentos/norma_juridica/6473_texto_integral' },
      { titulo: 'Decreto Estadual nº 45.319/2022 — Plano Estadual de Segurança Pública e Defesa Social 2021–2030', tipo: 'Decreto', ano: '2022', link: 'https://www.ssp.am.gov.br/wp-content/uploads/2023/10/Plano-Estadual-de-Seguranca-Publica.pdf' },
    ],
  },
  {
    categoria: 'Estudos e Referências',
    itens: [
      { titulo: 'Atlas da Violência 2024 — IPEA/FBSP', tipo: 'Publicação externa', ano: '2024', link: 'https://www.ipea.gov.br/atlasviolencia/' },
      { titulo: 'Anuário Brasileiro de Segurança Pública 2024 — FBSP', tipo: 'Publicação externa', ano: '2024', link: 'https://forumseguranca.org.br/anuario-brasileiro-seguranca-publica/' },
      { titulo: 'Nota Técnica: Feminicídio no Amazonas 2019-2023 — SSP-AM', tipo: 'Nota técnica', ano: '2023', link: 'https://www.ssp.am.gov.br' },
      { titulo: 'Diagnóstico do Sistema Penitenciário do Amazonas — DEPEN', tipo: 'Diagnóstico', ano: '2023', link: 'https://www.gov.br/senappen/pt-br/servicos/sisdepen' },
      { titulo: 'Relatório Nacional sobre Drogas — SENAD/MJ', tipo: 'Relatório', ano: '2022', link: 'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/politicas-sobre-drogas' },
    ],
  },
  {
    categoria: 'Cartilhas e Guias',
    itens: [
      { titulo: 'Guia de Orientação às Vítimas de Violência Doméstica — SEJUSC-AM', tipo: 'Cartilha', ano: '2024', link: 'https://www.sejusc.am.gov.br' },
      { titulo: 'Cartilha de Prevenção ao Tráfico de Pessoas — MJ', tipo: 'Cartilha', ano: '2023', link: 'https://www.gov.br/mj/pt-br/assuntos/sua-protecao/trafico-de-pessoas' },
      { titulo: 'Manual de Boas Práticas em Policiamento Comunitário — SENASP', tipo: 'Manual', ano: '2022', link: 'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/senasp-1' },
      { titulo: 'Guia de Políticas Públicas de Segurança Municipal — FBSP', tipo: 'Guia', ano: '2023', link: 'https://forumseguranca.org.br/publicacoes/' },
    ],
  },
]

const tipoColor: Record<string, string> = {
  'Lei': 'bg-obs-gold/20 text-obs-gold',
  'Lei Estadual': 'bg-obs-gold/20 text-obs-gold',
  'Decreto': 'bg-blue-500/20 text-blue-400',
  'Resolução': 'bg-purple-500/20 text-purple-400',
  'Nota técnica': 'bg-green-500/20 text-green-400',
  'Publicação externa': 'bg-cyan-500/20 text-cyan-400',
  'Diagnóstico': 'bg-green-500/20 text-green-400',
  'Relatório': 'bg-green-500/20 text-green-400',
  'Cartilha': 'bg-pink-500/20 text-pink-400',
  'Manual': 'bg-pink-500/20 text-pink-400',
  'Guia': 'bg-pink-500/20 text-pink-400',
}

export default function BibliotecaPage() {
  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Acervo de referência</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Biblioteca Técnica</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Repositório de legislação, estudos, diagnósticos, cartilhas e referências bibliográficas
            relevantes para a área de segurança pública no Amazonas e no Brasil.
          </p>
        </div>
      </section>

      {ACERVO.map((secao) => (
        <section key={secao.categoria} className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-10 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-white font-display text-xl font-bold mb-6">{secao.categoria}</h2>
            <div className="space-y-3">
              {secao.itens.map((item, i) => (
                <div key={i} className="flex items-start gap-4 border border-white/10 bg-white/5 p-4 hover:border-obs-gold/30 transition-colors">
                  <div className="flex-1">
                    <p className="text-white/80 text-sm font-medium leading-snug mb-2">{item.titulo}</p>
                    <div className="flex gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 ${tipoColor[item.tipo] || 'bg-white/10 text-white/50'}`}>
                        {item.tipo}
                      </span>
                      <span className="text-white/30 text-xs self-center">{item.ano}</span>
                    </div>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-obs-gold/60 hover:text-obs-gold text-xs font-semibold self-center flex-shrink-0 hidden md:block transition-colors"
                  >
                    Consultar →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-[#0A1628] px-4 md:px-8 py-12 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-xl font-bold text-white mb-4">Sugerir material</h2>
          <p className="text-white/55 text-sm leading-relaxed max-w-xl mb-6">
            Pesquisadores, gestores públicos e cidadãos podem sugerir inclusão de documentos,
            estudos ou legislações ao acervo da Biblioteca Técnica do Observatório.
          </p>
          <a
            href="/contato"
            className="inline-block bg-obs-gold text-obs-navy font-bold text-sm px-6 py-3 hover:bg-yellow-500 transition-colors"
          >
            Enviar sugestão
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
