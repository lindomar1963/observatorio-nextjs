export default function Ticker() {
  return (
    <div
      className="bg-obs-blue px-4 md:px-8 flex items-center gap-4 overflow-hidden"
      style={{ height: '36px' }}
      role="marquee"
      aria-label="Avisos e atualizações recentes"
    >
      <span className="bg-obs-gold text-obs-navy text-xs font-bold px-2 py-0.5 flex-shrink-0 uppercase tracking-widest">
        Atualização
      </span>
      <p className="text-white/80 text-xs whitespace-nowrap">
        Dados atualizados diariamente · Fonte: SSP-AM / SINESP &nbsp;·&nbsp;
        Novo relatório: Segurança Pública no Interior do Amazonas — 1º Trim. 2026 &nbsp;·&nbsp;
        Seminário: Violência e Território Amazônico · 22/05/2026 · Auditório ALEAM
      </p>
    </div>
  )
}
