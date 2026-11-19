// =====================================================================
// navigation/DrawerNavigator.jsx  (TP Drawer - partie C étape 2)
// Menu latéral avec deux entrées :
//   - "Menu Principal" : affiche les onglets du bas (TabNavigator)
//   - "Profil"
// =====================================================================
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import { ProfilScreen } from '../screens/ProfilScreen';

// Permet de créer une navigation par tiroir (menu latéral)
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    // initialRouteName : écran affiché par défaut au lancement
    <Drawer.Navigator
      initialRouteName="Menu Principal"
      // [TOUCHE PERSO] couleurs vertes pour l'en-tête et le menu
      screenOptions={{
        headerStyle: { backgroundColor: '#95D5B2' },
        headerTintColor: '#1B4332',                  // titre + bouton hamburger
        drawerActiveTintColor: '#40916C',         // entrée sélectionnée
        drawerActiveBackgroundColor: '#D8F3DC',
        drawerStyle: { backgroundColor: '#F4FBF6' },
      }}
    >
      {/* L'entrée "Menu Principal" affiche TabNavigator,
          c'est-à-dire le menu Bottom Tabs. */}
      <Drawer.Screen
        name="Menu Principal"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profil"
        component={ProfilScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
