// =====================================================================
// database/produits.js  (TP Produits - parties 1, 4, 5 et 6)
// Toutes les requêtes sur la table "produits".
// =====================================================================
import { getDb } from './connexion';

// Catalogue jeux vidéo : nom, catégorie, prix, stock, image Steam et année.
const PRODUITS_DE_DEPART = [
  ['Helldivers 2', 'Action - Tir coopératif', 39.99, 12, 'https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg', 2024],
  ['Palworld', 'Survie - Aventure', 28.99, 40, 'https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg', 2024],
  ['Tekken 8', 'Combat', 69.99, 7, 'https://cdn.akamai.steamstatic.com/steam/apps/1778820/header.jpg', 2024],
  ['Black Myth: Wukong', 'Action - RPG', 59.99, 15, 'https://cdn.akamai.steamstatic.com/steam/apps/2358720/header.jpg', 2024],
  ['Monster Hunter Wilds', 'Action - RPG', 69.99, 22, 'https://cdn.akamai.steamstatic.com/steam/apps/2246340/header.jpg', 2025],
  ['Kingdom Come: Deliverance II', 'RPG - Aventure', 59.99, 8, 'https://cdn.akamai.steamstatic.com/steam/apps/1771300/header.jpg', 2025],
  ['Clair Obscur: Expedition 33', 'RPG - Tour par tour', 49.99, 20, 'https://cdn.akamai.steamstatic.com/steam/apps/1903340/header.jpg', 2025],
  ['Battlefield 6', 'Action - Tir', 69.99, 16, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2807960/c12d12ce3c7d217398d3fcad77427bfc9d57c570/header.jpg?t=1794834044', 2025],
  ['EA SPORTS FC 26', 'Sport - Football', 79.99, 13, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3405690/2d96aa1b06e453cd62dae9029d412f19e61932c3/header.jpg?t=1789751159', 2025],
  ['Resident Evil Requiem', 'Horreur - Survie', 79.99, 10, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3764200/ce5437442768e38eb575f205ab9397d0264017b0/header.jpg?t=1779840172', 2026],
];

const IMAGES_MAJ = [
  ['Battlefield 6', 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2807960/c12d12ce3c7d217398d3fcad77427bfc9d57c570/header.jpg?t=1794834044'],
  ['EA SPORTS FC 26', 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3405690/2d96aa1b06e453cd62dae9029d412f19e61932c3/header.jpg?t=1789751159'],
  ['Resident Evil Requiem', 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3764200/ce5437442768e38eb575f205ab9397d0264017b0/header.jpg?t=1779840172'],
];

// --- Étape 1.1 : créer la table et la remplir une seule fois ----------
export const initProduits = async () => {
  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS produits (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nom       TEXT    NOT NULL,
      categorie TEXT    NOT NULL,
      prix      REAL    NOT NULL,
      stock     INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      annee     INTEGER
    );
  `);

  // Ajoute la colonne aux bases déjà créées par une ancienne version.
  const colonnes = await db.getAllAsync('PRAGMA table_info(produits)');
  if (!colonnes.some((colonne) => colonne.name === 'image_url')) {
    await db.execAsync('ALTER TABLE produits ADD COLUMN image_url TEXT');
  }
  if (!colonnes.some((colonne) => colonne.name === 'annee')) {
    await db.execAsync('ALTER TABLE produits ADD COLUMN annee INTEGER');
  }

  // Remplace une seule fois l'ancien catalogue, puis conserve les données locales.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS migrations_catalogue (
      version TEXT PRIMARY KEY NOT NULL
    );
  `);
  const migration = await db.getFirstAsync(
    "SELECT version FROM migrations_catalogue WHERE version = 'jeux-2026-v1'"
  );

  // Corrige aussi les liens pour les installations qui ont déjà reçu v1.
  for (const [nom, image_url] of IMAGES_MAJ) {
    await db.runAsync('UPDATE produits SET image_url = ? WHERE nom = ?', image_url, nom);
  }
  if (migration) return;

  // Transaction : le nouveau catalogue remplace l'ancien en une seule opération.
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM produits');
    for (const [nom, categorie, prix, stock, image_url, annee] of PRODUITS_DE_DEPART) {
      await db.runAsync(
        'INSERT INTO produits (nom, categorie, prix, stock, image_url, annee) VALUES (?, ?, ?, ?, ?, ?)',
        nom, categorie, prix, stock, image_url, annee
      );
    }
    await db.runAsync(
      'INSERT INTO migrations_catalogue (version) VALUES (?)',
      'jeux-2026-v1'
    );
  });
};

// --- Étape 6.1 : filtre partagé entre la lecture et le comptage -------
// Ainsi les deux requêtes travaillent exactement sur les mêmes lignes.
const FILTRE = 'nom LIKE ? AND (? IS NULL OR categorie = ?)';
const parametresFiltre = (recherche, categorie) => [
  `%${recherche.trim()}%`, categorie, categorie,
];

// Lit une page de produits.
// limite = -1 -> "sans limite" pour SQLite ; decalage = nb de lignes à sauter
export const listerProduits = async ({
  recherche = '', categorie = null, limite = -1, decalage = 0,
} = {}) => {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT id, nom, categorie, prix, stock, image_url, annee FROM produits
     WHERE ${FILTRE}
     ORDER BY nom, id
     LIMIT ? OFFSET ?`,
    ...parametresFiltre(recherche, categorie), // "..." étale le tableau
    limite,
    decalage
  );
};

// Compte le nombre total de produits correspondant au filtre
export const compterProduits = async ({ recherche = '', categorie = null } = {}) => {
  const db = await getDb();
  const { n } = await db.getFirstAsync(
    `SELECT COUNT(*) AS n FROM produits WHERE ${FILTRE}`,
    ...parametresFiltre(recherche, categorie)
  );
  return n;
};

// --- Étape 5.1 : liste des catégories (sans doublon) ------------------
export const listerCategories = async () => {
  const db = await getDb();
  const lignes = await db.getAllAsync(
    'SELECT DISTINCT categorie FROM produits ORDER BY categorie'
  );
  // [{ categorie: 'Sport' }, ...] -> ['Sport', ...]
  return lignes.map((ligne) => ligne.categorie);
};

// --- Étape 4.1 : ajouter un produit -----------------------------------
export const insererProduit = async (nom, categorie, prix, stock) => {
  const db = await getDb();
  const resultat = await db.runAsync(
    'INSERT INTO produits (nom, categorie, prix, stock) VALUES (?, ?, ?, ?)',
    nom, categorie, prix, stock
  );
  return resultat.lastInsertRowId;
};
