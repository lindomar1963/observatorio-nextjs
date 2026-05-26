import ObservatorioLayout from '@/components/ObservatorioLayout'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const metadata = {
  title: 'Observatório de Crimes Cibernéticos — Segurança Pública do Amazonas',
  description:
    'Monitoramento dos crimes cibernéticos que mais afetam a população em Manaus: estelionato online, fraude bancária, golpes do PIX e invasão de dispositivos, com indicadores do SINESP.',
}

export default function ObservatorioDigitaisPage() {
  return <ObservatorioLayout config={OBSERVATORIOS.digitais} />
}
