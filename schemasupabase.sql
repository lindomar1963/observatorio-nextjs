-- ============================================================
-- Observatório de Segurança Pública da ALEAM
-- Schema para Supabase JS client
-- ============================================================

-- Indicadores diários (1 linha por dia)
CREATE TABLE IF NOT EXISTS indicadores_diarios (
  id                          SERIAL PRIMARY KEY,
  data                        DATE NOT NULL UNIQUE,
  cvli_12m                    INTEGER NOT NULL DEFAULT 0,
  cvli_variacao               NUMERIC(5,2) DEFAULT 0,
  roubos_ano                  INTEGER NOT NULL DEFAULT 0,
  roubos_variacao             NUMERIC(5,2) DEFAULT 0,
  violencia_domestica_ano     INTEGER NOT NULL DEFAULT 0,
  violencia_domestica_variacao NUMERIC(5,2) DEFAULT 0,
  municipios_monitorados      INTEGER DEFAULT 62,
  municipios_com_plano        INTEGER DEFAULT 0,
  municipios_em_alerta        INTEGER DEFAULT 0,
  atualizado_em               TIMESTAMPTZ DEFAULT NOW(),
  fonte                       TEXT DEFAULT 'SSP-AM / SINESP'
);

-- Relatórios publicados
CREATE TABLE IF NOT EXISTS relatorios (
  id            SERIAL PRIMARY KEY,
  titulo        TEXT NOT NULL,
  categoria     TEXT NOT NULL,
  publicado_em  DATE NOT NULL,
  paginas       INTEGER DEFAULT 0,
  acessos       INTEGER DEFAULT 0,
  arquivo_url   TEXT,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- Municípios em destaque
CREATE TABLE IF NOT EXISTS municipios_destaque (
  id    SERIAL PRIMARY KEY,
  data  DATE NOT NULL DEFAULT CURRENT_DATE,
  nome  TEXT NOT NULL,
  cvli  INTEGER NOT NULL DEFAULT 0,
  risco TEXT NOT NULL DEFAULT 'Médio'
);

-- Tendência mensal (12 meses)
CREATE TABLE IF NOT EXISTS tendencia_mensal (
  id    SERIAL PRIMARY KEY,
  ano   INTEGER NOT NULL,
  mes   INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  valor INTEGER NOT NULL DEFAULT 0,
  UNIQUE(ano, mes)
);

-- ── Habilitar leitura pública (Row Level Security) ──────────────────────────
ALTER TABLE indicadores_diarios  ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios           ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipios_destaque  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tendencia_mensal     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leitura publica" ON indicadores_diarios  FOR SELECT USING (true);
CREATE POLICY "leitura publica" ON relatorios           FOR SELECT USING (true);
CREATE POLICY "leitura publica" ON municipios_destaque  FOR SELECT USING (true);
CREATE POLICY "leitura publica" ON tendencia_mensal     FOR SELECT USING (true);

-- ── Dados iniciais de demonstração ──────────────────────────────────────────
INSERT INTO indicadores_diarios (data, cvli_12m, cvli_variacao, roubos_ano, roubos_variacao,
  violencia_domestica_ano, violencia_domestica_variacao, municipios_monitorados,
  municipios_com_plano, municipios_em_alerta)
VALUES (CURRENT_DATE, 1847, -5.2, 17243, 2.1, 3892, -8.4, 62, 38, 14)
ON CONFLICT (data) DO NOTHING;

INSERT INTO relatorios (titulo, categoria, publicado_em, paginas, acessos) VALUES
  ('Segurança Pública no Interior do Amazonas — 1º Trimestre 2026', 'Segurança Pública', '2026-05-02', 48, 2341),
  ('Mapeamento do Acesso à Justiça nas Calhas dos Rios Amazônicos', 'Acesso à Justiça',  '2026-04-18', 62, 1887),
  ('Diagnóstico da Violência Juvenil e Fatores de Risco no Amazonas','Defesa Social',     '2026-04-05', 55, 3102)
ON CONFLICT DO NOTHING;

INSERT INTO municipios_destaque (nome, cvli, risco) VALUES
  ('Manaus', 1124, 'Alto'), ('Parintins', 89, 'Médio'), ('Itacoatiara', 74, 'Médio')
ON CONFLICT DO NOTHING;

INSERT INTO tendencia_mensal (ano, mes, valor) VALUES
  (2025,1,155),(2025,2,138),(2025,3,162),(2025,4,144),(2025,5,151),(2025,6,133),
  (2025,7,147),(2025,8,139),(2025,9,158),(2025,10,141),(2025,11,136),(2025,12,123)
ON CONFLICT DO NOTHING;
