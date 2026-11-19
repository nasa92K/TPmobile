// =====================================================================
// screens/AccueilScreen.jsx  (TP Drawer - étape 6, enrichi)
// Base du PDF : un View centré avec un Text "Bienvenue sur l'accueil".
// [AJOUT HOOK] démonstration de plusieurs hooks :
//   - useContext (via useUtilisateur) : lire l'utilisateur connecté
//   - useState + useEffect avec nettoyage : une horloge qui se met à jour
//   - useMemo : calculer "Bonjour / Bonsoir" seulement quand l'heure change
//   - useFocusEffect + useCallback : relire la base à chaque retour sur l'onglet
// =====================================================================
import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUtilisateur } from '../context/UtilisateurContext';
import { compterProduits, listerCategories } from '../database';

export const AccueilScreen = () => {
  // useContext : l'utilisateur vient d'App.js, sans passer de props
  const { utilisateur } = useUtilisateur();

  // useState : l'heure actuelle
  const [maintenant, setMaintenant] = useState(new Date());
  const [nbProduits, setNbProduits] = useState(0);
  const [nbCategories, setNbCategories] = useState(0);

  // useEffect avec NETTOYAGE : on lance un minuteur toutes les secondes,
  // et on l'arrête (clearInterval) quand l'écran est démonté.
  // Sans le nettoyage, le minuteur continuerait de tourner pour rien.
  useEffect(() => {
    const minuteur = setInterval(() => setMaintenant(new Date()), 1000);
    return () => clearInterval(minuteur);
  }, []);

  // useMemo : mémorise un résultat calculé. Il n'est recalculé que si
  // une valeur du tableau de dépendances change (ici, l'heure).
  const heure = maintenant.getHours();
  const salutation = useMemo(() => {
    if (heure < 12) return 'Bonjour';
    if (heure < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }, [heure]);

  // useFocusEffect (hook de React Navigation) : comme useEffect, mais
  // exécuté chaque fois que l'onglet devient VISIBLE. Ainsi, si on ajoute
  // un produit dans l'onglet Produits, le compteur est à jour en revenant.
  // useCallback : garde la même fonction entre deux affichages.
  useFocusEffect(
    useCallback(() => {
      let actuel = true; // même principe que dans ProduitsScreen
      Promise.all([compterProduits(), listerCategories()])
        .then(([n, cats]) => {
          if (actuel) {
            setNbProduits(n);
            setNbCategories(cats.length);
          }
        })
        .catch(console.log);
      return () => {
        actuel = false;
      };
    }, [])
  );

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4FBF6', padding: 20 }}
    >
      <Text style={{ fontSize: 16, color: '#6B9080' }}>Bienvenue sur l'accueil</Text>

      <Text style={{ fontSize: 26, fontWeight: '700', color: '#1B4332', marginTop: 8, textAlign: 'center' }}>
        {salutation} {utilisateur?.prenom} !
      </Text>

      {/* Horloge mise à jour par le useEffect */}
      <Text style={{ fontSize: 40, fontWeight: '700', color: '#52A27A', marginVertical: 24 }}>
        {maintenant.toLocaleTimeString('fr-FR')}
      </Text>

      {/* Statistiques lues dans SQLite (via database/index.js) */}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginRight: 12, alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#95D5B2' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#40916C' }}>{nbProduits}</Text>
          <Text style={{ color: '#6B7280' }}>produits</Text>
        </View>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#95D5B2' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#40916C' }}>{nbCategories}</Text>
          <Text style={{ color: '#6B7280' }}>catégories</Text>
        </View>
      </View>
    </View>
  );
};
