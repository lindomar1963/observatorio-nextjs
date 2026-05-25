import ObservatorioLayout from '@/components/ObservatorioLayout'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const metadata = {
  title: 'Observatório de Roubos e Furtos — Segurança Pública do Amazonas',
  description:
    'Monitoramento de roubos e furtos em Manaus: celulares, pedestres, veículos. Um dos crimes de maior impacto no cotidiano da população, com indicadores do SINESP.',
}

export default function ObservatorioRoubosFurtosPage() {
  return <ObservatorioLayout config={OBSERVATORIOS.celulares} />
}
