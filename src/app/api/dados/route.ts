import { NextResponse } from 'next/server'
export const revalidate = 86400
export async function GET() {
  const dados = {
    atualizado_em: new Date().toISOString(),
    fonte: 'SSP-AM / SINESP',
    indicadores: {
      cvli_12m: 1847,
      cvli_variacao: -5.2,
      roubos_ano: 17243,
      roubos_variacao: 2.1,
      violencia_domestica_ano: 3892,
      municipios_monitorados: 62,
      municipios_em_alerta: 14,
    },
    tendencia_mensal_2025: [155,138,162,144,151,133,147,139,158,141,136,123],
    municipios_destaque: [
      { nome: 'Manaus', cvli: 1124, risco: 'Alto' },
      { nome: 'Parintins', cvli: 89, risco: 'Médio' },
      { nome: 'Itacoatiara', cvli: 74, risco: 'Médio' },
    ],
  }
  return NextResponse.json(dados)
}
