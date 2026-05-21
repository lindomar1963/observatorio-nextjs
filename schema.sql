-- ============================================================
-- Observatório de Segurança Pública da ALEAM
-- Schema do banco de dados
-- ============================================================

-- Conteúdo diário gerado pelos agentes
CREATE TABLE IF NOT EXISTS conteudo_diario (
  id          SERIAL PRIMARY KEY,
  data        DATE NOT NULL UNIQUE,
  payload     JSONB NOT NULL,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- Ocorrências brutas por município/categoria
CREATE TABLE IF NOT EXISTS ocorrencias (
  id            SERIAL PRIMARY KEY,
  data          DATE NOT NULL,
  municipio     TEXT NOT NULL,
  uf            TEXT NOT NULL DEFAULT 'AM',
  categoria     TEXT NOT NULL,
  total         INTEGER NOT NULL DEFAULT 0,
  fonte         TEXT,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_data ON ocorrencias(data);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_municipio ON ocorrencias(municipio);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_uf ON ocorrencias(uf);

-- Municípios do Amazonas
CREATE TABLE IF NOT EXISTS municipios (
  id          SERIAL PRIMARY KEY,
  codigo_ibge TEXT UNIQUE,
  nome        TEXT NOT NULL,
  uf          TEXT NOT NULL DEFAULT 'AM',
  latitude    DOUBLE PRECISION,
  longitude   DOUBLE PRECISION,
  populacao   INTEGER
);

-- Alertas gerados automaticamente
CREATE TABLE IF NOT EXISTS alertas (
  id            SERIAL PRIMARY KEY,
  data          DATE NOT NULL,
  municipio     TEXT NOT NULL,
  uf            TEXT NOT NULL DEFAULT 'AM',
  categoria     TEXT,
  total         INTEGER NOT NULL,
  media_7d      DOUBLE PRECISION,
  variacao_pct  DOUBLE PRECISION,
  nivel         TEXT DEFAULT 'alto',
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- Log de execução do pipeline de agentes
CREATE TABLE IF NOT EXISTS pipeline_log (
  id          SERIAL PRIMARY KEY,
  data        DATE NOT NULL,
  agente      TEXT NOT NULL,
  status      TEXT NOT NULL,
  mensagem    TEXT,
  duracao_s   INTEGER,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Dados iniciais — municípios principais do Amazonas ───────────────────────
INSERT INTO municipios (codigo_ibge, nome, uf, latitude, longitude, populacao) VALUES
  ('1302603', 'Manaus',           'AM', -3.1019,  -60.0250, 2255903),
  ('1300508', 'Parintins',        'AM', -2.6274,  -56.7356, 115878),
  ('1301902', 'Itacoatiara',      'AM', -3.1431,  -58.4446, 104531),
  ('1302504', 'Manacapuru',       'AM', -3.2994,  -60.6206, 102269),
  ('1300300', 'Coari',            'AM', -4.0851,  -63.1411, 85097),
  ('1301001', 'Tefé',             'AM', -3.3697,  -64.7103, 65738),
  ('1301209', 'Tabatinga',        'AM', -4.2555,  -69.9392, 67756),
  ('1303536', 'São Gabriel da Cachoeira', 'AM', -0.1303, -67.0892, 48890),
  ('1301308', 'Maués',            'AM', -3.3736,  -57.7192, 60659),
  ('1302900', 'Manicoré',         'AM', -5.8090,  -61.2997, 56770)
ON CONFLICT (codigo_ibge) DO NOTHING;

-- ── View para estatísticas rápidas ───────────────────────────────────────────
CREATE OR REPLACE VIEW resumo_diario AS
SELECT
  data,
  SUM(total) AS total_ocorrencias,
  COUNT(DISTINCT municipio) AS municipios_afetados,
  MAX(total) AS maior_ocorrencia
FROM ocorrencias
GROUP BY data
ORDER BY data DESC;
