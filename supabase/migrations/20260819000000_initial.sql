-- ============================================================
-- Owner Dua Putri — Initial schema
-- PRD: Aplikasi Owner Management & Price Reference
-- 5 tabel: products, suppliers, purchases, purchase_items, price_history
-- Sequence untuk ID berformat PRD (BRG-0001, SUP-0001, PUR-0001, PI-0001, PH-0001)
-- ============================================================

-- ---------- Sequences ----------
create sequence if not exists public.product_seq start 1;
create sequence if not exists public.supplier_seq start 1;
create sequence if not exists public.purchase_seq start 1;
create sequence if not exists public.purchase_item_seq start 1;
create sequence if not exists public.history_seq start 1;

-- ---------- Suppliers ----------
create table if not exists public.suppliers (
  supplier_id text primary key,
  name text not null,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Products ----------
create table if not exists public.products (
  product_id text primary key,
  barcode text unique,
  name text not null,
  category text,
  unit text not null,
  pieces_per_box int,
  last_purchase_price bigint,
  last_purchase_date date,
  last_supplier_id text references public.suppliers (supplier_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_name on public.products (lower(name));
create index if not exists idx_products_barcode on public.products (barcode);

-- ---------- Purchases ----------
create table if not exists public.purchases (
  purchase_id text primary key,
  supplier_id text not null references public.suppliers (supplier_id),
  purchase_date date not null,
  total_amount bigint not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_purchases_date on public.purchases (purchase_date desc);
create index if not exists idx_purchases_supplier on public.purchases (supplier_id);

-- ---------- Purchase Items ----------
create table if not exists public.purchase_items (
  purchase_item_id text primary key,
  purchase_id text not null references public.purchases (purchase_id) on delete cascade,
  product_id text not null references public.products (product_id),
  quantity int not null check (quantity > 0),
  price_per_unit bigint not null check (price_per_unit >= 0),
  subtotal bigint not null
);

create index if not exists idx_purchase_items_purchase on public.purchase_items (purchase_id);
create index if not exists idx_purchase_items_product on public.purchase_items (product_id);

-- ---------- Price History ----------
create table if not exists public.price_history (
  history_id text primary key,
  product_id text not null references public.products (product_id),
  purchase_id text not null references public.purchases (purchase_id) on delete cascade,
  supplier_id text not null references public.suppliers (supplier_id),
  purchase_date date not null,
  quantity int not null,
  price_per_unit bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_price_history_product on public.price_history (product_id, purchase_date desc, created_at desc);

-- ---------- Trigger updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_suppliers_updated_at on public.suppliers;
create trigger trg_suppliers_updated_at
  before update on public.suppliers
  for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- RPC: next_code ----------
-- Menghasilkan ID berformat "PREFIX-NNNN" secara concurrency-safe
-- Contoh: next_code('product_seq', 'BRG') -> 'BRG-0001'
create or replace function public.next_code(p_seq text, p_prefix text)
returns text
language sql
security definer
set search_path = public
as $$
  select p_prefix || '-' || lpad(nextval(p_seq::regclass)::text, 4, '0');
$$;

-- ---------- RPC: create_purchase ----------
-- Satu transaksi atomik (setara LockService PRD):
--   1. Simpan PURCHASES
--   2. Simpan PURCHASE_ITEMS
--   3. Simpan PRICE_HISTORY (histori tidak pernah dihapus)
--   4. Update PRODUCTS: last_purchase_price / last_purchase_date / last_supplier_id
-- total_amount dihitung di server, client tidak bisa menentukan harga modal langsung.
create or replace function public.create_purchase(
  p_supplier_id text,
  p_purchase_date date,
  p_notes text,
  p_items jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_purchase_id text;
  v_item record;
  v_item_id text;
  v_history_id text;
  v_total bigint := 0;
begin
  if p_supplier_id is null or p_supplier_id = '' then
    raise exception 'Pilih supplier';
  end if;
  if p_purchase_date is null then
    raise exception 'Pilih tanggal pembelian';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Tambahkan minimal 1 barang pembelian';
  end if;

  v_purchase_id := public.next_code('purchase_seq', 'PUR');

  insert into public.purchases (purchase_id, supplier_id, purchase_date, notes)
  values (v_purchase_id, p_supplier_id, p_purchase_date, p_notes);

  for v_item in
    select x.product_id, x.quantity, x.price_per_unit
    from jsonb_to_recordset(p_items) as x (
      product_id text,
      quantity int,
      price_per_unit bigint
    )
  loop
    if v_item.product_id is null
      or v_item.quantity is null or v_item.quantity <= 0
      or v_item.price_per_unit is null or v_item.price_per_unit <= 0
    then
      raise exception 'Data barang pembelian tidak valid';
    end if;

    v_item_id := public.next_code('purchase_item_seq', 'PI');
    insert into public.purchase_items (
      purchase_item_id, purchase_id, product_id, quantity, price_per_unit, subtotal
    )
    values (
      v_item_id,
      v_purchase_id,
      v_item.product_id,
      v_item.quantity,
      v_item.price_per_unit,
      v_item.quantity * v_item.price_per_unit
    );

    v_history_id := public.next_code('history_seq', 'PH');
    insert into public.price_history (
      history_id, product_id, purchase_id, supplier_id, purchase_date, quantity, price_per_unit
    )
    values (
      v_history_id,
      v_item.product_id,
      v_purchase_id,
      p_supplier_id,
      p_purchase_date,
      v_item.quantity,
      v_item.price_per_unit
    );

    update public.products
       set last_purchase_price = v_item.price_per_unit,
           last_purchase_date = p_purchase_date,
           last_supplier_id = p_supplier_id
     where product_id = v_item.product_id;

    v_total := v_total + (v_item.quantity * v_item.price_per_unit);
  end loop;

  update public.purchases
     set total_amount = v_total
   where purchase_id = v_purchase_id;

  return v_purchase_id;
end;
$$;

-- ---------- Row Level Security ----------
-- Single-owner MVP tanpa login: buka akses penuh untuk anon (publishable key)
-- dan authenticated. Service role otomatis bypass. PRD §31: validasi tetap di
-- server (RPC create_purchase), client tidak bisa set last_purchase_price langsung.
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
