// =====================================================================
// screens/ProduitsStyles.js  (TP Produits - étapes 3.1, 4.3, 5.3, 6.3, 7.1)
// [TOUCHE PERSO] le bleu #2563EB du PDF est remplacé par du vert.
// =====================================================================
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // --- Écrans d'état (chargement, erreur) -----------------------------
  ecran: { flex: 1, backgroundColor: '#F4FBF6' }, // [TOUCHE PERSO] fond vert pâle
  centre: { justifyContent: 'center', alignItems: 'center', padding: 24 },

  messageErreur: { color: '#B91C1C', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  bouton: {
    backgroundColor: '#95D5B2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  boutonPresse: { opacity: 0.7 },
  boutonTexte: { color: '#1B4332', fontSize: 16, fontWeight: '600' },
  boutonAjout: { alignSelf: 'flex-start', marginTop: 12, paddingVertical: 10 }, // 4.3

  // --- Liste ----------------------------------------------------------
  liste: { paddingHorizontal: 16, paddingBottom: 24 },
  entete: { paddingVertical: 16 },
  titre: { fontSize: 24, fontWeight: '700', color: '#1B4332' },
  sousTitre: { fontSize: 14, color: '#6B9080', marginTop: 4 },
  separateur: { height: 10 }, // espace entre deux cartes
  vide: { textAlign: 'center', color: '#6B7280', fontSize: 16, marginTop: 40 },
  pied: { paddingVertical: 16 }, // 6.3 : spinner de bas de liste

  // --- Carte produit --------------------------------------------------
  carte: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,          // [TOUCHE PERSO] liseré vert à gauche
    borderLeftColor: '#95D5B2',  // [TOUCHE PERSO]
  },
  carteGauche: { flex: 1, paddingRight: 12 }, // flex: 1 -> les noms longs passent à la ligne
  nom: { fontSize: 16, fontWeight: '600' },
  categorie: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  prix: { fontSize: 17, fontWeight: '700', color: '#40916C' },
  stock: { fontSize: 12, color: '#047857', marginTop: 4, textAlign: 'right' },
  rupture: { color: '#B91C1C' },

  // --- Recherche et catégories (5.3) ----------------------------------
  fixe: { paddingHorizontal: 16, paddingTop: 16 },
  champRecherche: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8F3DC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 12,
  },
  listePuces: { flexGrow: 0 }, // la liste horizontale ne prend pas toute la hauteur
  puces: { paddingHorizontal: 16, paddingVertical: 12 },
  puce: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D8F3DC',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  puceActive: { backgroundColor: '#95D5B2', borderColor: '#95D5B2' },
  puceTexte: { fontSize: 14, color: '#374151' },
  puceTexteActive: { color: '#1B4332', fontWeight: '600' },

  // --- Utilisateur et déconnexion (7.1) -------------------------------
  ligneTitre: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  lienDeconnexion: { color: '#52A27A', fontSize: 14, fontWeight: '600', paddingTop: 8 },
  bonjour: { fontSize: 14, color: '#374151', marginTop: 4 },
});
