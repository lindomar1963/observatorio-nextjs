import ObservatorioLayout from '@/components/ObservatorioLayout'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const metadata = {
  title: 'Observatório de Crimes Digitais — Segurança Pública do Amazonas',
  description:
    'Monitoramento dos crimes digitais que mais afetam a população em Manaus: estelionato online, fraude bancária, golpes do PIX e invasão de dispositivos, com indicadores do SINESP.',
}

export default function ObservatorioDigitaisPage() {
  return <ObservatorioLayout config={OBSERVATORIOS.digitais} />
}
