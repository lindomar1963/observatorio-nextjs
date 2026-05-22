'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const SYMPLA = 'https://www.sympla.com.br/evento/4-seminario-de-seguranca-inovadora/3382699'
const EVENT_DATE = new Date('2026-05-28T08:00:00-04:00')

const TEMAS = [
  { num: 'EIXO 01', titulo: 'Controle Territorial e Ordem Pública', desc: 'Estratégias operacionais para recuperação e manutenção do controle territorial em áreas de alta vulnerabilidade e conflito.' },
  { num: 'EIXO 02', titulo: 'Inteligência Policial e Prevenção ao Crime', desc: 'Uso de dados, análise criminal e sistemas de inteligência para prevenção e combate à criminalidade organizada.' },
  { num: 'EIXO 03', titulo: 'Tecnologia e Inovação na Segurança Pública', desc: 'Câmeras de reconhecimento facial, drones, softwares de gestão, IA aplicada ao policiamento e sistemas de monitoramento.' },
  { num: 'EIXO 04', titulo: 'Participação Social e Cidadania', desc: 'Conselhos comunitários de segurança, ouvidorias, mecanismos de denúncia e o papel da sociedade civil na construção de políticas.' },
  { num: 'EIXO 05', titulo: 'Legislação e Políticas Públicas de Segurança', desc: 'Produção legislativa, normativas estaduais e federais, financiamento da segurança pública e gestão institucional.' },
  { num: 'EIXO 06', titulo: 'Valorização dos Profissionais de Segurança', desc: 'Saúde mental, proteção social, remuneração, formação e qualificação dos militares estaduais e agentes de segurança.' },
]

const PALESTRANTES = [
  { nome: 'Dep. Comandante Dan', cargo: 'Deputado Estadual · Presidente da Comissão de Segurança Pública da ALEAM · Republicanos/AM', tag: 'ANFITRIÃO', tagColor: '#00e5ff' },
  { nome: 'Cel PMESP RR José Vicente da Silva', cargo: 'Ex-Secretário Nacional de Segurança Pública · Professor CAES/PMESP · São Paulo', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Cel PMESP RR Azor Lopes da Silva Júnior', cargo: 'Presidente do IBSP — Instituto Brasileiro de Segurança Pública · São Paulo', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Cel PMPI Jacks Daienne Galvão Pereira', cargo: 'Coordenador-Geral de Fronteiras e Amazônia — SENASP/MJ · Brasília', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Prof. Ricardo Brisola Balestreri', cargo: 'Coordenador do Núcleo de Urbanismo Social e Segurança Pública — INSPER · São Paulo', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Cel BM RR Paulo Roberto Locateli Gandim', cargo: 'Secretário de Segurança Pública de Lajeado/RS — SSP/LAJEADO', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Cel PMRS Mário Yukio Ikeda', cargo: 'Secretário de Segurança Pública do Rio Grande do Sul — SSP/RS', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'PRF Benjamin Affonso Neto', cargo: 'Superintendente da Polícia Rodoviária Federal no Amazonas — SRPRF/AM', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'DPF Humberto Freire de Barros', cargo: 'Diretor da Amazônia e Meio Ambiente — DAMAZ/Polícia Federal', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Cel PMDF Weslei de Almeida e Santos', cargo: 'Chefe da Casa Militar da Polícia Militar do Distrito Federal', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Del. Bruno de Paula Fraga', cargo: 'Delegado Geral da Polícia Civil do Amazonas · Manaus', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Braulio Figueiredo Alves da Silva', cargo: 'Coordenador do CRISP/UFMG · Professor Associado de Sociologia — UFMG · MG', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Prof. Cláudio Santiago Dias', cargo: 'Pesquisador do CRISP — Centro de Estudos em Criminalidade e Segurança Pública — UFMG', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Cel BM Orleiso Ximenes Muniz', cargo: 'Comandante-Geral do Corpo de Bombeiros Militar do Amazonas — CBMAM · Manaus', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Cel PM Marcos Klinger dos Santos Paiva', cargo: 'Comandante-Geral da Polícia Militar do Amazonas — PMAM · Manaus', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Gen Bda Glauco Corbari Corrêa', cargo: 'Chefe do Centro de Coordenação de Operações do CMA — Ch CCOp/CMA · Manaus', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Cel PMCE Alkimar Sampaio de Souza', cargo: 'Oficial Superior da PMCE · Especialista em Segurança de Fronteiras', tag: 'CONFIRMADO', tagColor: '#2edc10' },
  { nome: 'Cel PMAM Anézio Brito de Paiva', cargo: 'Secretário de Segurança Pública do Amazonas — SSP/AM · Manaus', tag: 'CONFIRMADO', tagColor: '#2edc10' },
]

type ProgItem = { hora: string; atividade: string; detalhe: string; tipo: string }

const DIA1: ProgItem[] = [
  { hora: '08h00', atividade: 'Credenciamento', detalhe: 'Hall do Auditório Belarmino Lins', tipo: 'credenciamento' },
  { hora: '08h45', atividade: 'Cerimônia de Abertura Oficial', detalhe: 'Dep. Adjuto Afonso — Presidente da ALEAM · Dep. Comandante Dan — Presidente da Comissão de Segurança Pública da ALEAM', tipo: 'abertura' },
  { hora: '09h20', atividade: 'Cel PMESP RR José Vicente da Silva', detalhe: 'ITI: Inteligência, Território e Integração — Fatores Críticos da Prevenção Criminal', tipo: 'palestra' },
  { hora: '10h15', atividade: 'DPF Humberto Freire de Barros', detalhe: 'Atuação do Centro de Cooperação Policial Internacional da Amazônia no Fortalecimento da Integração e Cooperação na Segurança Pública da Amazônia — DAMAZ/PF', tipo: 'palestra' },
  { hora: '11h10', atividade: 'Professor Braulio Figueiredo Alves da Silva', detalhe: 'Observatórios de Segurança Pública Municipais: Inteligência e Gestão Baseadas em Evidências para Cidades Mais Seguras — CRISP/UFMG', tipo: 'palestra' },
  { hora: '12h05', atividade: 'Cel PMPI Jacks Daienne Galvão Pereira', detalhe: 'As Ações do CGFRON/DIOP como Política Pública Transversal no Enfrentamento ao Crime Organizado na Faixa de Fronteiras do Brasil — SENASP', tipo: 'palestra' },
  { hora: '13h00', atividade: 'Intervalo para Almoço', detalhe: 'Networking entre participantes', tipo: 'intervalo' },
  { hora: '14h05', atividade: 'Cel BM RR Paulo Roberto Locatelli Gandim', detalhe: 'Construindo Políticas Eficazes: A Experiência de Lajeado na Articulação entre Poder Público, Aplicação da Lei e Comunidade — SSP/LAJEADO', tipo: 'palestra' },
  { hora: '15h00', atividade: 'PRF Benjamin Affonso Neto', detalhe: 'Propostas de Incremento da Segurança Viária na Perspectiva Intersetorial — Superintendente Regional da PRF no Amazonas', tipo: 'palestra' },
  { hora: '15h00', atividade: 'Cel PMRS Mário Yukio Ikeda', detalhe: 'Gestão da Segurança Pública: Integração, Inteligência e Investimento Qualificado — Secretário de Segurança Pública do Rio Grande do Sul', tipo: 'palestra' },
  { hora: '16h00', atividade: 'Cel PMAM Anézio Brito de Paiva', detalhe: 'Diretrizes Para a Segurança Pública do Amazonas — Secretário de Segurança Pública do Amazonas', tipo: 'palestra' },
  { hora: '17h00', atividade: 'Encerramento do 1º Dia', detalhe: '', tipo: 'encerramento' },
]

const DIA2: ProgItem[] = [
  { hora: '08h00', atividade: 'Credenciamento 2º Dia', detalhe: 'Hall do Auditório Belarmino Lins', tipo: 'credenciamento' },
  { hora: '09h00', atividade: 'Prof. Cláudio Santiago Dias', detalhe: 'Diagnóstico Intersetorial da Segurança Pública em Minas Gerais: Capacidades, Desafios e Caminhos para a Integração — CRISP/UFMG', tipo: 'palestra' },
  { hora: '09h55', atividade: 'Cel PMESP RR Azor Lopes da Silva Júnior', detalhe: 'PEC da Segurança Pública como Instrumento de Integração, Controle Territorial e Participação Social na Consolidação da Ordem Pública — IBSP', tipo: 'palestra' },
  { hora: '10h50', atividade: 'Prof. Ricardo Brisola Balestreri', detalhe: 'Para uma Política Pública Eficiente e de Complexidade na Retomada de Territórios Conflagrados — Núcleo de Urbanismo Social e Segurança Pública — INSPER', tipo: 'palestra' },
  { hora: '11h45', atividade: 'Cel PMDF Weslei de Almeida e Santos', detalhe: 'Gestão Operacional em Cenários de Alta Complexidade: A Reorganização da PMDF em Ambiente de Crise — Chefe da Casa Militar da PMDF', tipo: 'palestra' },
  { hora: '12h40', atividade: 'Intervalo para Almoço', detalhe: 'Networking entre participantes', tipo: 'intervalo' },
  { hora: '13h45', atividade: 'Cel PMCE Alkimar Sampaio de Souza', detalhe: 'Ameaças Híbridas no Contexto do Entorno das Fronteiras do Brasil', tipo: 'palestra' },
  { hora: '14h40', atividade: 'Gen Bda Glauco Corbari Corrêa', detalhe: 'As Operações do CMA no Combate aos Ilícitos Transfronteiriços e Ambientais: Segurança, Defesa e Soberania Fortalecidas — Ch CCOp/CMA', tipo: 'palestra' },
  { hora: '15h35', atividade: 'Mesa Redonda — Capilaridade de Política de Segurança Pública dos Municípios do Amazonas', detalhe: 'Del. Bruno de Paula Fraga — DGPC · Cel PM Marcos Klinger — CMT Geral da PMAM · Cel BM Orleilso Ximenes Muniz — CMT CBMAM', tipo: 'painel' },
  { hora: '16h30', atividade: 'Deputado Estadual Comandante Dan', detalhe: 'O Papel do Legislativo Estadual na Dinâmica da Ordem Pública e do Controle Territorial como Fator Crítico de Sucesso da Integração e Participação da Sociedade nas Políticas Públicas', tipo: 'palestra' },
  { hora: '17h45', atividade: 'Cerimônia de Encerramento e Certificação', detalhe: 'Entrega de certificados, agradecimentos e anúncio da 5ª edição', tipo: 'encerramento' },
]

const TIPO_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  palestra:       { bg: 'rgba(0,229,255,0.12)',    text: '#00e5ff', label: 'Palestra' },
  painel:         { bg: 'rgba(46,220,16,0.12)',     text: '#2edc10', label: 'Mesa Redonda' },
  intervalo:      { bg: 'rgba(255,214,0,0.12)',     text: '#ffd600', label: 'Intervalo' },
  credenciamento: { bg: 'rgba(255,214,0,0.12)',     text: '#ffd600', label: 'Credenciamento' },
  abertura:       { bg: 'rgba(21,101,192,0.20)',    text: '#90caf9', label: 'Abertura' },
  encerramento:   { bg: 'rgba(21,101,192,0.20)',    text: '#90caf9', label: 'Encerramento' },
}

function pad(n: number) { return String(n).padStart(2, '0') }

function getInitials(nome: string) {
  const words = nome.replace(/^(Cel|Gen|Del|Prof|PRF|DPF|Dep)\.\s*/i, '').trim().split(' ')
  return (words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')
}

function ProgRow({ item }: { item: ProgItem }) {
  const style = TIPO_COLORS[item.tipo] ?? TIPO_COLORS.palestra
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '110px 1fr',
      gap: '1.5rem',
      padding: '1rem 1.25rem',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      alignItems: 'start',
    }}>
      <div style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.85rem', color: '#2edc10', paddingTop: '0.1rem', flexShrink: 0 }}>
        {item.hora}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '0.95rem', fontWeight: 600, color: '#f0f8ff', marginBottom: '0.25rem' }}>
          {item.atividade}
        </div>
        {item.detalhe && (
          <div style={{ fontSize: '0.78rem', color: 'rgba(240,248,255,0.5)', lineHeight: 1.5, marginBottom: '0.4rem', fontFamily: 'var(--font-exo2, sans-serif)', fontWeight: 300 }}>
            {item.detalhe}
          </div>
        )}
        <span style={{
          display: 'inline-block',
          padding: '0.15rem 0.6rem',
          fontSize: '0.62rem',
          fontFamily: 'var(--font-stm, monospace)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          background: style.bg,
          color: style.text,
          borderRadius: '2px',
        }}>
          {style.label}
        </span>
      </div>
    </div>
  )
}

function Countdown() {
  const [time, setTime] = useState({ dias: 0, horas: 0, min: 0, seg: 0, ended: false })

  useEffect(() => {
    function calc() {
      const diff = EVENT_DATE.getTime() - Date.now()
      if (diff <= 0) { setTime({ dias: 0, horas: 0, min: 0, seg: 0, ended: true }); return }
      const dias  = Math.floor(diff / 86400000)
      const horas = Math.floor((diff % 86400000) / 3600000)
      const min   = Math.floor((diff % 3600000) / 60000)
      const seg   = Math.floor((diff % 60000) / 1000)
      setTime({ dias, horas, min, seg, ended: false })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])

  if (time.ended) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'var(--font-stm, monospace)', fontSize: '1rem', color: '#2edc10', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        O evento está acontecendo!
      </div>
    )
  }

  const boxes = [
    { val: pad(time.dias),  unit: 'Dias' },
    { val: pad(time.horas), unit: 'Horas' },
    { val: pad(time.min),   unit: 'Minutos' },
    { val: pad(time.seg),   unit: 'Segundos' },
  ]

  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      {boxes.map(({ val, unit }) => (
        <div key={unit} style={{
          background: 'rgba(0,229,255,0.06)',
          border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          textAlign: 'center',
          minWidth: '90px',
        }}>
          <div style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#00e5ff', lineHeight: 1 }}>
            {val}
          </div>
          <div style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(240,248,255,0.4)', textTransform: 'uppercase', marginTop: '0.3rem' }}>
            {unit}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SeminarioContent() {
  const navy  = '#020d1f'
  const navy2 = '#041228'
  const cyan  = '#00e5ff'
  const green = '#2edc10'
  const border = 'rgba(0,229,255,0.12)'

  return (
    <div style={{ background: navy, color: '#f0f8ff', fontFamily: 'var(--font-exo2, sans-serif)', fontWeight: 300 }}>
      <Nav />

      {/* HERO */}
      <section style={{
        padding: '6rem 6vw 4rem',
        position: 'relative',
        background: `linear-gradient(180deg, ${navy} 0%, ${navy2} 100%)`,
        borderBottom: `1px solid ${border}`,
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '0.3rem 1rem',
          background: 'rgba(46,220,16,0.08)',
          border: '1px solid rgba(46,220,16,0.25)',
          borderRadius: '3px',
          fontFamily: 'var(--font-stm, monospace)',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: green,
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>
          ▸ QUARTA EDIÇÃO • MANAUS • 2026 ◂
        </div>

        <h1 style={{
          fontFamily: 'var(--font-rajdhani, sans-serif)',
          fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          lineHeight: 1.0,
          marginBottom: '1.2rem',
        }}>
          4º Seminário de<br />
          <span style={{ color: cyan }}>Segurança</span><br />
          Inovadora
        </h1>

        <p style={{ fontSize: '1rem', color: 'rgba(240,248,255,0.6)', maxWidth: '680px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Ordem Pública e Controle Territorial: Integração e Participação da Sociedade na Construção de Políticas de Segurança Pública Eficazes
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {[
            { icon: '📅', text: '28 e 29 de Maio de 2026' },
            { icon: '🕗', text: '08h às 17h' },
            { icon: '📍', text: 'Assembleia Legislativa do Amazonas' },
            { icon: '🎫', text: 'Entrada Gratuita' },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: 'flex', gap: '0.5rem', alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${border}`,
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              color: 'rgba(240,248,255,0.75)',
              fontFamily: 'var(--font-exo2, sans-serif)',
            }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={SYMPLA}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: `linear-gradient(135deg, ${green} 0%, #00c853 100%)`,
              color: navy,
              fontFamily: 'var(--font-rajdhani, sans-serif)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.9rem 2.5rem',
              borderRadius: '5px',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(46,220,16,0.3)',
            }}
          >
            ✦ Garantir Minha Vaga Gratuita
          </a>
          <a
            href="#programacao"
            style={{
              display: 'inline-block',
              border: `1px solid ${border}`,
              color: 'rgba(240,248,255,0.7)',
              fontFamily: 'var(--font-rajdhani, sans-serif)',
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.9rem 2rem',
              borderRadius: '5px',
              textDecoration: 'none',
            }}
          >
            Ver Programação
          </a>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section style={{
        padding: '2.5rem 6vw',
        background: navy2,
        borderBottom: `1px solid ${border}`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <span style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(240,248,255,0.35)', textTransform: 'uppercase' }}>
            ⟩ Contagem regressiva para o evento ⟨
          </span>
        </div>
        <Countdown />
      </section>

      {/* SOBRE */}
      <section style={{ padding: '5rem 6vw', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.65rem', letterSpacing: '0.2em', color: cyan, textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            // sobre o evento
          </p>
          <h2 style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '1rem' }}>
            O maior fórum de<br /><em style={{ color: cyan, fontStyle: 'normal' }}>segurança pública</em><br />do Amazonas
          </h2>
          <div style={{ width: '40px', height: '2px', background: `linear-gradient(90deg, ${green}, ${cyan})`, borderRadius: '2px', marginBottom: '1.5rem' }} />
          <p style={{ color: 'rgba(240,248,255,0.7)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
            O <strong style={{ color: '#f0f8ff' }}>4º Seminário de Segurança Inovadora</strong> é o maior evento de debate estratégico sobre segurança pública do Estado do Amazonas, realizado pela <strong style={{ color: '#f0f8ff' }}>Assembleia Legislativa do Amazonas (ALEAM)</strong>, sob a liderança do <strong style={{ color: '#f0f8ff' }}>Deputado Comandante Dan</strong>, Presidente da Comissão de Segurança Pública, Acesso à Justiça e Defesa Social.
          </p>
          <p style={{ color: 'rgba(240,248,255,0.7)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
            Em sua quarta edição, o evento reúne gestores públicos, operadores de segurança, pesquisadores, parlamentares e a sociedade civil para construir juntos soluções práticas e inovadoras para os desafios da segurança no Amazonas e no Brasil.
          </p>
          <p style={{ color: 'rgba(240,248,255,0.7)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            Dois dias de <strong style={{ color: '#f0f8ff' }}>palestras, painéis e debates</strong> com especialistas nacionais e regionais, abordando temas como inteligência policial, controle territorial, tecnologia aplicada à segurança e participação cidadã.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignContent: 'start' }}>
          {[
            { num: '2',    label: 'Dias de imersão completa em segurança pública' },
            { num: '18h',  label: 'De conteúdo técnico e debates qualificados' },
            { num: '18',   label: 'Palestrantes e especialistas confirmados' },
            { num: '100%', label: 'Gratuito e aberto ao público — vagas limitadas' },
          ].map(({ num, label }) => (
            <div key={num} style={{
              background: 'rgba(0,229,255,0.04)',
              border: `1px solid ${border}`,
              borderRadius: '8px',
              padding: '1.5rem 1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '2rem', fontWeight: 700, color: cyan }}>
                {num}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,248,255,0.5)', lineHeight: 1.5, marginTop: '0.4rem' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEMAS */}
      <section style={{ padding: '5rem 6vw', background: navy2, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.65rem', letterSpacing: '0.2em', color: cyan, textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              // eixos temáticos
            </p>
            <h2 style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, textTransform: 'uppercase' }}>
              O que vamos <em style={{ color: cyan, fontStyle: 'normal' }}>debater</em>
            </h2>
            <div style={{ width: '40px', height: '2px', background: `linear-gradient(90deg, ${green}, ${cyan})`, borderRadius: '2px', margin: '1rem auto 0' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {TEMAS.map((t) => (
              <div key={t.num} style={{
                background: 'rgba(4,18,40,0.7)',
                border: `1px solid ${border}`,
                borderRadius: '10px',
                padding: '1.75rem',
                transition: 'border-color 0.3s',
              }}>
                <div style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.65rem', letterSpacing: '0.2em', color: green, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  {t.num}
                </div>
                <div style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '1rem', fontWeight: 700, color: '#f0f8ff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.6rem' }}>
                  {t.titulo}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(240,248,255,0.55)', lineHeight: 1.6 }}>
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PALESTRANTES */}
      <section style={{ padding: '5rem 6vw', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.65rem', letterSpacing: '0.2em', color: cyan, textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              // confirmados
            </p>
            <h2 style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, textTransform: 'uppercase' }}>
              <em style={{ color: cyan, fontStyle: 'normal' }}>Palestrantes</em><br />e Especialistas
            </h2>
            <div style={{ width: '40px', height: '2px', background: `linear-gradient(90deg, ${green}, ${cyan})`, borderRadius: '2px', margin: '1rem auto 0' }} />
            <p style={{ color: 'rgba(240,248,255,0.45)', fontSize: '0.88rem', marginTop: '0.8rem', fontWeight: 300 }}>
              18 palestrantes confirmados de todo o Brasil.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.25rem' }}>
            {PALESTRANTES.map((p) => (
              <div key={p.nome} style={{
                background: 'rgba(4,18,40,0.7)',
                border: `1px solid ${border}`,
                borderRadius: '10px',
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '72px', height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d2d52, #1565c0)',
                  margin: '0 auto 1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-rajdhani, sans-serif)',
                  fontSize: '1.5rem', fontWeight: 700, color: cyan,
                  border: `2px solid ${border}`,
                }}>
                  {getInitials(p.nome)}
                </div>
                <div style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '0.95rem', fontWeight: 700, color: '#f0f8ff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.3rem', lineHeight: 1.3 }}>
                  {p.nome}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(240,248,255,0.45)', lineHeight: 1.5, marginBottom: '0.7rem' }}>
                  {p.cargo}
                </div>
                <span style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-stm, monospace)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  color: p.tagColor,
                  border: `1px solid ${p.tagColor}40`,
                  background: `${p.tagColor}18`,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '2px',
                }}>
                  {p.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMAÇÃO */}
      <section id="programacao" style={{ padding: '5rem 6vw', background: navy2, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.65rem', letterSpacing: '0.2em', color: cyan, textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              // grade completa
            </p>
            <h2 style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, textTransform: 'uppercase' }}>
              Programação <em style={{ color: cyan, fontStyle: 'normal' }}>Oficial</em>
            </h2>
            <div style={{ width: '40px', height: '2px', background: `linear-gradient(90deg, ${green}, ${cyan})`, borderRadius: '2px', marginTop: '1rem' }} />
          </div>

          {/* Dia 1 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(46,220,16,0.12) 0%, rgba(0,0,0,0) 100%)',
            borderLeft: `4px solid ${green}`,
            borderRadius: '6px',
            marginBottom: '0.5rem',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '0.7rem', fontWeight: 700, color: green, letterSpacing: '2px', textTransform: 'uppercase' }}>1º Dia</div>
              <div style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>
                28 DE MAIO DE 2026 <span style={{ color: green }}>•</span>{' '}
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#a0a0b0' }}>Quinta-feira</span>
              </div>
            </div>
          </div>
          <div style={{ border: `1px solid ${border}`, borderRadius: '8px', overflow: 'hidden', marginBottom: '3rem' }}>
            {DIA1.map((item, i) => <ProgRow key={i} item={item} />)}
          </div>

          {/* Dia 2 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(46,220,16,0.12) 0%, rgba(0,0,0,0) 100%)',
            borderLeft: `4px solid ${green}`,
            borderRadius: '6px',
            marginBottom: '0.5rem',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '0.7rem', fontWeight: 700, color: green, letterSpacing: '2px', textTransform: 'uppercase' }}>2º Dia</div>
              <div style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>
                29 DE MAIO DE 2026 <span style={{ color: green }}>•</span>{' '}
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#a0a0b0' }}>Sexta-feira</span>
              </div>
            </div>
          </div>
          <div style={{ border: `1px solid ${border}`, borderRadius: '8px', overflow: 'hidden' }}>
            {DIA2.map((item, i) => <ProgRow key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* LOCAL */}
      <section style={{ padding: '5rem 6vw', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.65rem', letterSpacing: '0.2em', color: cyan, textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              // onde acontece
            </p>
            <h2 style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
              Local do <em style={{ color: cyan, fontStyle: 'normal' }}>Evento</em>
            </h2>
            <div style={{ width: '40px', height: '2px', background: `linear-gradient(90deg, ${green}, ${cyan})`, borderRadius: '2px', marginBottom: '2rem' }} />
            {[
              { icon: '🏛️', strong: 'Assembleia Legislativa do Amazonas', span: 'Av. Mário Ypiranga Monteiro, 3950 — Parque 10 de Novembro\nManaus — AM — CEP: 69050-030' },
              { icon: '📅', strong: '28 e 29 de Maio de 2026',           span: 'Quinta e Sexta-feira' },
              { icon: '🕗', strong: 'Das 08h às 17h',                     span: 'Credenciamento a partir das 08h00' },
              { icon: '🎫', strong: 'Evento Gratuito',                    span: 'Vagas limitadas — inscrição obrigatória pelo Sympla' },
              { icon: '📋', strong: 'Certificado de Participação',        span: 'Emitido ao final do evento mediante presença' },
            ].map(({ icon, strong, span }) => (
              <div key={strong} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.2rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</span>
                <div>
                  <strong style={{ display: 'block', fontFamily: 'var(--font-rajdhani, sans-serif)', fontSize: '0.95rem', fontWeight: 700, color: '#f0f8ff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
                    {strong}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(240,248,255,0.5)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {span}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            background: 'rgba(4,18,40,0.6)',
            border: `1px solid ${border}`,
            borderRadius: '12px',
            height: '360px',
            overflow: 'hidden',
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.0!2d-60.023!3d-3.115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926c0d!2sAssembleia+Legislativa+do+Amazonas!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="100%"
              style={{ border: 'none', filter: 'invert(0.9) hue-rotate(180deg) saturate(0.7)', opacity: 0.85 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa da Assembleia Legislativa do Amazonas"
            />
          </div>
        </div>
      </section>

      {/* CTA INSCRIÇÃO */}
      <section style={{
        padding: '6rem 6vw',
        textAlign: 'center',
        background: `linear-gradient(180deg, ${navy} 0%, ${navy2} 100%)`,
        borderBottom: `1px solid ${border}`,
        position: 'relative',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, rgba(46,220,16,0.10), rgba(0,229,255,0.10))',
          border: '1px solid rgba(46,220,16,0.28)',
          borderRadius: '3px',
          padding: '0.4rem 1.2rem',
          fontFamily: 'var(--font-stm, monospace)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          color: green,
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>
          ✦ VAGAS LIMITADAS • EVENTO GRATUITO ✦
        </div>
        <h2 style={{
          fontFamily: 'var(--font-rajdhani, sans-serif)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          textTransform: 'uppercase',
          lineHeight: 1.05,
          marginBottom: '1rem',
        }}>
          Garanta sua vaga<br /><em style={{ color: green, fontStyle: 'normal' }}>agora mesmo</em>
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(240,248,255,0.6)', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Inscrição 100% gratuita e obrigatória. As vagas são limitadas e o credenciamento é feito exclusivamente pelo Sympla.
        </p>
        <a
          href={SYMPLA}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, #39ff14 0%, #00c853 100%)`,
            color: navy,
            fontFamily: 'var(--font-rajdhani, sans-serif)',
            fontWeight: 700,
            fontSize: '1.2rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '1rem 3rem',
            borderRadius: '5px',
            textDecoration: 'none',
            boxShadow: '0 0 38px rgba(46,220,16,0.35)',
          }}
        >
          ✦ Quero Me Inscrever Gratuitamente ✦
        </a>
        <p style={{ marginTop: '1rem', fontFamily: 'var(--font-stm, monospace)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(240,248,255,0.3)', textTransform: 'uppercase' }}>
          Inscrição via Sympla • Certificado incluso
        </p>
      </section>

      {/* REALIZADORES */}
      <section style={{ padding: '3.5rem 6vw', background: navy2, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'rgba(240,248,255,0.3)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem' }}>
            Realização e Apoio Institucional
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            {[
              { box: 'Comandante Dan',        sub: 'Deputado Estadual' },
              { box: 'Adjuto Afonso',         sub: 'Presidente da ALEAM' },
              { box: 'ALEAM',                 sub: 'Poder Legislativo' },
              { box: 'UNALE',                 sub: 'União Nacional' },
              { box: 'Comissão Seg. Pública', sub: 'ALEAM' },
              { box: 'Observatório',          sub: 'Segurança Pública AM' },
            ].map(({ box, sub }) => (
              <div key={box} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${border}`,
                  borderRadius: '6px',
                  padding: '0.7rem 1.3rem',
                  fontFamily: 'var(--font-rajdhani, sans-serif)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#f0f8ff',
                }}>
                  {box}
                </div>
                <span style={{ fontFamily: 'var(--font-stm, monospace)', fontSize: '0.62rem', color: 'rgba(240,248,255,0.3)' }}>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <a
        href={SYMPLA}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 998,
          background: `linear-gradient(135deg, ${green} 0%, #00c853 100%)`,
          color: navy,
          fontFamily: 'var(--font-rajdhani, sans-serif)',
          fontWeight: 700,
          fontSize: '0.82rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0.75rem 1.4rem',
          borderRadius: '50px',
          textDecoration: 'none',
          boxShadow: '0 4px 24px rgba(46,220,16,0.32)',
        }}
      >
        🎫 Inscreva-se Grátis
      </a>

      <Footer />
    </div>
  )
}
