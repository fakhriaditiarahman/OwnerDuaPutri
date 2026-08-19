-- ============================================================
-- Owner Dua Putri — Settings support
-- advance_sequences(): set sequence ke max angka ID yang ada
-- agar ID baru (BRG-0001, dst) tidak bentrok setelah restore.
-- ============================================================

create or replace function public.advance_sequences()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  m int;
begin
  select coalesce(max((regexp_replace(product_id, '\D', '', 'g'))::int), 0)
    into m from public.products;
  perform setval('product_seq', greatest(m, 1));

  select coalesce(max((regexp_replace(supplier_id, '\D', '', 'g'))::int), 0)
    into m from public.suppliers;
  perform setval('supplier_seq', greatest(m, 1));

  select coalesce(max((regexp_replace(purchase_id, '\D', '', 'g'))::int), 0)
    into m from public.purchases;
  perform setval('purchase_seq', greatest(m, 1));

  select coalesce(max((regexp_replace(purchase_item_id, '\D', '', 'g'))::int), 0)
    into m from public.purchase_items;
  perform setval('purchase_item_seq', greatest(m, 1));

  select coalesce(max((regexp_replace(history_id, '\D', '', 'g'))::int), 0)
    into m from public.price_history;
  perform setval('history_seq', greatest(m, 1));
end;
$$;

grant execute on function public.advance_sequences() to anon, authenticated;
