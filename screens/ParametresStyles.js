import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: '#F4FBF6',
  },
  contenu: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },
  profil: {
    alignItems: 'center',
    marginBottom: 32,
  },
  surtitre: {
    color: '#6B9080',
    fontSize: 16,
    marginBottom: 8,
  },
  nom: {
    color: '#1B4332',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  emailActuel: {
    color: '#4B5563',
    fontSize: 16,
    marginTop: 6,
  },
  section: {
    marginBottom: 30,
  },
  titreSection: {
    color: '#1B4332',
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 16,
  },
  champGroupe: {
    marginBottom: 14,
  },
  label: {
    color: '#374151',
    fontSize: 16,
    marginBottom: 8,
  },
  champ: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    color: '#111827',
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bouton: {
    alignItems: 'center',
    backgroundColor: '#40916C',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 54,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  boutonTexte: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  boutonSecondaire: {
    backgroundColor: '#1B4332',
    marginTop: 0,
  },
  boutonTexteSecondaire: {
    color: '#fff',
  },
  boutonPresse: {
    opacity: 0.75,
  },
});
