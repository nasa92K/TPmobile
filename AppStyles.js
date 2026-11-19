// =====================================================================
// AppStyles.js  (TP Inscription - étape 5.1)
// Styles propres à App.js : la zone du lien en bas de l'écran.
// Les styles de l'ancien écran de bienvenue (bienvenue, titreBienvenue,
// texte, bouton...) ont été supprimés comme proposé à l'étape 7.2 du
// TP Produits : ils ne servent plus.
// =====================================================================
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  racine: { flex: 1, backgroundColor: '#fff' },
  ecran: { flex: 1 },

  zoneLien: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#D8F3DC',  // [TOUCHE PERSO]
    backgroundColor: '#F4FBF6',
  },
  lien: { color: '#52A27A', fontSize: 15, fontWeight: '600' }, // [TOUCHE PERSO]
});
