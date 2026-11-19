// =====================================================================
// screens/ParametresScreen.jsx  (TP Drawer - étape 6, enrichi)
// Base du PDF : un View centré avec "Bienvenue sur les paramètres".
// [AJOUT HOOK] :
//   - useState : mémoriser les réglages
//   - useRef : compter les affichages SANS provoquer de nouvel affichage
//   - useEffect avec dépendance : réagir quand un réglage change
// (Les réglages sont une démonstration : ils ne sont pas enregistrés.)
// =====================================================================
import { useState, useRef, useEffect } from 'react';
import { View, Text, Switch, Pressable } from 'react-native';

// État de départ des réglages
const REGLAGES_INITIAUX = { notifications: true, sons: false, vibrations: true };

// Libellés affichés pour chaque clé
const LIBELLES = {
  notifications: 'Notifications',
  sons: 'Sons',
  vibrations: 'Vibrations',
};

export const ParametresScreen = () => {
  const [reglages, setReglages] = useState(REGLAGES_INITIAUX);

  // useRef : la valeur survit aux affichages, mais la modifier
  // ne redessine PAS l'écran (contrairement à un état)
  const nbAffichages = useRef(0);
  nbAffichages.current += 1;

  // useEffect avec [reglages] : exécuté à chaque changement de réglage
  useEffect(() => {
    console.log('Réglages modifiés :', reglages);
  }, [reglages]);

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4FBF6', padding: 20 }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#1B4332', marginBottom: 16 }}>
        Bienvenue sur les paramètres
      </Text>

      <View style={{ alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
        {/* Une ligne par réglage : Object.keys -> ['notifications', 'sons', ...] */}
        {Object.keys(reglages).map((cle) => (
          <View
            key={cle}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}
          >
            <Text style={{ fontSize: 16 }}>{LIBELLES[cle]}</Text>
            <Switch
              value={reglages[cle]}
              onValueChange={() =>
                setReglages((reglagesActuels) => ({
                  ...reglagesActuels,
                  [cle]: !reglagesActuels[cle],
                }))
              }
              trackColor={{ true: '#B7E4C7' }}
              thumbColor={reglages[cle] ? '#52A27A' : undefined}
            />
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => setReglages({ ...REGLAGES_INITIAUX })}
        style={({ pressed }) => [
          { backgroundColor: '#95D5B2', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, marginTop: 20 },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={{ color: '#1B4332', fontSize: 16, fontWeight: '600' }}>Réinitialiser</Text>
      </Pressable>

      <Text style={{ color: '#6B7280', marginTop: 16 }}>
        Écran affiché {nbAffichages.current} fois (compté avec useRef)
      </Text>
    </View>
  );
};
