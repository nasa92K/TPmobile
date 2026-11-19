// =====================================================================
// context/UtilisateurContext.js   [AJOUT HOOK : createContext + useContext]
//
// Problème : après la connexion, les écrans sont dans des navigateurs
// (Drawer -> Tabs -> écran). On ne peut plus leur passer facilement des
// props depuis App.js.
// Solution : un "contexte" React. App.js le remplit (Provider) et
// n'importe quel écran en dessous peut le lire avec useContext.
// =====================================================================
import { createContext, useContext } from 'react';

// Valeur par défaut (utilisée seulement si aucun Provider au-dessus)
export const UtilisateurContext = createContext({
  utilisateur: null,
  deconnecter: () => {},
  mettreAJourUtilisateur: () => {},
});

// Hook personnalisé : un raccourci pour lire le contexte.
// Un hook personnalisé est une fonction dont le nom commence par "use"
// et qui appelle d'autres hooks.
export const useUtilisateur = () => useContext(UtilisateurContext);
