-- Tabela de avisos exibidos na faixa "Atualização" (ticker) no topo do site.
-- Execute este script no SQL Editor do Supabase para criar a tabela.
--
-- Comportamento:
--   * O site mostra apenas avisos com ativo = true.
--   * Avisos com data_expira preenchida somem automaticamente após a data.
--   * A ordem de exibição segue a coluna "ordem" (menor primeiro).
--
-- Gerenciamento: Área Restrita › Painel › Avisos do Ticker.

create table if not exists public.avisos_ticker (
  id          bigint generated always as identity primary key,
  texto       text        not null,
  link        text,
  data_expira date,
  ativo       boolean     not null default true,
  ordem       integer     not null default 0,
  created_at  timestamptz not null default now()
);

-- Índice para a consulta pública (ativos, ordenados)
create index if not exists avisos_ticker_ativo_ordem_idx
  on public.avisos_ticker (ativo, ordem);

-- Row Level Security
alter table public.avisos_ticker enable row level security;

-- Leitura pública (somente avisos ativos)
create policy "leitura publica de avisos ativos"
  on public.avisos_ticker for select
  using (ativo = true);

-- Escrita apenas para usuários autenticados (Área Restrita)
create policy "gestao por usuarios autenticados"
  on public.avisos_ticker for all
  to authenticated
  using (true)
  with check (true);

-- Exemplo de inserção:
-- insert into public.avisos_ticker (texto, link, data_expira, ordem) values
--   ('Seminário: Violência e Território Amazônico · Auditório ALEAM', null, '2026-06-30', 1);
