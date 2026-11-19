// =====================================================================
// database/connexion.js  (TP Inscription - étape 3.1)
// Ouvre la base SQLite UNE SEULE FOIS pour toute l'application.
// =====================================================================
import * as SQLite from 'expo-sqlite';

// On garde la promesse d'ouverture en mémoire : si plusieurs fonctions
// demandent la base en même temps, elles reçoivent toutes la même.
let dbPromise = null;

export const getDb = () => {
  // openDatabaseAsync crée le fichier inscription.db s'il n'existe pas encore
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('inscription.db');
  return dbPromise;
};
