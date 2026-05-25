import ObservatorioLayout from '@/components/ObservatorioLayout'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const metadata = {
  title: 'Observatório da Criança — Segurança Pública do Amazonas',
  description:
    'Monitoramento dos crimes contra crianças e adolescentes em Manaus, com indicadores de violência sexual a partir do SINESP.',
}

export default function ObservatorioCriancaPage() {
  return <ObservatorioLayout config={OBSERVATORIOS.crianca} />
}
