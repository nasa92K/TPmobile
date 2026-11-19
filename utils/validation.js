// =====================================================================
// utils/validation.js  (TP Inscription - étapes 2.1 et 4.2)
// Chaque validateur renvoie un MESSAGE d'erreur, ou null si c'est valide.
// =====================================================================
const REGEX_EMAIL = /^\S+@\S+\.\S+$/;          // texte@texte.texte, sans espace
const REGEX_TELEPHONE = /^[0-9+ ]{8,15}$/;     // 8 à 15 chiffres, + ou espaces

export const validerNom = (nom) =>
  nom.trim() ? null : 'Le nom est obligatoire';

export const validerPrenom = (prenom) =>
  prenom.trim() ? null : 'Le prénom est obligatoire';

export const validerEmail = (email) =>
  REGEX_EMAIL.test(email) ? null : 'Email invalide';

// Facultatif : vide = valide
export const validerTelephone = (telephone) =>
  !telephone || REGEX_TELEPHONE.test(telephone) ? null : 'Téléphone invalide';

export const validerMdp = (mdp) =>
  mdp.length >= 6 ? null : '6 caractères minimum';

export const validerConfirmation = (mdp, confirmation) =>
  mdp === confirmation ? null : 'Les mots de passe diffèrent';

export const validerCgu = (cgu) =>
  cgu ? null : 'Vous devez accepter les CGU';

// Valide tout le formulaire et renvoie un objet { champ: message }
// Un objet vide signifie que le formulaire est valide
export const validerFormulaire = (form, cgu) => {
  const resultats = {
    nom: validerNom(form.nom),
    prenom: validerPrenom(form.prenom),
    email: validerEmail(form.email),
    telephone: validerTelephone(form.telephone),
    mdp: validerMdp(form.mdp),
    confirmation: validerConfirmation(form.mdp, form.confirmation),
    cgu: validerCgu(cgu),
  };

  // On ne garde que les champs qui ont un message (donc en erreur)
  return Object.fromEntries(
    Object.entries(resultats).filter(([, message]) => message !== null)
  );
};

// --- Connexion : on vérifie juste que le mot de passe est saisi -------
export const validerMdpSaisi = (mdp) =>
  mdp ? null : 'Le mot de passe est obligatoire';

export const validerFormulaireLogin = (form) => {
  const resultats = {
    email: validerEmail(form.email),
    mdp: validerMdpSaisi(form.mdp),
  };
  return Object.fromEntries(
    Object.entries(resultats).filter(([, message]) => message !== null)
  );
};
