// =====================================================================
// screens/InscriptionStyles.js  (TP Inscription - étape 1.1)
// Styles partagés par l'inscription ET la connexion.
// [TOUCHE PERSO] palette verte à la place du bleu du PDF.
// =====================================================================
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  contenu: { padding: 20 },
  titre: {
    fontSize: 26, fontWeight: '700', marginBottom: 20, textAlign: 'center',
    color: '#1B4332', // [TOUCHE PERSO] vert sapin doux
  },

  // Un "groupe" = libellé + champ + message d'erreur
  groupe: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#2D6A4F' },
  champ: {
    borderWidth: 1,
    borderColor: '#D8F3DC',      // [TOUCHE PERSO] bordure vert pastel
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F4FBF6',  // [TOUCHE PERSO] fond vert très pâle
  },
  // Utilisés à la partie 2 (validation)
  champErreur: { borderColor: '#DC2626' },
  erreur: { color: '#DC2626', fontSize: 13, marginTop: 4 },

  // flexDirection 'row' : texte et interrupteur côte à côte
  ligneSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  libelle: { fontSize: 16 },

  bouton: {
    backgroundColor: '#95D5B2', // [TOUCHE PERSO] vert menthe pastel
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  boutonPresse: { opacity: 0.7 }, // retour visuel pendant l'appui
  boutonTexte: { color: '#1B4332', fontSize: 16, fontWeight: '600' },
});
