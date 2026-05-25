import ObservatorioLayout from '@/components/ObservatorioLayout'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const metadata = {
  title: 'Observatório do Idoso — Segurança Pública do Amazonas',
  description:
    'Monitoramento dos crimes contra a pessoa idosa em Manaus: violência física, estelionato, abandono e ameaça, com indicadores do SINESP e base no Estatuto do Idoso.',
}

export default function ObservatorioIdosoPage() {
  return <ObservatorioLayout config={OBSERVATORIOS.idoso} />
}
