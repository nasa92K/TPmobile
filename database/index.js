// =====================================================================
// database/index.js  (point d'entrée unique de la base)
// Les écrans importent depuis '../database' et ne connaissent jamais
// les fichiers internes (connexion.js, produits.js...).
// =====================================================================
export { initDb } from './schema';
export {
  insererUtilisateur,
  listerUtilisateurs,
  verifierConnexion,
} from './utilisateurs';
export {
  listerProduits, compterProduits, listerCategories, insererProduit,
} from './produits';
