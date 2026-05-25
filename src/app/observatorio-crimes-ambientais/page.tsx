import ObservatorioLayout from '@/components/ObservatorioLayout'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const metadata = {
  title: 'Observatório de Crimes Ambientais — Amazonas',
  description:
    'Monitoramento de crimes ambientais na região de Manaus: desmatamento, queimadas, garimpo e pesca ilegal, com dados de focos de calor do INPE.',
}

export default function ObservatorioAmbientaisPage() {
  return <ObservatorioLayout config={OBSERVATORIOS.ambientais} />
}
