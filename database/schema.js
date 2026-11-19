// =====================================================================
// database/schema.js  (TP Inscription - étape 3.2, modifié TP Produits - étape 1.3)
// Crée les tables au démarrage. CREATE TABLE IF NOT EXISTS ne fait rien
// si la table existe déjà : on peut donc appeler initDb à chaque lancement.
// =====================================================================
import { getDb } from './connexion';
import { initProduits } from './produits';

export const initDb = async () => {
  const db = await getDb();

  // execAsync : uniquement pour du SQL FIXE (jamais de saisie utilisateur ici)
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telephone TEXT,
      mdp TEXT NOT NULL,
      newsletter INTEGER NOT NULL DEFAULT 0,
      cgu INTEGER NOT NULL DEFAULT 0,
      cree_le TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // TP Produits : création + remplissage de la table produits (en dernier)
  await initProduits();
};
