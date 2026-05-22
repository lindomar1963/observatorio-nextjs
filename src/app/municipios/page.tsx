import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Municípios do Amazonas — Observatório de Segurança Pública',
  description: 'Monitoramento de segurança pública nos 62 municípios do Amazonas por calha regional.',
}

type Risco = 'Alto' | 'Médio' | 'Baixo' | 'Em análise'

interface Municipio {
  nome: string
  regiao: string
  populacao: string
  risco: Risco
}

const MUNICIPIOS: Municipio[] = [
  { nome: 'Manaus', regiao: 'Rio Negro', populacao: '2.255.903', risco: 'Alto' },
  { nome: 'Parintins', regiao: 'Baixo Amazonas', populacao: '113.377', risco: 'Médio' },
  { nome: 'Itacoatiara', regiao: 'Médio Amazonas', populacao: '99.269', risco: 'Médio' },
  { nome: 'Manacapuru', regiao: 'Rio Negro', populacao: '90.768', risco: 'Médio' },
  { nome: 'Coari', regiao: 'Purus', populacao: '86.839', risco: 'Médio' },
  { nome: 'Tefé', regiao: 'Juruá', populacao: '63.610', risco: 'Médio' },
  { nome: 'Tabatinga', regiao: 'Alto Solimões', populacao: '63.215', risco: 'Alto' },
  { nome: 'Maués', regiao: 'Médio Amazonas', populacao: '61.773', risco: 'Médio' },
  { nome: 'Humaitá', regiao: 'Madeira', populacao: '56.892', risco: 'Médio' },
  { nome: 'São Gabriel da Cachoeira', regiao: 'Alto Rio Negro', populacao: '47.600', risco: 'Em análise' },
  { nome: 'Borba', regiao: 'Madeira', populacao: '43.074', risco: 'Baixo' },
  { nome: 'Lábrea', regiao: 'Purus', populacao: '41.379', risco: 'Médio' },
  { nome: 'Carauari', regiao: 'Juruá', populacao: '38.256', risco: 'Baixo' },
  { nome: 'Manicoré', regiao: 'Madeira', populacao: '37.547', risco: 'Baixo' },
  { nome: 'Benjamin Constant', regiao: 'Alto Solimões', populacao: '36.029', risco: 'Em análise' },
  { nome: 'Presidente Figueiredo', regiao: 'Rio Negro', populacao: '35.017', risco: 'Médio' },
  { nome: 'Novo Airão', regiao: 'Rio Negro', populacao: '21.395', risco: 'Baixo' },
  { nome: 'Iranduba', regiao: 'Rio Negro', populacao: '49.423', risco: 'Médio' },
  { nome: 'Rio Preto da Eva', regiao: 'Rio Negro', populacao: '33.353', risco: 'Baixo' },
  { nome: 'Autazes', regiao: 'Médio Amazonas', populacao: '39.591', risco: 'Baixo' },
  { nome: 'Urucurituba', regiao: 'Médio Amazonas', populacao: '26.818', risco: 'Baixo' },
  { nome: 'Nova Olinda do Norte', regiao: 'Médio Amazonas', populacao: '32.551', risco: 'Baixo' },
  { nome: 'Barreirinha', regiao: 'Baixo Amazonas', populacao: '35.219', risco: 'Baixo' },
  { nome: 'Nhamundá', regiao: 'Baixo Amazonas', populacao: '19.872', risco: 'Baixo' },
  { nome: 'Urucará', regiao: 'Médio Amazonas', populacao: '18.920', risco: 'Baixo' },
  { nome: 'Fonte Boa', regiao: 'Juruá', populacao: '25.990', risco: 'Baixo' },
  { nome: 'Jutaí', regiao: 'Juruá', populacao: '23.942', risco: 'Em análise' },
  { nome: 'Eirunepé', regiao: 'Juruá', populacao: '35.388', risco: 'Em análise' },
  { nome: 'Envira', regiao: 'Juruá', populacao: '24.283', risco: 'Em análise' },
  { nome: 'Itamarati', regiao: 'Juruá', populacao: '12.003', risco: 'Em análise' },
  { nome: 'Japurá', regiao: 'Juruá', populacao: '10.921', risco: 'Em análise' },
  { nome: 'Tonantins', regiao: 'Alto Solimões', populacao: '21.521', risco: 'Em análise' },
  { nome: 'Amaturá', regiao: 'Alto Solimões', populacao: '12.174', risco: 'Em análise' },
  { nome: 'São Paulo de Olivença', regiao: 'Alto Solimões', populacao: '39.637', risco: 'Em análise' },
  { nome: 'Atalaia do Norte', regiao: 'Alto Solimões', populacao: '20.512', risco: 'Em análise' },
  { nome: 'Apuí', regiao: 'Madeira', populacao: '22.022', risco: 'Baixo' },
  { nome: 'Novo Aripuanã', regiao: 'Madeira', populacao: '26.706', risco: 'Baixo' },
  { nome: 'Canutama', regiao: 'Purus', populacao: '14.840', risco: 'Em análise' },
  { nome: 'Tapauá', regiao: 'Purus', populacao: '23.979', risco: 'Em análise' },
  { nome: 'Pauini', regiao: 'Purus', populacao: '27.116', risco: 'Em análise' },
  { nome: 'Boca do Acre', regiao: 'Purus', populacao: '30.992', risco: 'Em análise' },
  { nome: 'Beruri', regiao: 'Purus', populacao: '14.469', risco: 'Em análise' },
  { nome: 'Anori', regiao: 'Purus', populacao: '18.093', risco: 'Em análise' },
  { nome: 'Anamã', regiao: 'Purus', populacao: '10.651', risco: 'Em análise' },
  { nome: 'Codajás', regiao: 'Purus', populacao: '24.977', risco: 'Baixo' },
  { nome: 'Caapiranga', regiao: 'Rio Negro', populacao: '10.282', risco: 'Baixo' },
  { nome: 'Manaquiri', regiao: 'Purus', populacao: '23.011', risco: 'Baixo' },
  { nome: 'Careiro', regiao: 'Médio Amazonas', populacao: '32.817', risco: 'Baixo' },
  { nome: 'Careiro da Várzea', regiao: 'Médio Amazonas', populacao: '27.841', risco: 'Baixo' },
  { nome: 'Silves', regiao: 'Médio Amazonas', populacao: '11.090', risco: 'Baixo' },
  { nome: 'Itapiranga', regiao: 'Médio Amazonas', populacao: '10.282', risco: 'Baixo' },
  { nome: 'São Sebastião do Uatumã', regiao: 'Médio Amazonas', populacao: '11.951', risco: 'Baixo' },
  { nome: 'Boa Vista do Ramos', regiao: 'Médio Amazonas', populacao: '23.413', risco: 'Baixo' },
  { nome: 'Barcelos', regiao: 'Alto Rio Negro', populacao: '31.260', risco: 'Em análise' },
  { nome: 'Santa Isabel do Rio Negro', regiao: 'Alto Rio Negro', populacao: '18.665', risco: 'Em análise' },
  { nome: 'Cucuí', regiao: 'Alto Rio Negro', populacao: '2.400', risco: 'Em análise' },
  { nome: 'Maraã', regiao: 'Juruá', populacao: '18.512', risco: 'Em análise' },
  { nome: 'Alvarães', regiao: 'Juruá', populacao: '14.540', risco: 'Em análise' },
  { nome: 'Uarini', regiao: 'Juruá', populacao: '14.261', risco: 'Em análise' },
  { nome: 'Ipixuna', regiao: 'Juruá', populacao: '29.015', risco: 'Em análise' },
  { nome: 'Guajará', regiao: 'Juruá', populacao: '26.098', risco: 'Em análise' },
]

const REGIOES = Array.from(new Set(MUNICIPIOS.map((m) => m.regiao))).sort()

const riscoColor: Record<Risco, string> = {
  Alto: 'bg-red-500/20 text-red-400 border-red-500/30',
  Médio: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Baixo: 'bg-green-500/20 text-green-400 border-green-500/30',
  'Em análise': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

const CONTAGEM = MUNICIPIOS.reduce((acc, m) => {
  acc[m.risco] = (acc[m.risco] || 0) + 1
  return acc
}, {} as Record<string, number>)

export default function MunicipiosPage() {
  return (
    <main>
      <Nav />

      <section className="bg-obs-navy px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">Monitoramento estadual</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Municípios do Amazonas</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Monitoramento contínuo dos 62 municípios do estado, organizados por calhas regionais,
            com classificação de risco baseada em indicadores de segurança pública.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-obs-navy to-[#0F2A45] px-4 md:px-8 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['Alto', 'Médio', 'Baixo', 'Em análise'] as Risco[]).map((r) => (
            <div key={r} className={`border p-4 ${riscoColor[r]}`}>
              <p className="text-2xl font-bold mb-1">{CONTAGEM[r] || 0}</p>
              <p className="text-xs font-semibold tracking-wider uppercase">{r}</p>
            </div>
          ))}
        </div>
      </section>

      {REGIOES.map((regiao) => {
        const municipiosRegiao = MUNICIPIOS.filter((m) => m.regiao === regiao)
        return (
          <section key={regiao} className="bg-[#0F2A45] px-4 md:px-8 py-8 border-t border-white/10">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-4">
                Calha do {regiao} · {municipiosRegiao.length} municípios
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/40 text-xs font-bold tracking-widest uppercase pb-2 pr-8">Município</th>
                      <th className="text-right text-white/40 text-xs font-bold tracking-widest uppercase pb-2 pr-8">População (est.)</th>
                      <th className="text-left text-white/40 text-xs font-bold tracking-widest uppercase pb-2">Risco</th>
                    </tr>
                  </thead>
                  <tbody>
                    {municipiosRegiao.map((m, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-2.5 pr-8 text-white/80 font-medium">{m.nome}</td>
                        <td className="py-2.5 pr-8 text-right text-white/50 text-xs">{m.populacao}</td>
                        <td className="py-2.5">
                          <span className={`text-xs font-bold px-2 py-0.5 border ${riscoColor[m.risco]}`}>
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
        )
      })}

      <section className="bg-obs-navy px-4 md:px-8 py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/30 text-xs">
            Classificação de risco baseada em taxa de CVLI por 100 mil habitantes, conforme metodologia do Observatório.
            Municípios &quot;Em análise&quot; estão em fase de integração ao sistema de monitoramento.
            Dados populacionais: IBGE — estimativas 2024.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
