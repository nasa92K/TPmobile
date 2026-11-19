import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useUtilisateur } from '../context/UtilisateurContext';
import { changerMotDePasse, modifierEmail } from '../database';
import { validerConfirmation, validerEmail, validerMdp } from '../utils/validation';
import styles from './ParametresStyles';

const Champ = ({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType }) => (
  <View style={styles.champGroupe}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.champ}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoCorrect={false}
    />
  </View>
);

const Bouton = ({ titre, onPress, secondaire = false }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.bouton,
      secondaire && styles.boutonSecondaire,
      pressed && styles.boutonPresse,
    ]}
  >
    <Text style={[styles.boutonTexte, secondaire && styles.boutonTexteSecondaire]}>{titre}</Text>
  </Pressable>
);

export const ParametresScreen = () => {
  const { utilisateur, deconnecter, mettreAJourUtilisateur } = useUtilisateur();
  const [nouvelEmail, setNouvelEmail] = useState('');
  const [motDePasseActuel, setMotDePasseActuel] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const enregistrerEmail = async () => {
    const email = nouvelEmail.trim().toLowerCase();
    const erreur = validerEmail(email);
    if (erreur) return Alert.alert('Adresse invalide', erreur);
    if (email === utilisateur.email.toLowerCase()) {
      return Alert.alert('Adresse inchangée', 'Cette adresse est déjà associée à votre compte.');
    }

    try {
      const resultat = await modifierEmail(utilisateur.id, email);
      if (!resultat.ok) return Alert.alert('Adresse indisponible', resultat.message);
      mettreAJourUtilisateur({ email });
      setNouvelEmail('');
      Alert.alert('Adresse modifiée', 'Votre adresse e-mail a été mise à jour.');
    } catch (e) {
      Alert.alert('Erreur', "Impossible de modifier l'adresse e-mail.");
    }
  };

  const enregistrerMotDePasse = async () => {
    if (!motDePasseActuel) return Alert.alert('Mot de passe manquant', 'Saisissez votre mot de passe actuel.');
    const erreurMdp = validerMdp(nouveauMotDePasse);
    if (erreurMdp) return Alert.alert('Nouveau mot de passe invalide', erreurMdp);
    const erreurConfirmation = validerConfirmation(nouveauMotDePasse, confirmation);
    if (erreurConfirmation) return Alert.alert('Confirmation invalide', erreurConfirmation);

    try {
      const modifie = await changerMotDePasse(utilisateur.id, motDePasseActuel, nouveauMotDePasse);
      if (!modifie) return Alert.alert('Mot de passe incorrect', 'Vérifiez votre mot de passe actuel.');
      setMotDePasseActuel('');
      setNouveauMotDePasse('');
      setConfirmation('');
      Alert.alert('Mot de passe modifié', 'Votre nouveau mot de passe est enregistré.');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de modifier le mot de passe.');
    }
  };

  return (
    <ScrollView
      style={styles.ecran}
      contentContainerStyle={styles.contenu}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.profil}>
        <Text style={styles.surtitre}>Bienvenue sur votre profil</Text>
        <Text style={styles.nom}>{utilisateur?.prenom} {utilisateur?.nom}</Text>
        <Text style={styles.emailActuel}>{utilisateur?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.titreSection}>Changer d’adresse e-mail</Text>
        <Champ
          label="Nouvelle adresse e-mail"
          value={nouvelEmail}
          onChangeText={setNouvelEmail}
          placeholder="Entrez votre nouvelle adresse e-mail"
          keyboardType="email-address"
        />
        <Bouton titre="CHANGER L’E-MAIL" onPress={enregistrerEmail} />
      </View>

      <View style={styles.section}>
        <Text style={styles.titreSection}>Changer de mot de passe</Text>
        <Champ
          label="Mot de passe actuel"
          value={motDePasseActuel}
          onChangeText={setMotDePasseActuel}
          placeholder="Entrez votre mot de passe actuel"
          secureTextEntry
        />
        <Champ
          label="Nouveau mot de passe"
          value={nouveauMotDePasse}
          onChangeText={setNouveauMotDePasse}
          placeholder="Entrez votre nouveau mot de passe"
          secureTextEntry
        />
        <Champ
          label="Confirmer le nouveau mot de passe"
          value={confirmation}
          onChangeText={setConfirmation}
          placeholder="Confirmez votre nouveau mot de passe"
          secureTextEntry
        />
        <Bouton titre="CHANGER LE MOT DE PASSE" onPress={enregistrerMotDePasse} />
      </View>

      <Bouton titre="SE DÉCONNECTER" onPress={deconnecter} secondaire />
    </ScrollView>
  );
};
