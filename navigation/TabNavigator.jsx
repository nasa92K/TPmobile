// =====================================================================
// navigation/TabNavigator.jsx  (TP Drawer - partie C étape 3)
// Barre d'onglets en bas : Accueil, Produits, Paramètres.
// L'onglet "Produits" affiche l'écran du TP Produits.
// =====================================================================
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AccueilScreen } from '../screens/AccueilScreen';
import { ParametresScreen } from '../screens/ParametresScreen';
import { ProduitsScreen } from '../screens/ProduitsScreen';
import { useUtilisateur } from '../context/UtilisateurContext';

const Tab = createBottomTabNavigator();

// [AJOUT HOOK] Petit composant "pont" : il lit l'utilisateur dans le
// contexte (useContext via useUtilisateur) et le donne en props à
// ProduitsScreen. Ainsi ProduitsScreen reste EXACTEMENT comme dans le PDF
// (props utilisateur et onDeconnexion).
const ProduitsOnglet = () => {
  const { utilisateur, deconnecter } = useUtilisateur();
  return <ProduitsScreen utilisateur={utilisateur} onDeconnexion={deconnecter} />;
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // headerShown: false -> sinon deux en-têtes superposés (Drawer + Tab)
        headerShown: false,
        tabBarActiveTintColor: '#52A27A',   // [TOUCHE PERSO] onglet actif vert
        tabBarInactiveTintColor: '#6B7280',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Accueil') {
            iconName = 'home';
          } else if (route.name === 'Produits') {
            iconName = 'basket';
          } else if (route.name === 'Paramètres') {
            iconName = 'settings';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Accueil" component={AccueilScreen} />
      <Tab.Screen name="Produits" component={ProduitsOnglet} />
      <Tab.Screen name="Paramètres" component={ParametresScreen} />
    </Tab.Navigator>
  );
}
