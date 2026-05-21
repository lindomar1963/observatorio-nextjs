const parceiros = ['SSP-AM','UFAM','UEA','Ministério Público — AM','Defensoria Pública — AM','TJAM','FBSP','IBGE','FGV','SENASP','DETRAN-AM','SEAP-AM']

export default function Parceiros() {
  return (
    <section className="px-4 md:px-8 py-10 bg-gray-50" aria-labelledby="parc-title">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <p className="text-obs-gold text-xs font-bold tracking-widest uppercase mb-1">Rede Institucional</p>
          <h2 id="parc-title" className="font-display text-xl font-bold text-obs-navy">
            Parceiros do Observatório
          </h2>
        </div>
        <ul className="flex flex-wrap gap-3" aria-label="Instituições parceiras">
          {parceiros.map((p, i) => (
            <li
              key={i}
              className="bg-white border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:border-obs-blue/30 hover:text-obs-blue transition-colors"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
