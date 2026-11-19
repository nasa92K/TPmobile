// =====================================================================
// screens/InscriptionScreen.jsx  (TP Inscription - code complet étape 3.7)
// Formulaire d'inscription : état, validation, enregistrement SQLite.
// Les lignes marquées [AJOUT HOOK] ne sont pas dans le PDF : elles
// montrent useRef (passer au champ suivant avec la touche "Suivant").
// =====================================================================
import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, Switch, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './InscriptionStyles';
import { validerFormulaire } from '../utils/validation';
import { initDb, insererUtilisateur, listerUtilisateurs } from '../database';

// Formulaire vide réutilisable (valeur initiale + remise à zéro)
const FORMULAIRE_VIDE = {
  nom: '', prenom: '', email: '', telephone: '', mdp: '', confirmation: '',
};

export const InscriptionScreen = () => {
  // useState : un seul objet pour les 6 champs texte
  const [form, setForm] = useState(FORMULAIRE_VIDE);
  // Les interrupteurs sont des booléens : un useState chacun
  const [newsletter, setNewsletter] = useState(false);
  const [cgu, setCgu] = useState(false);
  // { champ: message } ; vide = aucune erreur
  const [erreurs, setErreurs] = useState({});

  // [AJOUT HOOK] useRef : une "boîte" qui garde une référence vers un
  // TextInput. La modifier ne redessine pas l'écran.
  const refPrenom = useRef(null);
  const refEmail = useRef(null);
  const refTelephone = useRef(null);
  const refMdp = useRef(null);
  const refConfirmation = useRef(null);

  // useEffect avec [] : exécuté UNE fois, après le premier affichage
  useEffect(() => {
    initDb().catch((e) => console.log('Erreur init base', e));
  }, []);

  // Met à jour un seul champ : on recopie l'ancien objet (...f)
  // puis on remplace la clé modifiée ([champ])
  const maj = (champ, valeur) => setForm((f) => ({ ...f, [champ]: valeur }));

  // Renvoie true si le formulaire est valide, et mémorise les erreurs
  const valider = () => {
    const e = validerFormulaire(form, cgu);
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  // async car les fonctions de la base renvoient des promesses
  const envoyer = async () => {
    if (!valider()) return; // formulaire invalide : on s'arrête
    try {
      await insererUtilisateur({ ...form, newsletter, cgu });
      Alert.alert('Inscription réussie', `Bienvenue ${form.prenom} ${form.nom} !`);

      // Vérification dans le terminal
      console.log(await listerUtilisateurs());

      // Remise à zéro du formulaire
      setForm(FORMULAIRE_VIDE);
      setNewsletter(false);
      setCgu(false);
      setErreurs({});
    } catch (e) {
      // Contrainte UNIQUE sur email -> l'email existe déjà
      if (String(e.message).includes('UNIQUE')) {
        setErreurs({ email: 'Cet email est déjà utilisé' });
      } else {
        Alert.alert('Erreur', "Impossible d'enregistrer l'utilisateur");
      }
      console.log(e);
    }
  };

  return (
    // SafeAreaView : évite l'encoche et la barre d'état
    <SafeAreaView style={styles.safe}>
      {/* KeyboardAvoidingView : remonte le contenu quand le clavier s'ouvre */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ScrollView : le formulaire est plus haut que l'écran */}
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          <Text style={styles.titre}>Créer un compte</Text>

          <View style={styles.groupe}>
            <Text style={styles.label}>Nom</Text>
            {/* Champ contrôlé : value vient de l'état, onChangeText le met à jour */}
            <TextInput
              style={[styles.champ, erreurs.nom && styles.champErreur]}
              placeholder="Dupont"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              value={form.nom}
              onChangeText={(t) => maj('nom', t)}
              returnKeyType="next"                              // [AJOUT HOOK]
              onSubmitEditing={() => refPrenom.current?.focus()} // [AJOUT HOOK]
            />
            {/* Le message ne s'affiche que s'il y a une erreur */}
            {erreurs.nom && <Text style={styles.erreur}>{erreurs.nom}</Text>}
          </View>

          <View style={styles.groupe}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              ref={refPrenom}                                    // [AJOUT HOOK]
              style={[styles.champ, erreurs.prenom && styles.champErreur]}
              placeholder="Marie"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              value={form.prenom}
              onChangeText={(t) => maj('prenom', t)}
              returnKeyType="next"                              // [AJOUT HOOK]
              onSubmitEditing={() => refEmail.current?.focus()}  // [AJOUT HOOK]
            />
            {erreurs.prenom && <Text style={styles.erreur}>{erreurs.prenom}</Text>}
          </View>

          <View style={styles.groupe}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              ref={refEmail}                                     // [AJOUT HOOK]
              style={[styles.champ, erreurs.email && styles.champErreur]}
              placeholder="marie@mail.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={form.email}
              onChangeText={(t) => maj('email', t)}
              returnKeyType="next"                                  // [AJOUT HOOK]
              onSubmitEditing={() => refTelephone.current?.focus()} // [AJOUT HOOK]
            />
            {erreurs.email && <Text style={styles.erreur}>{erreurs.email}</Text>}
          </View>

          <View style={styles.groupe}>
            <Text style={styles.label}>Téléphone (facultatif)</Text>
            <TextInput
              ref={refTelephone}                                 // [AJOUT HOOK]
              style={[styles.champ, erreurs.telephone && styles.champErreur]}
              placeholder="06 12 34 56 78"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={form.telephone}
              onChangeText={(t) => maj('telephone', t)}
              returnKeyType="next"                              // [AJOUT HOOK]
              onSubmitEditing={() => refMdp.current?.focus()}    // [AJOUT HOOK]
            />
            {erreurs.telephone && <Text style={styles.erreur}>{erreurs.telephone}</Text>}
          </View>

          <View style={styles.groupe}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              ref={refMdp}                                       // [AJOUT HOOK]
              style={[styles.champ, erreurs.mdp && styles.champErreur]}
              placeholder="••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={form.mdp}
              onChangeText={(t) => maj('mdp', t)}
              returnKeyType="next"                                     // [AJOUT HOOK]
              onSubmitEditing={() => refConfirmation.current?.focus()}  // [AJOUT HOOK]
            />
            {erreurs.mdp && <Text style={styles.erreur}>{erreurs.mdp}</Text>}
          </View>

          <View style={styles.groupe}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput
              ref={refConfirmation}                              // [AJOUT HOOK]
              style={[styles.champ, erreurs.confirmation && styles.champErreur]}
              placeholder="••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={form.confirmation}
              onChangeText={(t) => maj('confirmation', t)}
            />
            {erreurs.confirmation && <Text style={styles.erreur}>{erreurs.confirmation}</Text>}
          </View>

          {/* Switch contrôlé : onValueChange reçoit directement true/false */}
          <View style={styles.ligneSwitch}>
            <Text style={styles.libelle}>Recevoir la newsletter</Text>
            <Switch
              value={newsletter}
              onValueChange={setNewsletter}
              trackColor={{ true: '#B7E4C7' }}                   // [TOUCHE PERSO]
              thumbColor={newsletter ? '#52A27A' : undefined}    // [TOUCHE PERSO]
            />
          </View>

          <View style={styles.ligneSwitch}>
            <Text style={styles.libelle}>J'accepte les CGU</Text>
            <Switch
              value={cgu}
              onValueChange={setCgu}
              trackColor={{ true: '#B7E4C7' }}                   // [TOUCHE PERSO]
              thumbColor={cgu ? '#52A27A' : undefined}           // [TOUCHE PERSO]
            />
          </View>
          {erreurs.cgu && <Text style={styles.erreur}>{erreurs.cgu}</Text>}

          {/* Pressable : style en fonction qui reçoit "pressed" */}
          <Pressable
            onPress={envoyer}
            style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
          >
            <Text style={styles.boutonTexte}>S'inscrire</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
