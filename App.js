// =====================================================================
// App.js  (TP Inscription partie 5 + TP Produits partie 7 + TP Drawer)
// Le "chef d'orchestre" : il décide quoi afficher selon deux états.
//   - utilisateur : null (personne) ou l'objet de l'utilisateur connecté
//   - ecran       : 'login' ou 'inscription'
// Une fois connecté : menu Drawer + onglets (Accueil, Produits, Paramètres).
// =====================================================================

// Doit être le TOUT PREMIER import (TP Drawer - étape 8)
import 'react-native-gesture-handler';
import { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { LoginScreen } from './screens/LoginScreen';
import { InscriptionScreen } from './screens/InscriptionScreen';
import DrawerNavigator from './navigation/DrawerNavigator';
import { UtilisateurContext } from './context/UtilisateurContext';
import styles from './AppStyles';

export default function App() {
  // ecran démarre sur 'login' : l'application s'ouvre sur la connexion
  const [ecran, setEcran] = useState('login');
  // utilisateur démarre à null : personne n'est connecté
  const [utilisateur, setUtilisateur] = useState(null);

  // [AJOUT HOOK] useCallback : garde la MÊME fonction entre deux affichages
  // (sinon une nouvelle fonction serait créée à chaque fois).
  const deconnecter = useCallback(() => setUtilisateur(null), []);
  const mettreAJourUtilisateur = useCallback(
    (modifications) => setUtilisateur((actuel) => ({ ...actuel, ...modifications })),
    []
  );

  // [AJOUT HOOK] useMemo : l'objet du contexte n'est recréé que si
  // utilisateur ou deconnecter change -> évite de redessiner pour rien
  // tous les écrans qui lisent le contexte.
  const valeurContexte = useMemo(
    () => ({ utilisateur, deconnecter, mettreAJourUtilisateur }),
    [utilisateur, deconnecter, mettreAJourUtilisateur]
  );
  // Attention : les hooks doivent TOUJOURS être appelés avant les "if/return".

  // Utilisateur connecté : menu latéral + onglets (dont la liste des produits)
  if (utilisateur) {
    return (
      <SafeAreaProvider>
        {/* "dark" : texte foncé, lisible sur l'en-tête vert pastel */}
        <StatusBar style="dark" />
        {/* Provider : rend l'utilisateur disponible à tous les écrans dessous */}
        <UtilisateurContext.Provider value={valeurContexte}>
          {/* NavigationContainer gère les transitions entre les écrans */}
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </UtilisateurContext.Provider>
      </SafeAreaProvider>
    );
  }

  // Personne n'est connecté : connexion ou inscription
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.racine}>
        <View style={styles.ecran}>
          {/* Affichage conditionnel : un seul des deux écrans */}
          {ecran === 'login'
            ? <LoginScreen onConnecte={setUtilisateur} />
            : <InscriptionScreen />}
        </View>

        {/* Lien du bas, protégé de la barre de navigation du téléphone */}
        <SafeAreaView edges={['bottom']} style={styles.zoneLien}>
          <Pressable onPress={() => setEcran(ecran === 'login' ? 'inscription' : 'login')}>
            <Text style={styles.lien}>
              {ecran === 'login'
                ? "Pas encore de compte ? S'inscrire"
                : 'Déjà inscrit ? Se connecter'}
            </Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}
