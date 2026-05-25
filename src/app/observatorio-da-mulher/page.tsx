import ObservatorioLayout from '@/components/ObservatorioLayout'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const metadata = {
  title: 'Observatório da Mulher — Segurança Pública do Amazonas',
  description:
    'Monitoramento territorial dos crimes contra a mulher em Manaus: feminicídio, estupro, violência doméstica e ameaça, com indicadores oficiais do SINESP.',
}

export default function ObservatorioMulherPage() {
  return <ObservatorioLayout config={OBSERVATORIOS.mulher} />
}
