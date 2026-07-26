-- Run this once in Supabase Dashboard > SQL Editor > New query > Run

create table if not exists ledger (
  id uuid primary key default gen_random_uuid(),
  type text not null,               -- 'donation' or 'expense'
  amount numeric not null,
  date date not null,
  donor text,
  category text,
  note text,
  description text,
  receipt_image text,
  hash text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: public can read everything (that's the whole point
-- of a transparency tracker), anyone can add a new entry, but nobody can
-- edit or delete an existing one — that's what makes the hash chain mean
-- something, exactly like the Firestore rules would have done.
alter table ledger enable row level security;

create policy "Public can read ledger"
  on ledger for select
  using (true);

create policy "Public can insert ledger entries"
  on ledger for insert
  with check (true);

-- No update/delete policy is created on purpose — that means update and
-- delete are denied by default under RLS.
