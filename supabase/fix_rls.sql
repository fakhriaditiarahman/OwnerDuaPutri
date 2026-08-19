-- ============================================================
-- Owner Dua Putri — Perbaikan RLS (jalankan di SQL Editor)
-- Memastikan akses penuh untuk anon (publishable key) dan authenticated.
-- Service role otomatis bypass. Aman dijalankan ulang.
-- ============================================================

alter table public.suppliers enable row level security;
alter table public.products enable row level security;
alter table public.purchases enable row level security;
alter table public.purchase_items enable row level security;
alter table public.price_history enable row level security;

drop policy if exists "suppliers_all" on public.suppliers;
create policy "suppliers_all" on public.suppliers for all to anon, authenticated using (true) with check (true);

drop policy if exists "products_all" on public.products;
create policy "products_all" on public.products for all to anon, authenticated using (true) with check (true);

drop policy if exists "purchases_all" on public.purchases;
create policy "purchases_all" on public.purchases for all to anon, authenticated using (true) with check (true);

drop policy if exists "purchase_items_all" on public.purchase_items;
create policy "purchase_items_all" on public.purchase_items for all to anon, authenticated using (true) with check (true);

drop policy if exists "price_history_all" on public.price_history;
create policy "price_history_all" on public.price_history for all to anon, authenticated using (true) with check (true);

grant usage on sequence public.product_seq, public.supplier_seq, public.purchase_seq,
  public.purchase_item_seq, public.history_seq to anon, authenticated;

grant execute on function public.next_code(text, text) to anon, authenticated;
grant execute on function public.create_purchase(text, date, text, jsonb) to anon, authenticated;

-- Cek hasilnya: harus muncul 5 policy dengan cmd=ALL
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename;