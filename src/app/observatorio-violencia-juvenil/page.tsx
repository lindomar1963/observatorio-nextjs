import ObservatorioLayout from '@/components/ObservatorioLayout'
import { OBSERVATORIOS } from '@/lib/observatorios'

export const metadata = {
  title: 'Observatório de Violência Juvenil — Segurança Pública do Amazonas',
  description:
    'Monitoramento da violência que atinge e envolve jovens em Manaus: homicídios juvenis, lesões, atos infracionais e envolvimento com o tráfico, com indicadores do SINESP.',
}

export default function ObservatorioJuvenilPage() {
  return <ObservatorioLayout config={OBSERVATORIOS.juvenil} />
}
