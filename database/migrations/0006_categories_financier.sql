-- Sillage by RLN Consulting — Migration 0006 : nouvelles catégories de
-- patrimoine financier signalées manquantes lors d'un test réel
-- (CEL, PEL, compte sur livret, PERCOL/PERCO).

alter table patrimoine_financier drop constraint patrimoine_financier_type_check;

alter table patrimoine_financier add constraint patrimoine_financier_type_check
  check (type in (
    'livret_a', 'ldds', 'cel', 'pel', 'compte_sur_livret', 'assurance_vie',
    'per', 'percol', 'pea', 'compte_titres', 'comptes_bancaires', 'scpi', 'autres'
  ));
