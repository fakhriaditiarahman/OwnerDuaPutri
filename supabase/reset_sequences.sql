-- ============================================================
-- Owner Dua Putri — Reset ID ke awal
-- Jalankan di SQL Editor SETELAH tabel dibuat dan data dibersihkan.
-- ID berikutnya: BRG-0001 / SUP-0001 / PUR-0001 / PI-0001 / PH-0001
-- ============================================================

select setval('public.product_seq', 1, false);
select setval('public.supplier_seq', 1, false);
select setval('public.purchase_seq', 1, false);
select setval('public.purchase_item_seq', 1, false);
select setval('public.history_seq', 1, false);