import { NextResponse } from 'next/server'
import { getDadosDiarios } from '@/lib/queries'

export const revalidate = 3600

export async function GET() {
  const dados = await getDadosDiarios()
  return NextResponse.json(dados)
}
