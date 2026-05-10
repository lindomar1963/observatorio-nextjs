import Link from 'next/link'

export const metadata = {
  title: 'Dados Abertos — Observatório de Segurança Pública do Amazonas',
}

export default function Page() {
  const nav = ['/', '/paineis', '/municipios', '/biblioteca', '/noticias', '/contato']
  const navLabels = ['Início', 'Painéis', 'Municípios', 'Biblioteca', 'Notícias', 'Contato']
  return (
    <main>
      <header style={{background:'#0A1628',padding:'0 2rem',height:'56px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'10px',textDecoration:'none'}}>
          <div style={{width:28,height:32,background:'#C9963B',clipPath:'polygon(50% 0%,100% 15%,100% 60%,50% 100%,0% 60%,0% 15%)',flexShrink:0}}/>
          <div style={{color:'#fff',fontSize:12,fontWeight:600,lineHeight:1.3,letterSpacing:'0.04em'}}>OBSERVATÓRIO<br/><span style={{color:'#C9963B'}}>SEGURANÇA PÚBLICA · AM</span></div>
        </Link>
        <nav style={{display:'flex',gap:'1.5rem'}}>
          {nav.map((href,i)=>(
            <Link key={href} href={href} style={{color:'rgba(255,255,255,0.6)',fontSize:12,fontWeight:600,textDecoration:'none'}}>{navLabels[i]}</Link>
          ))}
        </nav>
      </header>
      <section style={{background:'linear-gradient(135deg,#0A1628,#0F2A45)',minHeight:'82vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'4rem 2rem'}}>
        <div style={{textAlign:'center',maxWidth:560}}>
          <div style={{fontSize:48,marginBottom:'1.5rem'}}>🗄️</div>
          <div style={{display:'inline-block',background:'rgba(201,150,59,0.2)',border:'0.5px solid rgba(201,150,59,0.4)',color:'#C9963B',fontSize:10,fontWeight:700,letterSpacing:'0.1em',padding:'4px 12px',marginBottom:'1rem',textTransform:'uppercase' as const}}>ALEAM · Observatório de Segurança Pública</div>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:30,fontWeight:700,color:'#fff',lineHeight:1.25,marginBottom:'1rem'}}>Dados Abertos</h1>
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:14,lineHeight:1.7,marginBottom:'2rem'}}>Bases de dados públicas sobre segurança pública no Amazonas disponíveis para download. Esta seção está em desenvolvimento e estará disponível em breve.</p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap' as const}}>
            <Link href="/" style={{background:'#C9963B',color:'#0A1628',fontWeight:700,padding:'12px 24px',fontSize:13,textDecoration:'none',display:'inline-block'}}>← Voltar ao início</Link>
            <Link href="/paineis" style={{border:'0.5px solid rgba(255,255,255,0.3)',color:'#fff',fontWeight:600,padding:'12px 24px',fontSize:13,textDecoration:'none',display:'inline-block'}}>Ver Painéis</Link>
          </div>
        </div>
      </section>
      <footer style={{background:'#0A1628',padding:'1.5rem 2rem',textAlign:'center' as const,borderTop:'0.5px solid rgba(255,255,255,0.1)'}}>
        <p style={{color:'rgba(255,255,255,0.25)',fontSize:11}}>© 2026 Observatório de Segurança Pública do Amazonas — ALEAM · Manaus, AM</p>
      </footer>
    </main>
  )
}
