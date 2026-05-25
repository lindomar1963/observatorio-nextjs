import ObservatorioLayout from '@/components/ObservatorioLayout'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const metadata = {
  title: 'Observatório de Acidentes de Trânsito — Segurança Pública do Amazonas',
  description:
    'Monitoramento dos acidentes e crimes de trânsito em Manaus: sinistros fatais, embriaguez ao volante, atropelamentos e lesões, com indicadores do SINESP.',
}

export default function ObservatorioTransitoPage() {
  return <ObservatorioLayout config={OBSERVATORIOS.transito} />
}
