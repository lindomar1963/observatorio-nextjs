import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    portal: 'Observatório de Segurança Pública do Amazonas — ALEAM',
  })
}
