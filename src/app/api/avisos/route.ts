/**
 * API route: /api/avisos
 * Retorna os avisos ativos do ticker, sempre frescos (sem cache),
 * para que novas inserções no painel apareçam imediatamente no site.
 */

import { NextResponse } from 'next/server'
import { getAvisosTicker } from '@/lib/queries'
import type { AvisoTicker } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(): Promise<NextResponse<{ avisos: AvisoTicker[] }>> {
  const avisos = await getAvisosTicker()
  return NextResponse.json(
    { avisos },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  )
}
