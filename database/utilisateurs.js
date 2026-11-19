// =====================================================================
// database/utilisateurs.js  (TP Inscription - étapes 3.3 et 4.1)
// Toutes les requêtes sur la table "utilisateurs".
// Les "?" sont des paramètres : SQLite y place les valeurs lui-même,
// ce qui empêche l'injection SQL.
// =====================================================================
import { getDb } from './connexion';

// Ajoute un utilisateur et renvoie son id
export const insererUtilisateur = async ({
  nom, prenom, email, telephone, mdp, newsletter, cgu,
}) => {
  const db = await getDb();

  // runAsync : pour les écritures (INSERT, UPDATE, DELETE)
  const resultat = await db.runAsync(
    `INSERT INTO utilisateurs
       (nom, prenom, email, telephone, mdp, newsletter, cgu)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    nom.trim(),
    prenom.trim(),
    email.trim().toLowerCase(), // même email peu importe les majuscules
    telephone || null,          // champ vide -> null
    mdp,
    newsletter ? 1 : 0,         // SQLite n'a pas de booléen : 0 ou 1
    cgu ? 1 : 0
  );
  return resultat.lastInsertRowId;
};

// Renvoie tous les utilisateurs (sans le mot de passe)
export const listerUtilisateurs = async () => {
  const db = await getDb();
  // getAllAsync : renvoie un tableau d'objets (une ligne = un objet)
  return db.getAllAsync(
    `SELECT id, nom, prenom, email, telephone, newsletter, cree_le
     FROM utilisateurs ORDER BY id DESC`
  );
};

// Renvoie l'utilisateur si l'email et le mot de passe correspondent, sinon null
export const verifierConnexion = async (email, mdp) => {
  const db = await getDb();
  // getFirstAsync : renvoie la première ligne trouvée, ou null
  return db.getFirstAsync(
    `SELECT id, nom, prenom, email FROM utilisateurs
     WHERE email = ? AND mdp = ?`,
    email.trim().toLowerCase(),
    mdp
  );
};
