// =====================================================================
// screens/ProfilScreen.jsx  (TP Drawer - étape 6, enrichi)
// Base du PDF : un View centré avec "Bienvenue sur votre profil".
// [AJOUT HOOK] :
//   - useContext (via useUtilisateur) : infos de l'utilisateur + déconnexion
//   - useMemo : calcul des initiales (ex. "MD" pour Marie Dupont)
//   - useNavigation (hook de React Navigation) : aller vers l'onglet Produits
// =====================================================================
import { useMemo } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUtilisateur } from '../context/UtilisateurContext';

export const ProfilScreen = () => {
  const { utilisateur, deconnecter } = useUtilisateur();

  // useNavigation : donne l'objet "navigation" à n'importe quel composant
  const navigation = useNavigation();

  // useMemo : recalculé seulement si l'utilisateur change
  const initiales = useMemo(() => {
    if (!utilisateur) return '?';
    return (utilisateur.prenom[0] + utilisateur.nom[0]).toUpperCase();
  }, [utilisateur]);

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4FBF6', padding: 20 }}
    >
      <Text style={{ color: '#6B9080', marginBottom: 16 }}>Bienvenue sur votre profil</Text>

      {/* Photo de profil ronde + pastille avec les initiales */}
      <View>
        {/* Image : composant de base de React Native.
            require(...) inclut le fichier assets/profil.jpg dans l'application.
            borderRadius = moitié de la taille -> image ronde */}
        <Image
          source={require('../assets/profil.jpg')}
          style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#95D5B2' }}
        />
        {/* Petite pastille posée en bas à droite de la photo */}
        <View style={{ position: 'absolute', right: -4, bottom: -4, width: 40, height: 40, borderRadius: 20, backgroundColor: '#95D5B2', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F4FBF6' }}>
          <Text style={{ color: '#1B4332', fontSize: 14, fontWeight: '700' }}>{initiales}</Text>
        </View>
      </View>

      <Text style={{ fontSize: 22, fontWeight: '700', color: '#1B4332', marginTop: 16 }}>
        {utilisateur?.prenom} {utilisateur?.nom}
      </Text>
      <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 4 }}>{utilisateur?.email}</Text>

      {/* Navigation imbriquée : Drawer "Menu Principal" -> onglet "Produits" */}
      <Pressable
        onPress={() => navigation.navigate('Menu Principal', { screen: 'Produits' })}
        style={({ pressed }) => [
          { backgroundColor: '#95D5B2', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, marginTop: 24 },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={{ color: '#1B4332', fontSize: 16, fontWeight: '600' }}>Voir les produits</Text>
      </Pressable>

      <Pressable onPress={deconnecter} style={({ pressed }) => [{ marginTop: 16 }, pressed && { opacity: 0.7 }]}>
        <Text style={{ color: '#B91C1C', fontSize: 15, fontWeight: '600' }}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
};
